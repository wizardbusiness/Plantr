import React, {Component} from 'react';
import Plant from './Plant';
import NewPlant from './NewPlant'
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
    this.copyPlantStateForEditing = this.copyPlantStateForEditing.bind(this);
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


  createDatesFromSchedule(scheduleObj, typeOfScheduledDate, typeOfInitialDate, caredForPlant=false) {
    // if the schedule hasn't been set, don't create any dates.
    if (Object.values(scheduleObj).every(value => !value)) return null;
    const wateringTime = scheduleObj === this.state.plant.watering_schedule ? this.state.plant.watering_time_of_day : this.state.plant.fertilize_time_of_day;
    const scheduledTime = Object.entries(wateringTime).filter(entry => entry[1])[0][0];
    // schedule interval in days
    let intervalInDays = 0;
    // iterate through schedule dropDown
    for (const interval in scheduleObj) {
      // convert all values to days and add to intervalInDays
        if (interval === 'days') intervalInDays += 1 * scheduleObj[interval];
        if (interval === 'weeks') intervalInDays += 7 * scheduleObj[interval]; 
      };

    // set a new initial date if one hasn't been set, or the plant has been cared for. Otherwise, keep the old initial date.
    const initialDate = !this.state.plant[typeOfInitialDate] || caredForPlant ? new Date() : this.state.plant[typeOfInitialDate];
    // clone the initial date as the basis for the schedule
    const scheduledDate = new Date(initialDate.valueOf());
    // get the scheduled time in hours from midnight of the current day.
    const timeOfDay = scheduledTime === 'morning' ? 6 : scheduledTime === 'midday' ? 12 : 18;
    // mutate scheduledDate
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
        [typeOfInitialDate]: initialDate
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
          morning: false,
          midday: false,
          evening: false
        },
        fertilize_time_of_day: {
          ...this.state.plant.fertilize_time_of_day,
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
    // selects morning automatically for time of day if user hasn't selected a time of day
    const setTodToMorning = () => {
      let timeOfDayState;
      if (scheduleType === 'watering_schedule') {
        timeOfDayState = this.state.plant.watering_time_of_day;
        if (timeOfDayState.unselected_tod) this.setTimeOfDayState('morning', 'watering_time_of_day')
      } else if (scheduleType === 'fertilizer_schedule') {
        timeOfDayState = this.state.plant.fertilize_time_of_day;
        if (timeOfDayState.unselected_tod) this.setTimeOfDayState('morning', 'fertilize_time_of_day')
      }
      return;
    };
    // unset time of day state if the rest of the schedule is unset.
    const unsetTod = () => {
      if (scheduleType === 'watering_schedule') this.setTimeOfDayState('unselected_tod', 'watering_time_of_day')
      else if (scheduleType === 'fertilizer_schedule') this.setTimeOfDayState('unselected_tod', 'fertilize_time_of_day')
      return;
    }

    const schedule = this.state.plant[scheduleType];
    this.setState((prevState) => { 
      return {
        ...prevState,
        plant: {
          ...prevState.plant,
          [scheduleType]: {
            ...schedule, 
            [dateUnit]: value.includes('set') ? 0 : value
          }
        }
      }
      }, () => {
        // check if schedule has been set
        const scheduleIsSet = Object.values(this.state.plant[scheduleType]).some(value => value);
        // if set automatically set time of day to morning if it hasn't been manually set. 
        if (scheduleIsSet) {
          setTodToMorning();
        // if the schedule is unset, unset time of day too.
        } else if (!scheduleIsSet) {
          unsetTod();
        };
      });
      return;
  }

  setTimeOfDayState(chosenValue, timeOfDayType) {
    // if the user selects only the time of day, but no date unit is selected, it will stay unselected in state
    const plant = this.state.plant;
    const schedule = timeOfDayType === 'watering_time_of_day' ? plant.watering_schedule : plant.fertilizer_schedule;
    const scheduleHasBeenSet = Object.values(schedule).some(value => value);
    if (!scheduleHasBeenSet) {
      this.setState({
        ...this.state,
        plant: {
          ...this.state.plant,
          [timeOfDayType]: {
            unselected_tod: true,
            morning: false,
            midday: false,
            evening: false
          }
        }
      }, () => console.log(schedule))
      return;
    } else if (scheduleHasBeenSet) {
      // if schedule has been set, a time of day must be selected.
      if (chosenValue === 'unselected_tod') return;
      const newTimeOfDayState = {
        unselected_tod: false,
        morning: false,
        midday: false,
        evening: false
      };
      // merge the chosen value into the new time of day state.
      const modifiedState = {...newTimeOfDayState, [chosenValue]: true}
      this.setState({
        ...this.state,
        plant: {
          ...this.state.plant,
          [timeOfDayType]: modifiedState
        }
      });
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

  // SAVE PLANT: saves a new plant to the db, and in the plants array in state for display. 
  async addPlant() {
    const { 
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

    const next_water_date = await this.createDatesFromSchedule(watering_schedule, 'next_water_date', 'initial_water_date');
    const next_fertilize_date = await(this.createDatesFromSchedule(fertilizer_schedule, 'next_fertilize_date', 'initial_fertilize_date'))
    // need to grab these after they've been calculated by createDatesFromSchedule
    const { initial_water_date, initial_fertilize_date }  = this.state.plant;

    // add all values from destructured state to request body
    const body = {
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

  // EDIT PLANT (Frontend state): edits the stateful properties of the plant being edited in the isolated copyPlantStateForEditing state object.
  copyPlantStateForEditing(plant) {
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
  async savePlantEdits () {
    console.log(this.state.plant)
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
    console.log(plant_id)
    // calculate changes to schedule from the initial date the schedule was last set. so if the schedule was set to water every 2 days,
    // and it's changed to three, it should add 3 days from the initial date the schedule was set. 
    const next_water_date = await this.createDatesFromSchedule(watering_schedule, 'next_water_date', 'initial_water_date');
    const next_fertilize_date = await(this.createDatesFromSchedule(fertilizer_schedule, 'next_fertilize_date', 'initial_fertilize_date'))
    const {initial_water_date, initial_fertilize_date} = this.state.plant;
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
      initial_water_date,
      fertilizer_schedule,
      fertilize_time_of_day,
      next_fertilize_date,
      initial_fertilize_date
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
        ...this.state,
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
          focusedPlantState={plant}
          genericPlantState={this.state.plant}
          // modal properties
          modalState={this.state.showModal}
          // plant methods
          setTextfieldState={this.setTextfieldState}
          setScheduleState={this.setScheduleState}
          setMistState={this.setMistState}
          setTimeOfDayState={this.setTimeOfDayState}
          resetPlantState={this.resetPlantState}
          copyPlantStateForEditing={this.copyPlantStateForEditing}
          submitPlant={this.savePlantEdits}
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
          <div className='plants'>
            <NewPlant id="new-plant"
              resetPlantState={this.resetPlantState}
              submitPlant={this.addPlant}
              setTextfieldState={this.setTextfieldState}
              setScheduleState={this.setScheduleState}
              setTimeOfDayState={this.setTimeOfDayState}
              setMistState={this.setMistState}
              plantState={this.state.plant}
            />
            {plants}
          </div>
        </div>   
    )
  }
}

export default PlantView;