import React, {Component} from 'react';
import Plant from './plant';
import NewPlantModal from './NewPlantModal';


class PlantView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currId: 0,
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
    this.deletePlant = this.deletePlant.bind(this);
    this.setNewPlantState = this.setNewPlantState.bind(this);
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
      })
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
    console.log(`name: ${name}`)
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
        // currId: this.state.currId + 1,
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
    }
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
          name={plant.name}
          waterDate={plant.water_at_date}
          fertilizeDate={plant.fertilize_at_date}
          lightPref={plant.light_pref}
          fertilizerPref={plant.fertilizer_pref}
          notes={plant.notes}
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