import React, {Component} from 'react';
import Plant from './Plant';
import PlantModal from './PlantModal';

class PlantView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      plants: [],
      // plant properties relate to columns in plants table in postgreSQL db. 
      // note that plant_id is defined in database, not new plant state. 
      plant: {
        plant_species: '',
        name: '',
        img: '',
        light: '',
        soil: '',
        fertilizer: '',
        notes: '',
        watering_schedule: {
          unselected_date: true,
          days: 0,
          weeks: 0, 
          months: 0
        },
        fertilizer_schedule: {
          unselected_date: true, 
          days: 0,
          weeks: 0,
          months: 0
        },
        watering_time_of_day: {
          unselected_tod: true,
          morning: false,
          midday: false,
          evening: false
        },
        fertilize_time_of_day: {
          unselected_tod: true,
          morning: false,
          midday: false,
          evening: false
        },
        mist: false,
        initial_water_date: null,
        next_water_date: null,
        initial_fertilize_date: null,
        next_fertilize_date: null,
      },
    }
    this.processDbPlantForFrontendState = this.processDbPlantForFrontendState.bind(this);
    this.getPlants = this.getPlants.bind(this);
    this.viewSavedPlants = this.viewSavedPlants.bind(this);
    this.setScheduleState = this.setScheduleState.bind(this);
    this.setTimeOfDayState = this.setTimeOfDayState.bind(this);
    this.setTextfieldState = this.setTextfieldState.bind(this);
    this.setMistState = this.setMistState.bind(this);
    this.resetPlantState = this.resetPlantState.bind(this);
    this.createDatesFromSchedule = this.createDatesFromSchedule.bind(this);
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


  createDatesFromSchedule(scheduleObj, typeOfScheduledDate, typeOfInitialDate) {
    if (scheduleObj.unselected_tod === true) return null;
    const scheduledTime = Object.entries(this.state.plant.watering_time_of_day).filter(entry => entry[1])[0][0];
    // schedule interval in days
    let intervalInDays = 0;
    // get current date
    // console.log(scheduleObj)
    const scheduledDate = new Date();
    // only change the initial date if there is none in the plant state. 
    const initialDate = this.state.plant[typeOfInitialDate] ? this.state.plant[typeOfInitialDate] : new Date();
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
        [typeOfScheduledDate]: scheduledDate,
        [typeOfInitialDate]: initialDate !== this.state.plant[initialDate] ? initialDate : this.state.plant[initialDate]
      }
    });
    return scheduledDate;
  }

  processDbPlantForFrontendState(plants) {
    const plantObj = plants.map(plant => {
      // deeply copy plant object from state. 
      // this will serve as the basis for each individual plantObj
      const processedPlantObj = JSON.parse(JSON.stringify(this.state.plant));
      // even though the for loop is nested, there is a fixed number of props, so it is basically O(n) insertion.
      for (const property in plant) {
        if (property === 'plant_id') {
          processedPlantObj[property] = plant[property]
        } else if (property in processedPlantObj) {
          processedPlantObj[property] = plant[property];
          // match property on fertilzer schedule objects
        } else if (property[0] === 'w') {
          const processedProperty = property.slice(2);
          if (processedProperty === 'days' || processedProperty === 'weeks' || processedProperty === 'months' ) {
            processedPlantObj.watering_schedule[processedProperty] = plant[property];
          } else if (processedProperty === 'unselected_tod' || processedProperty === 'morning' || processedProperty === 'midday' || processedProperty === 'evening') {
            processedPlantObj.watering_time_of_day[processedProperty] = plant[property];
          };
        } else if (property[0] === 'f') {
          const processedProperty = property.slice(2);
          if (processedProperty === 'days' || processedProperty === 'weeks' || processedProperty === 'months' ) {
            processedPlantObj.fertilizer_schedule[processedProperty] = plant[property];
          } else if (processedProperty === 'unselected_tod' || processedProperty === 'morning' || processedProperty === 'midday' || processedProperty === 'evening') {
            processedPlantObj.fertilize_time_of_day[processedProperty] = plant[property];
          };
        };
      }
      return processedPlantObj
    });
    return plantObj;
  }

  // GET PLANTS: retrieves all plants in the db. 
  async getPlants() {
    try {
      const response = await fetch('/plants');
      const plants = await response.json();
      console.log(this.processDbPlantForFrontendState(plants));
      // convert plant state in db back to state structure in react state. 
     this.setState({
        ...this.state.plants,
        // update the entire plants array from the db. 
        plants: this.processDbPlantForFrontendState(plants).sort((a, b) => a.plant_id < b.plant_id ? -1 : 1)  
      });
    } catch (err) {
      console.log(err);
    };
  }
  
  resetPlantState() {
    this.setState({
      ...this.state,
      plant: {
        ...this.state.plant, 
        // reset new plant state object to default values.
        plant_species: '',
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
          unselected_tod: true, 
          morning: false,
          midday: false,
          evening: false
        },
        fertilize_time_of_day: {
          ...this.state.plant.fertilize_time_of_day,
          unselected_tod: true,
          morning: false,
          midday: false,
          evening: false
        },
        mist: false,
        initial_water_date: null,
        next_water_date: null,
        next_fertilize_date: null,
        initial_fertilize_date: null
      },
    });
  }
  // SET PLANT STATE: Updates properties of a new or edited plant in state when the user fills out the new or edited plant form.
  // args: property being updated, updated value.  
  async setScheduleState(scheduleType, dateUnit, value) {
    // if (scheduleType === 'watering_schedule') {
      if (value.includes('set')) {
        this.setState({
          ...this.state,
          plant: {
            ...this.state.plant,
            [scheduleType]: {
              ...this.state.plant[scheduleType],
              unselected_date: true,
              [dateUnit]: 0 
            }
          }
        });
      } else {
        // do a check if time of day has been set, if it hasn't set it to morning automatically when any schedule is set.
        const checkWaterTod = Object.entries(this.state.plant.watering_time_of_day).filter(entry => entry[1])[0][0];
        const checkFertilizeTod =  Object.entries(this.state.plant.fertilize_time_of_day).filter(entry => entry[1])[0][0];
        if (scheduleType.includes('water') && checkWaterTod === 'unselected_tod') {
          await this.setTimeOfDayState('morning', 'watering_time_of_day');
        } else if (scheduleType.includes('fert') && checkFertilizeTod === 'unselected_tod') {
          await this.setTimeOfDayState('morning', 'fertilize_time_of_day');
        } 
        // then proceed with setting the schedule state
        this.setState({
          ...this.state,
          plant: {
            ...this.state.plant,
            [scheduleType]: {
              ...this.state.plant[scheduleType],
              unselected_date: false,
              [dateUnit]: value
            }
          }
        }, () => console.log(this.state.plant.watering_time_of_day));
      }
    // }
    //  else if (scheduleType === 'fertilizer_schedule') {
    //   this.setState({
    //     ...this.state,
    //     plant: {
    //       ...this.state.plant,
    //       [scheduleType]: {
    //         ...this.state.plant[scheduleType],
    //         [dateUnit]: value,
    //       }
    //     }
    //   });
    // };
    return; 
  }

  setTimeOfDayState(chosenValue, stateObjName) {
    const newTimeOfDayState = {
      unselected_tod: false,
      morning: false,
      midday: false,
      evening: false
    };
    const chosenValueObj = {[chosenValue]: true}
    // for (const property in timeOfDayState) {
    //   if (property === chosenValue) Object.assign{{},  ...newTimeOfDayState, property }
    //   // else newTimeOfDayState = timeOfDayState[property]
    // }
    const modifiedState = {...newTimeOfDayState, ...chosenValueObj}
    this.setState({
      ...this.state,
      plant: {
        ...this.state.plant,
        [stateObjName]: modifiedState
      }
    });
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

  // SAVE PLANT: saves a new plant to the db, and in the plants array in state for display. 
  async addPlant(e) {
    e.preventDefault();
    const { 
      name, 
      plant_species,
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      mist,
      watering_time_of_day,
      watering_schedule, 
      initial_water_date,
      fertilize_time_of_day,
      fertilizer_schedule,
      initial_fertilize_date,
    } = this.state.plant;
    // dates
    const next_water_date = await this.createDatesFromSchedule(watering_schedule, 'next_water_date', 'initial_water_date');
    const next_fertilize_date = await(this.createDatesFromSchedule(fertilizer_schedule, 'next_fertilize_date', 'initial_fertilize_date'))

    // add all values from destructured state to request body
    const body = {
      name, 
      plant_species,
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      mist,
      watering_schedule,
      watering_time_of_day,
      initial_water_date,
      next_water_date,
      fertilizer_schedule,
      fertilize_time_of_day,
      initial_fertilize_date,
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
    this.setState({
      ...this.state,
      plant: plant
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
  async savePlantEdits (e) {
    e.preventDefault();
    // destructure state
    const { 
      plant_id,
      plant_species,
      name, 
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      mist,
      watering_time_of_day,
      watering_schedule, 
      fertilize_time_of_day,
      fertilizer_schedule,
    } = this.state.plant;
    // calculate changes to schedule from the initial date the schedule was last set. so if the schedule was set to water every 2 days,
    // and it's changed to three, it should add 3 days from the initial date the schedule was set. 
    const next_water_date = await this.createDatesFromSchedule(watering_schedule, 'next_water_date', 'initial_water_date');
    const next_fertilize_date = await(this.createDatesFromSchedule(fertilizer_schedule, 'next_fertilize_date', 'initial_fertilize_date'))
    // add all values from destructured state to request body
    const body = {
      plant_id,
      plant_species,
      name, 
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      mist,
      watering_schedule,
      watering_time_of_day,
      next_water_date,
      fertilizer_schedule,
      fertilize_time_of_day,
      next_fertilize_date
    };
    try {
      const response = await fetch(`/plants/${plant_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'Application/JSON'
        },
        body: JSON.stringify(body)
      });
      // wait for the database to send back a response before proceeding.
      const dbResponseOk = await response.json();
      const plants = this.state.plants;
      const editedPlant = { plant_id: plant_id, ...this.state.plant };
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
          focusedPlantState={plant}
          genericPlantState={this.state.plant}
          // modal properties
          modalState={this.state.showModal}
          // modal methods
          toggleModal={this.toggleModal}
          // plant methods
          setTextfieldState={this.setTextfieldState}
          setScheduleState={this.setScheduleState}
          setMistState={this.setMistState}
          setTimeOfDayState={this.setTimeOfDayState}
          resetPlantState={this.resetPlantState}
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
            toggleModal={this.toggleModal}
            modalState={this.state.showModal}
            contents='plantform'
            formName='add-plant'
            btnText='Add Plant' 
            submitPlant={this.addPlant}
            setTextfieldState={this.setTextfieldState}
            setScheduleState={this.setScheduleState}
            setTimeOfDayState={this.setTimeOfDayState}
            setMistState={this.setMistState}
            plantState={this.state.plant}
            
          />  
          <div 
            className='plants'>
              {plants}
          </div>
        </div>   
    )
  }
}

export default PlantView;