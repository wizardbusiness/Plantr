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
      // newPlant properties relate to columns in plants table in postgreSQL db. 
      // columns in db: plant_id, name, img, light, soil, fertilizer, notes, day, week, month, morning, evening, mid, mist, water_date, fertilize_date
      // note that plant_id is defined in database, not new plant state. 
      newPlant: {
        name: '',
        img: '',
        light: '',
        soil: '',
        fertilizer: '',
        notes: '',
        // columns days, weeks, months
        date: {
          days: 0,
          weeks: 0, 
          months: 0
        },
        // columns morning, mid, evening
        tod: {
          morning: true,
          mid: false,
          evening: false
        },
        mist: false,
        water_date: new Date(),
        fertilizeDate: ''
      },
    }
    this.processDbPlantForFrontendState = this.processDbPlantForFrontendState.bind(this);
    this.getPlants = this.getPlants.bind(this);
    this.viewSavedPlants = this.viewSavedPlants.bind(this);
    this.setScheduleState = this.setScheduleState.bind(this);
    this.setTextfieldState = this.setTextfieldState.bind(this);
    this.setMistState = this.setMistState.bind(this);
    this.setPlantState = this.setPlantState.bind(this);
    this.resetPlantState = this.resetPlantState.bind(this);
    this.createDateFromSchedule = this.createDateFromSchedule.bind(this);
    this.checkSchedule = this.checkSchedule.bind(this);
    this.savePlant = this.savePlant.bind(this);
    this.editPlant = this.editPlant.bind(this);
    this.clonePlant = this.clonePlant.bind(this);
    this.savePlantEdits = this.savePlantEdits.bind(this);
    this.deletePlant = this.deletePlant.bind(this);
  }
  // unimplemented: 
  // convert current date to a water at date by adding the schedule values in state to current date.
    // then round to 7 am, 12pm or 6pm depending on the tod chosen. DONE
  // check the current date against the water and fertilize dates
  // if they are the same, change color of plant.
  // water button feature
  // after clicking 'water' button, update the water and fertilize at dates in the the database according to the original time.  
  
  componentDidMount() {
    this.getPlants();
  };

  componentDidUpdate() {
    console.log('plantview just updated')
  };

  createDateFromSchedule(scheduleObj, timeOfDay, scheduleType, stateObjStr) {
    // schedule interval in days
    let intervalInDays = 0;
    // get current date
    const date = new Date();
    // iterate through schedule dropDown
    for (let interval in scheduleObj) {
  
    // convert all values to days and add to intervalInDays
      // if (interval === 'days') intervalInDays += 1 * scheduleObj[interval];
      if (interval === 'weeks') intervalInDays += 7 * scheduleObj[interval]; 
    };

    // check if scheduled time of day is morning, if not evaluate if it is mid, if not, then evaluate to 18 (evening 6 pm).
    const scheduledTime = timeOfDay === 'morning' ? 6 : timeOfDay === 'mid' ? 12 : 18;
    // add to current date
    date.setDate(date.getDate() + intervalInDays);
    date.setHours(scheduledTime);
    date.setMinutes(0);
    date.setSeconds(0);
    
    // set date state
    this.setState({
      ...this.state,
      [stateObjStr]: {
        ...this.state[stateObjStr],
        [scheduleType]: date
      }
    }, () => console.log(this.state[stateObjStr]));

    return date;
  }

  checkSchedule(date) { 
    // create new current date. 
    // convert both dates to milliseconds
    const check = setInterval(() => {
      const currentDate = new Date().getTime();
      const scheduledDate = new Date(date).getTime();
      // if scheduled date is less than current date, {css logic} (for now just console log that plant needs watering or fertilizing)
      const result = scheduledDate <= currentDate ? console.log('plant needs watering!') : false;
      return result;
    }, 3000)

    return check;
}

  processDbPlantForFrontendState(plants) {
    return plants.map(plant => {
      const processedPlantObj = {tod: {}, date: {}};
      // even though the for loop is nested, there is a fixed number of props, so it is basically constant insertion. 
      for (const prop in plant) {
        // use newPLant state as a template for renesting state. Yes this is dumb
        if (prop in this.state.newPlant) processedPlantObj[prop] = plant[prop];
        else if (prop === 'plant_id') processedPlantObj[prop] = plant[prop];
        else if (prop ===  'mid' || prop === 'evening' || prop === 'morning') processedPlantObj['tod'][prop] = plant[prop];
        else if (prop === 'days' || prop === 'weeks' || prop === 'months') processedPlantObj['date'][prop] = plant[prop];
      };

      return processedPlantObj;
    });
  }

  // GET PLANTS: retrieves all plants in the db. 
  async getPlants() {
    try {
      const response = await fetch('/plants')
      const plants = await response.json();
      console.log(plants);


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
      newPlant: {
        ...this.state.newPlant, 
        // reset new plant state object to default values.
        name: '',
        img: '',
        light: '',
        soil: '',
        fertilizer: '',
        notes: '',
        date: {
          ...this.state.newPlant.date,
          days: 0,
          weeks: 0, 
          months: 0
        },
        tod: {
          ...this.state.newPlant.tod,
          morning: true,
          mid: false,
          evening: false
        },
        mist: false,
        water_date: new Date(),
        fertilizeDate: new Date()
      },
    });
  }
  // SET PLANT STATE: Updates properties of a new or edited plant in state when the user fills out the new or edited plant form.
  // args: property being updated, updated value.  
  setScheduleState(scheduleType, dateUnit, value) {
    if (scheduleType === 'date') {
      console.log(scheduleType, dateUnit, value)
      this.setState({
        ...this.state,
        newPlant: {
          ...this.state.newPlant,
          [scheduleType]: {
            ...this.state.newPlant[scheduleType],
            [dateUnit]: value,
          }
        }
      }, () => console.log(this.state.newPlant.date));
    } 
  }

  setTextfieldState(name, value) {
    this.setState({
      ...this.state,
      newPlant: {
        ...this.state.newPlant,
        [name]: value      
      }
    }, () => console.log(this.state.newPlant))
  }

  setMistState() {
    this.setState({
      ...this.state,
      newPlant: {
        ...this.state.newPlant,
        mist: this.state.newPlant.mist === false ? this.state.newPlant.mist = true : this.state.newPlant.mist = false
      }
    }, () => console.log(this.state.newPlant.mist))
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

    // set date
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
    if (dropdown === 'tod') {
      setTime(dropdown, propertyToChange, keys)
    } else if (dropdown === 'date') {
      setDateDropdown(dropdown, propertyToChange, value);
    } else if (propertyToChange === 'mist') {
      toggleMist();
    } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
      setOther(propertyToChange, value);
    }
  };


  // SAVE PLANT: saves a new plant to the db, and in the plants array in state for display. 
  async savePlant() {
    
    // table columns: plant_id, name, img, light, soil, fertilizer, notes, day, week, month, morning, evening, mid, mist, water_date, fertilizeDate

    // calculate dates
    // scheduleObj, timeOfDay, scheduleType, stateObjStr

    const scheduleObj = this.state.newPlant.water_date;
    const timeOfDay = Object.entries(this.state.newPlant.tod).filter(entry => entry[1])[0][0];
    const water_date = await this.createDateFromSchedule(scheduleObj, timeOfDay, 'water_date', )
    
    // destructure state
    
    const { 
      // plantId, 
      name, 
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      date: { days, weeks, months }, 
      tod: { morning, evening, mid }, 
      mist,
      // fertilizeDate
    } = this.state.newPlant;

    // add all values from destructured state to request body
    const body = {
      // plantId, 
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
      mid, 
      mist,
      water_date, 
      // fertilizeDate
    };

    console.log(water_date)

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
      const newPlant = await plantTableResponse.json();
      // after okay from database, use local state to add plant to plants. It's faster than sending the response body
      this.setState({
        plants: [...this.state.plants, {...this.state.newPlant, plant_id: newPlant.plant_id}],
      }, () => {
        console.log(body);
        this.resetPlantState()
      });
      return;
    } catch (err) {
      console.log(err);
    };
  };


  // EDIT PLANT METHODS ---------------------------------------------------------------------------------------------------------

  // EDIT PLANT (Frontend state): edits the stateful properties of the plant being edited in the isolated editPlant state object.
  // args: property being edited, value being edited.
  editPlant(property, value) {
      this.setState({
        editedPlant: {...this.state.editedPlant, [property]: value}
      });
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

    // table columns: plant_id, name, img, light, soil, fertilizer, notes, day, week, month, morning, evening, mid, mist, water_date, fertilizeDate
    
    // destructure state
    const { 
      plant_id, 
      name, 
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      date: { days, weeks, months }, 
      tod: { morning, evening, mid }, 
      mist, 
      // water_date, 
      // fertilizeDate
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
      mid, 
      mist, 
      // water_date, 
      // fertilizeDate
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
          plantInfo={plant}
          // plant methods
          checkSchedule={this.checkSchedule}
          editPlant={this.editPlant}
          clonePlant={this.clonePlant}
          savePlantEdits={this.savePlantEdits}
          setPlantState={this.setPlantState}
          deletePlant={this.deletePlant}
          editedPlant={this.state.editedPlant}
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
              fieldValues={this.state.newPlant}
              setTextfieldState={this.setTextfieldState}
              getPlants={this.getPlants} 
              setScheduleState={this.setScheduleState}
              setMistState={this.setMistState}
              currentSchedule={this.state.newPlant.date}
              btnText='Add Plant'
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