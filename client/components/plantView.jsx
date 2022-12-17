import React, {Component} from 'react';
import Plant from './plant';
import NewPlantModal from './NewPlantModal';

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
        waterDate: '',
        fertilizeDate: ''
      },
    }

    this.getPlants = this.getPlants.bind(this);
    this.viewSavedPlants = this.viewSavedPlants.bind(this);
    this.setPlantState = this.setPlantState.bind(this);
    this.savePlant = this.savePlant.bind(this);
    this.editPlant = this.editPlant.bind(this);
    this.clonePlant = this.clonePlant.bind(this);
    this.savePlantEdits = this.savePlantEdits.bind(this);
    this.deletePlant = this.deletePlant.bind(this);
    
  }
  // unimplemented: 
  // convert current date to a water at date by adding the schedule values in state to current date.
    // then round to 7 am, 12pm or 6pm depending on the tod chosen.  
  // check the current date against the water and fertilize dates
  // if they are the same, change color of plant.
  // water button feature
  // after clicking 'water' button, update the water and fertilize at dates in the the database according to the original time.  
  
  componentDidMount() {
    this.getPlants();
  };

  componentDidUPdate() {
    console.log('plantview just updated')
  }

  // GET PLANTS: retrieves all plants in the db. 
  async getPlants() {
    try {
      const response = await fetch('/plants')
      
      const plants = await response.json();
      console.log(plants)
      // convert plant state in db back to state structure in react state. 
      const plantsProcessedForFrontendState = plants.map(plant => {
        const processedPlantObj = {tod: {}, date: {}};
        // even though the for loop is nested, there is a fixed number of props, so it is basically constant insertion. 
        for (const prop in plant) {
          
          if (prop in this.state.newPlant) processedPlantObj[prop] = plant[prop];
          else if (prop === 'plant_id') processedPlantObj[prop] = plant[prop];
          else if (prop ===  'mid' || prop === 'evening' || prop === 'morning') processedPlantObj['tod'][prop] = plant[prop];
          else if (prop === 'days' || prop === 'weeks' || prop === 'months') processedPlantObj['date'][prop] = plant[prop]
        }
        return processedPlantObj;
      });

      console.log(plantsProcessedForFrontendState)


     this.setState({
        ...this.state.plants,
        // update the entire plants array from the db. 
        plants: plantsProcessedForFrontendState
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
          editPlant={this.editPlant}
          clonePlant={this.clonePlant}
          savePlantEdits={this.savePlantEdits}
          deletePlant={this.deletePlant}
          // state for editing plant.
          editedPlant={this.state.editedPlant}
        /> 
     )
    });
  }

  // SET PLANT STATE: Updates properties of a new or edited plant in state when the user fills out the new or edited plant form.
  // args: property being updated, updated value.  
  
  // input: dropdown, property being changed, value, property names in object
  setPlantState(dropdown, pickedOpt, value=0, keys=[]) {
    // set time
    const setTime = (dropdown, pickedTime=pickedOpt, keys) => {
      const notPickedOpts = keys.filter(key => key !== pickedOpt);
      this.setState({
        ...this.state,
        newPlant:{
          ...this.state.newPlant,
          [dropdown]: {
            ...this.state.newPlant[dropdown],
            // set not picked times to false. 
            [notPickedOpts[0]]: false,
            [notPickedOpts[1]]: false,
            // set picked time to true
            [pickedOpt]: true,
          }
        }
      });
    }
    // set date
    const setDate = (dropdown, pickedDate=pickedOpt, value) => {
      this.setState({
        ...this.state,
        newPlant: {
          ...this.state.newPlant,
          [dropdown]: {
            ...this.state.newPlant[dropdown],
            [pickedDate]: value
          }
        }
      })
    }

    // toggle mist
    const toggleMist = () => {
      console.log(pickedOpt)
      this.setState({
        ...this.state,
        newPlant: {
          ...this.state.newPlant,
          mist: this.state.newPlant.mist === false ? this.state.newPlant.mist = true : false
        }
      })
    }

    // set other value
    const setOther = (pickedOpt, value) => {
      this.setState({
        newPlant: {
          ...this.state.newPlant,
          [pickedOpt]: value,
        }
      });
    }

    
    
    if (dropdown === 'tod') {
      setTime(dropdown, pickedOpt, keys)
    } else if (dropdown === 'date') {
      setDate(dropdown, pickedOpt, value);
    } else if (pickedOpt === 'mist') {
      toggleMist();
    } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
      setOther(pickedOpt, value);
    }
    
  };

  // SAVE PLANT: saves a new plant to the db, and in the plants array in state for display. 
  async savePlant() {

    // table columns: plant_id, name, img, light, soil, fertilizer, notes, day, week, month, morning, evening, mid, mist, waterDate, fertilizeDate

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
      // waterDate, 
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
      mist
      // waterDate, 
      // fertilizeDate
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
      const addedPlant = await plantTableResponse.json();
      
      // after okay from database, use local state to add plant to plants. It's faster than sending the response body
      console.log('added plant okay');
      this.setState({
        plants: [...this.state.plants, this.state.newPlant],
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
            ...this.state.schedule,
            days: 0,
            weeks: 0, 
            months: 0
          },
          tod: {
            morning: false,
            mid: false,
            evening: false
          },
          mist: false,
          waterDate: '',
          fertilizeDate: ''
        },
      });

      return addedPlant;
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

    // table columns: plant_id, name, img, light, soil, fertilizer, notes, day, week, month, morning, evening, mid, mist, waterDate, fertilizeDate

    // destructure state
    const { 
      // plantId, 
      name, 
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      schedule: { day, week, month }, 
      tod: { morning, evening, mid }, 
      mist, 
      waterDate, 
      fertilizeDate
    } = this.state.editedPlant;

    const body = {
      name, 
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      day, 
      week, 
      month, 
      morning, 
      evening, 
      mid, 
      mist, 
      waterDate, 
      fertilizeDate
    };

    try {
      const response = await fetch(`/plants/${plantId}`, {
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
        plants: plants.map((plant, index) => plant.plantId === plantId ? plants[index] = editedPlant : plant)
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

  render() {
    const plants = this.viewSavedPlants(this.state.plants)
    return (
        <div className="planter-box">
          <NewPlantModal
            plantState={this.state.newPlant}
            setPlantState={this.setPlantState}
            getPlants={this.getPlants} 
            savePlant={this.savePlant}
          /> 
          <div className="plants">{plants}</div>
        </div>   
    )
  }
}

export default PlantView;