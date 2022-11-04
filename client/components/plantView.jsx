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
      editedPlant: {

      },
      newPlant: {
        id: 0,
        name: '',
        water_at_date: null,
        fertilize_at_date: null,
        light_pref: null,
        soil_pref: null,
        fertilizer_pref: null,
        notes: null,
      },
    }

    this.showPlants = this.showPlants.bind(this);
    this.getPlants = this.getPlants.bind(this);
    this.addPlant = this.addPlant.bind(this);
    this.setNewPlantState = this.setNewPlantState.bind(this);
    this.editPlantState = this.editPlantState.bind(this);
    this.backUpPlant = this.backupPlant.bind(this);
    this.saveEditedPlant = this.saveEditedPlant.bind(this);
    this.deletePlant = this.deletePlant.bind(this);
    
  }

  // convert input from water and fertilizer dates to a water at date
  // check the current date against the water and fertilize dates
  // if they are the same, change color of plant.
  // after clicking 'water' button, update the water and fertilize at dates in the the database according to the original time.  
  
  componentDidMount() {
    this.getPlants();
  };


  async getPlants() {
    try {
      const response = await fetch('/plants')
      const plants = await response.json();
      this.setState({
        ...this.state.plants,
        // update plants from the database. 
        plants: plants,
        newPlant: {
          ...this.state.newPlant,
          // update id of newPlant from the last plant in the database. 
          // this ensures that when a new plant is made, it will have a unique id
          // and that plants can be deleted and added without conflicting with each other.   
          // if no plants in database, set the new plants id to 0
          id: plants.length > 0 ? plants[plants.length - 1].id + 1 : 0
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async addPlant() {
    // destructure newPlant from state. 
    const { id, name, water_at_date, fertilize_at_date, light_pref, soil_pref, fertilizer_pref, notes} = this.state.newPlant;
    // console.log(name)
    // send all info from newPlant state on body (see NewPlantForm.jsx)
    const body = {
      id,
      name,
      water_at_date,
      fertilize_at_date,
      light_pref,
      soil_pref,
      fertilizer_pref,
      notes
    }
    try {
      const response = await fetch('/plants', {
        method: 'POST', 
        headers: {
          'Content-Type': 'Application/JSON'
        },
        body: JSON.stringify(body)
      });
      const newPlant = await response.json();
      // console.log(this.state.plants[id].id)
      // add plant to state. 
      this.setState({
        plants: [...this.state.plants, ...newPlant],
        // update newPlant id
        newPlant: {
          ...this.state.newPlant, 
          id: newPlant[newPlant.length - 1].id + 1
        }
      });
      return newPlant;
    } catch (err) {
      console.log(err);
    };
  };

  // input: 
  // property being edited
  // new value
  // plant id
  editPlantState(property, value) {
      // edit the properties of the plant being edited in the isolated editPlant state object
      this.setState({
        editedPlant: {...this.state.editedPlant, [property]: value}
      });
      console.log(this.state.editedPlant)

      // find the plant in state.
      // update the editPlant property from the plant. 
      // save the plant: 
        // replace the plant object at the index with the edit plant object. 
  }

  backupPlant(index) {
    // when edit modal is opened,
    // find the plant being edited in state. 
    // back up that plant edit plant state object. 
    this.setState({
      // set edited plant property in state to plant at current index 
      editedPlant: this.state.plants[index]
    });
  }
  

  async saveEditedPlant (editedPlant, index) {
    const { id, name, water_at_date, fertilize_at_date, light_pref, soil_pref, fertilizer_pref, notes} = editedPlant;
    const body  = {
      id,
      name,
      water_at_date,
      fertilize_at_date,
      light_pref,
      soil_pref,
      fertilizer_pref,
      notes
    };

    try {
      const response = await fetch(`/plants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'Application/JSON'
        },
        body: JSON.stringify(body)
      })

      const plantToBeEdited = await response.json();
      console.log(plantToBeEdited[0])
      const plants = this.state.plants;
      this.setState({
        // index is passed in as argument above ^^
        plants: this.state.plants.map((plant) => plant === plants[index] ? plants[index] = plantToBeEdited[0] : plant)
      })

    } catch (err) {
      console.log(err);
    };
  }

  async deletePlant (id) {
    try {
      const response = await fetch(`/plants/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'Application/JSON'
        },
      });
      
      const plantToDelete = await response.json();
      const plants = this.state.plants;
      // filter out plant to be deleted. 
      const updatedPlants = plants.filter((plant) => {
        // since plant id and index are the same, can return plants where id doesn't match index. 
        return (plant.id !== plantToDelete.id)
      })
      this.setState({
        plants: updatedPlants,
      });
    } catch (err) {
      console.log(err);
    }
  }

  setNewPlantState(property, value) {
    
    this.setState({
      newPlant: {
        ...this.state.newPlant,
        [property]: value,
      }
    });
    console.log(property)
  }

  showPlants(plants) {
    return plants.map((plant, index) => {
      return (
        <Plant 
          key={`plant${index}`}
          index={index}
          deletePlant={this.deletePlant}
          editPlantState={this.editPlantState}
          saveEditedPlant={this.saveEditedPlant}
          backupPlant={this.backUpPlant}
          plants={this.state.plants}
          editedPlant={this.state.editedPlant}
          id={plant.id}
          name={plant.name}
          waterDate={plant.water_at_date}
          fertilizeDate={plant.fertilize_at_date}
          lightPref={plant.light_pref}
          fertilizerPref={plant.fertilizer_pref}
          notes={plant.notes}
          plantInfo={plant}
        /> 
     )
    });
  }

  render() {
    const plants = this.showPlants(this.state.plants)
    return (
        <div className="planter-box">
          <NewPlantModal
            plantState={this.state.newPlant}
            setNewPlantState={this.setNewPlantState}
            getPlants={this.getPlants} 
            addPlant={this.addPlant}
          /> 
          <div className="plants">{plants}</div>
        </div>   
    )
  }
}

export default PlantView;