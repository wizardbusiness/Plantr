import React, {Component} from 'react';
import Plant from './plant';
import NewPlantModal from './NewPlantModal';

class PlantView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editPlant: {
        editIndx: null,
        saveEdit: true,
      },
      plants: [],
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
    this.cancelEdit = this.cancelEdit.bind(this);
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

  editPlantState (property, value, plantName, plants) {
    // need to edit plant first, so that body of request contains updated state. 
    // to avoid additional iteration every time a field in plantInfo is being edited, 
    let editIndex = this.state.editPlant.editIndx;
    
    // create clone of object (plant) at edit to restore from if edit is canceled. 
    const backup = {...this.state.plants[editIndex]} || null;
    console.log('property to edit: ' + property)
    console.log('value: ' + value)
    if (editIndex) {     
      this.setState({
        plants: this.state.plants.map(plant => plant.name === plantName ? {...plant, [property]: value} : plant)
      });
      
      // if no edit index cached in state, find the location of the plant being edited and cache it. 
      // runs when edit modal is opened.
    } else if (!editIndex) {
      console.log('no edit index')
      plants.forEach((plant, index) => {
        if (plant.name === plantName) {
          console.log(plantName)
          console.log(index)
          console.log('indexbefore: ' + editIndex)
          this.setState({
            editPlant: {
              ...this.state.editPlant,
              editIndx: index
            }
          });
          console.log('indexafter:' + editIndex)
        }
      })
      
    };
    const saveEdit = this.state.editPlant.saveEdit;
    // if edit is canceled (saveEdit in state is set to false), reset state from backup object. 
    if (!saveEdit) {
      const edit = this.state.editPlant;
      this.setState({
      // using map to look for edit index again, then replacing the edited object with the backup. 
      ...edit, 
      // change savePlant back to true for next edit. 
      savePlant: true,
      plants: this.state.plants.map((plant, index) => index === editIndex ? backup : plant)
      });
    };
  }

  cancelEdit() {
    const edit = this.state.editPlant;
    this.setState({
      ...edit,
      saveEdit: false
    });
  }

  async saveEditedPlant (plantId, editedPlant) {
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
      const plant = fetch(`/plants/${plantId}`, {
        method: 'UPDATE',
        headers: {
          'Content-Type': 'Application/JSON'
        },
        body: JSON.stringify(body)
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
          id={plant.id}
          deletePlant={this.deletePlant}
          editPlantState={this.editPlantState}
          saveEditedPlant={this.saveEditedPlant}
          cancelEdit={this.cancelEdit}
          plants={this.state.plants}
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