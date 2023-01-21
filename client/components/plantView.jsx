import React, {Component} from 'react';
import Plant from './plant';
import NewPlantModal from './NewPlantModal';
import PlantModal from './PlantModal';
import PlantForm from './PlantForm';

class PlantView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editPlant: {
        saveEdit: true,
      },
      plants: [],
      editedPlant: {},
      // plant properties relate to columns in plants table in postgreSQL db. 
      // columns in db: plant_id, name, img, light, soil, fertilizer, notes, day, week, month, morning, evening, midday, mist, next_water_date, next_fertilize_date
      // note that plant_id is defined in database, not new plant state. 
      plant: {
        name: '',
        img: '',
        light: '',
        soil: '',
        fertilizer: '',
        notes: '',
        watering_schedule: {
          days: 0,
          weeks: 0, 
          months: 0
        },
        fertilizer_schedule: {
          days: 0,
          weeks: 0,
          months: 0
        },
        watering_time_of_day: {
          morning: true,
          midday: false,
          evening: false
        },
        fertilizing_time_of_day: {
          morning: true,
          midday: false,
          evening: false
        },
        mist: false,
        next_water_date: new Date(),
        next_fertilize_date: new Date()
      },
    }
    this.processDbPlantForFrontendState = this.processDbPlantForFrontendState.bind(this);
    this.getPlants = this.getPlants.bind(this);
    this.viewSavedPlants = this.viewSavedPlants.bind(this);
    this.setScheduleState = this.setScheduleState.bind(this);
    this.setTextfieldState = this.setTextfieldState.bind(this);
    this.setMistState = this.setMistState.bind(this);
    this.resetPlantState = this.resetPlantState.bind(this);
    this.createDateFromSchedule = this.createDateFromSchedule.bind(this);
    this.checkSchedule = this.checkSchedule.bind(this);
    this.addPlant = this.addPlant.bind(this);
    this.editPlant = this.editPlant.bind(this);
    this.clonePlant = this.clonePlant.bind(this);
    this.savePlantEdits = this.savePlantEdits.bind(this);
    this.deletePlant = this.deletePlant.bind(this);
  }
  // unimplemented: 
  // convert current watering_schedule to a water at watering_schedule by adding the schedule values in state to current watering_schedule.
    // then round to 7 am, 12pm or 6pm depending on the watering_time_of_day chosen. DONE
  // check the current watering_schedule against the water and fertilize dates
  // if they are the same, change color of plant.
  // water button feature
  // after clicking 'water' button, update the water and fertilize at dates in the the database according to the original time.  
  
  componentDidMount() {
    this.getPlants();
  };

  componentDidUpdate() {
    console.log('plantview just updated')
  };

  createDateFromSchedule(scheduleObj, scheduledTime, dateDesc) {
    // schedule interval in days
    let intervalInDays = 0;
    // get current date
    // console.log(scheduleObj)
    const scheduledDate = new Date();
    // iterate through schedule dropDown
    for (let interval in scheduleObj) {
    // convert all values to days and add to intervalInDays
      if (interval === 'days') intervalInDays += 1 * scheduleObj[interval];
      if (interval === 'weeks') intervalInDays += 7 * scheduleObj[interval]; 
    };

    // check if scheduled time of day is morning, if not evaluate if it is midday, if not, then evaluate to (evening 18:00).
    const timeOfDay = scheduledTime === 'morning' ? 6 : scheduledTime === 'midday' ? 12 : 18;
    // add to current scheduledDate
    scheduledDate.setDate(scheduledDate.getDate() + intervalInDays);
    scheduledDate.setHours(timeOfDay);
    scheduledDate.setMinutes(0);
    scheduledDate.setSeconds(0);
    
    // set scheduledDate state
    this.setState({
      ...this.state,
      plant: {
        ...this.state.plant,
        [dateDesc]: scheduledDate
      }
    }, () => console.log(this.state.plant));

    return scheduledDate;
  }

  checkSchedule(watering_schedule) { 
    // create new current watering_schedule. 
    // convert both dates to milliseconds
    const check = setInterval(() => {
      const currentDate = new Date().getTime();
      const scheduledDate = new Date(watering_schedule).getTime();
      // if scheduled watering_schedule is less than current watering_schedule, {css logic} (for now just console log that plant needs watering or fertilizing)
      const result = scheduledDate <= currentDate ? console.log('plant needs watering!') : false;
      return result;
    }, 3000)

    return check;
}

  processDbPlantForFrontendState(plants) {
     // deeply copy plant object from state
    
    return plants.map(plant => {
      const processedPlantObj = JSON.parse(JSON.stringify(this.state.plant));
      // even though the for loop is nested, there is a fixed number of props, so it is basically constant insertion.
      for (const property in plant) {
        if (property === 'plant_id') {
          processedPlantObj[property] = plant[property]
        } else if (property in processedPlantObj) {
          processedPlantObj[property] = plant[property];
          // match property on nested schedule object
        } else if (property[0] === 'f' || property[0] === 'w') {
            let propertyMatch;
            if (property.match(/days/i)) propertyMatch = property.match(/days/i)
            else if (property.match(/weeks/i)) propertyMatch = property.match(/weeks/i)
            else if (property.match(/months/i)) propertyMatch = property.match(/months/i);
            // match schedule type and assign property to the right one
            if (property[0] === 'w') processedPlantObj.watering_schedule[propertyMatch] = plant[property];
            if (property[0] === 'f') processedPlantObj.fertilizer_schedule[propertyMatch] = plant[property];
        }  
      };
      return processedPlantObj;
    });
  }

  // GET PLANTS: retrieves all plants in the db. 
  async getPlants() {
    try {
      const response = await fetch('/plants')
      const plants = await response.json()
      // convert plant state in db back to state structure in react state. 
     this.setState({
        ...this.state.plants,
        // update the entire plants array from the db. 
        plants: this.processDbPlantForFrontendState(plants).sort((a, b) => a.plant_id < b.plant_id ? -1 : 1)  
      });
    } catch (err) {
      console.log(err);
    }
  }
  
  resetPlantState() {
    this.setState({
      ...this.state,
      plant: {
        ...this.state.plant, 
        // reset new plant state object to default values.
        name: '',
        img: '',
        light: '',
        soil: '',
        fertilizer: '',
        notes: '',
        watering_schedule: {
          ...this.state.plant.watering_schedule,
          days: 0,
          weeks: 0, 
          months: 0
        },
        fertilizer_schedule: {
          ...this.state.plant.fertilizer_schedule,
          days: 0,
          weeks: 0,
          months: 0
        },
        watering_time_of_day: {
          ...this.state.plant.watering_time_of_day,
          morning: true,
          midday: false,
          evening: false
        },
        fertilizing_time_of_day: {
          ...this.state.plant.fertilizerTimeOfDay,
          morning: true,
          midday: false,
          evening: false
        },
        mist: false,
        next_water_date: new Date(),
        next_fertilize_date: new Date(),
      },
    });
  }
  // SET PLANT STATE: Updates properties of a new or edited plant in state when the user fills out the new or edited plant form.
  // args: property being updated, updated value.  
  setScheduleState(scheduleType, dateUnit, value) {
    if (scheduleType === 'watering_schedule') {
      console.log(scheduleType, dateUnit, value)
      this.setState({
        ...this.state,
        plant: {
          ...this.state.plant,
          [scheduleType]: {
            ...this.state.plant[scheduleType],
            [dateUnit]: value,
          }
        }
      });
    } else if (scheduleType === 'fertilizer_schedule') {
      this.setState({
        ...this.state,
        plant: {
          ...this.state.plant,
          [scheduleType]: {
            ...this.state.plant[scheduleType],
            [dateUnit]: value,
          }
        }
      }, () => console.log(this.state.plant.fertilizer_schedule));
    };
    return; 
  }

  setTextfieldState(name, value) {
    this.setState({
      ...this.state,
      plant: {
        ...this.state.plant,
        [name]: value      
      }
    });
  }

  setMistState() {
    this.setState({
      ...this.state,
      plant: {
        ...this.state.plant,
        mist: this.state.plant.mist === false ? this.state.plant.mist = true : this.state.plant.mist = false
      }
    });
  }
  // input: state object to update, dropdown, property being changed, value, property names in object
  setPlantState(stateObjectName, dropdown, propertyToChange, value=0, keys=[]) {
    // set time
    const setTime = (dropdown, pickedTime=propertyToChange, keys) => {
      const notPickedOpts = keys.filter(key => key !== propertyToChange);
      this.setState({
        ...this.state,
        [stateObjectName]:{
          ...this.state[stateObjectName],
          [dropdown]: {
            ...this.state[stateObjectName][dropdown],
            // set not picked times to false. 
            [notPickedOpts[0]]: false,
            [notPickedOpts[1]]: false,
            // set picked time to true
            [propertyToChange]: true,
          }
        }
      });
    }

    // set watering_schedule
    const setDateDropdown = (dropdown, pickedDate=propertyToChange, value) => {
      this.setState({
        ...this.state,
        [stateObjectName]: {
          ...this.state[stateObjectName],
          [dropdown]: {
            ...this.state[stateObjectName][dropdown],
            [pickedDate]: value
          }
        }
      });
    }

    // toggle mist
    const toggleMist = () => {
      this.setState({
        ...this.state,
        [stateObjectName]: {
          ...this.state[stateObjectName],
          mist: this.state[stateObjectName].mist === false ? this.state[stateObjectName].mist = true : false
        }
      })
    }

    // set other value
    const setOther = (propertyToChange, value) => {
      this.setState({
        [stateObjectName]: {
          ...this.state[stateObjectName],
          [propertyToChange]: value,
        }
      });
    }
    
    // depending on the property being targeted, use one of the above methods to set the relevant state. 
    if (dropdown === 'watering_time_of_day') {
      setTime(dropdown, propertyToChange, keys)
    } else if (dropdown === 'watering_schedule') {
      setDateDropdown(dropdown, propertyToChange, value);
    } else if (propertyToChange === 'mist') {
      toggleMist();
    } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
      setOther(propertyToChange, value);
    }
  };


  // SAVE PLANT: saves a new plant to the db, and in the plants array in state for display. 
  async addPlant(e) {
    e.preventDefault();
    // table columns: plant_id, name, img, light, soil, fertilizer, notes, day, week, month, morning, evening, midday, mist, next_water_date, next_fertilize_date

    // calculate dates
    // scheduleObj, scheduledTime, dateDesc, stateObjStr
    const wateringSchedule = this.state.plant.watering_schedule;
    const wateringTime = Object.entries(this.state.plant.watering_time_of_day).filter(entry => entry[1])[0][0];
    const next_water_date = await this.createDateFromSchedule(wateringSchedule, wateringTime, 'next_water_date');
    const fertilizingSchedule = this.state.plant.fertilizer_schedule;
    const fertilizeTime = Object.entries(this.state.plant.watering_time_of_day).filter(entry => entry[1])[0][0];
    const next_fertilize_date = await(this.createDateFromSchedule(fertilizingSchedule, fertilizeTime, 'next_fertilize_date'))
    // destructure state
    const { 
      name, 
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      mist,
      watering_schedule, 
      fertilizer_schedule,
    } = this.state.plant;

    // add all values from destructured state to request body
    const body = {
      name, 
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      watering_schedule,
      fertilizer_schedule,
      mist,
      next_water_date,
      next_fertilize_date
    };
    try {
      const plantTableResponse = await fetch('/plants', {
        method: 'POST', 
        headers: {
          'Content-Type': 'Application/JSON'
        },
        // send the values from new plant in state to the db. 
        body: JSON.stringify(body)
      });
      // wait for the okay from the db.
      const plant = await plantTableResponse.json();
      // after okay from database, use local state to add plant to plants. It's faster than sending the response body
      this.setState({
        plants: [...this.state.plants, {...this.state.plant, plant_id: plant.plant_id}],
      }, () => {
        this.resetPlantState()
      });
      return;
    } catch (err) {
      console.log(err);
    };
  };


  // EDIT PLANT METHODS ---------------------------------------------------------------------------------------------------------

  // EDIT PLANT (Frontend state): edits the stateful properties of the plant being edited in the isolated editPlant state object.
  editPlant(plant) {
      for (const property in plant) {
        if (property in this.state.plant){
          this.setState({
            ...this.state,
            plant: {
              ...this.state.plant, 
              [property]: plant[property]
            }
          });
        }
      }
      
  }

  // CLONE PLANT: clones the plant being edited to location in state. 
  // args: index of plant being edited. 
  clonePlant(index) {
    // when edit modal is opened,
    // clone the plant being edited to the editedPlant property in state. 
    this.setState({
      editedPlant: this.state.plants[index]
    });
  }
  
  // SAVE PLANT EDITS: save any edits made to a plant to the db and replace the existing plant in state. 
  async savePlantEdits () {

    // table columns: plant_id, name, img, light, soil, fertilizer, notes, day, week, month, morning, evening, midday, mist, next_water_date, next_fertilize_date
    
    // destructure state
    const { 
      plant_id, 
      name, 
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      watering_schedule: { days, weeks, months }, 
      watering_time_of_day: { morning, evening, midday }, 
      mist, 
      // next_water_date, 
      // next_fertilize_date
    } = this.state.editedPlant;

    const body = {
      plant_id,
      name, 
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      days, 
      weeks, 
      months, 
      morning, 
      evening, 
      midday, 
      mist, 
      // next_water_date, 
      // next_fertilize_date
    };

    try {
      const response = await fetch(`/plants/${plant_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'Application/JSON'
        },
        // send 
        body: JSON.stringify(body)
      })

      // wait for the database to send back a response before proceeding.
      const dbResponseOk = await response.json();
      const plants = this.state.plants;
      const editedPlant = this.state.editedPlant;

      this.setState({
        // replace the plant entirely with the editedPlant stateful object. 
        plants: plants.map((plant, index) => plant.plant_id === plant_id ? plants[index] = editedPlant : plant)
      });
    } catch (err) {
      console.log(err);
    };
  }

  // -----------------------------------------------------------------------------------------------------------------

  // DELETE PLANT: deletes a saved plant from the database and from state. 
  async deletePlant (plant_id) {
    console.log(plant_id)
    try {
      const response = await fetch(`/plants/${plant_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'Application/JSON'
        },
      });
      
      const dbResponseOk = await response.json();
      
      const plants = this.state.plants;
      this.setState({
        // filter plant to be deleted out of saved state in plants.  
        plants: plants.filter(plant => plant.plant_id !== plant_id)
      });
    } catch (err) {
      console.log(err);
    }
  }

  // VIEW SAVED PLANTS: maps the properties of all plants saved in state to jsx plant components. 
  viewSavedPlants(plants) {
    return plants.map((plant, index) => {
      return (
        <Plant 
          key={`plant${index}`}
          // plant properties
          index={index}
          plantState={plant}
          genericPlantState={this.state.plant}
          // plant methods
          resetPlantState={this.resetPlantState}
          checkSchedule={this.checkSchedule}
          editPlant={this.editPlant}
          savePlantEdits={this.savePlantEdits}
          deletePlant={this.deletePlant}
          editedPlantState={this.state.plant}
        /> 
     );
    });
  }

  render() {
    const plants = this.viewSavedPlants(this.state.plants)
    return (
        <div className="planter-box">
          <PlantModal
            buttonId="new-plant"
            buttonText="+"
            resetPlantState={this.resetPlantState}
          >
            <PlantForm
              formName='add-plant'
              btnText='Add Plant'
              // getPlants={this.getPlants} 
              submitPlant={this.addPlant}
              setTextfieldState={this.setTextfieldState}
              setScheduleState={this.setScheduleState}
              setMistState={this.setMistState}
              plantState={this.state.plant}
            >
            </PlantForm>
          </PlantModal>
            
          {/* <button 
            id="new-plant"
          >+</button> */}
          <div className="plants">{plants}</div>
        </div>   
    )
  }
}

export default PlantView;