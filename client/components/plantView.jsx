import React, {Component} from 'react';
import Plant from './plant.jsx'

class PlantView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newPlant: '+',
      plants: [],
      plantForm: {
        name: '',
        waterFreq: '',
        fertilizeFreq: '',
        lightPref: '',
        soilPref: '',
        fertilizerPref: '',
        notes: '',
      }
    }
    this.showPlants = this.showPlants.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch('/plants')
      const json = response.json();
      console.log(json)
      
    } catch (err) {
      console.log(err);
    }
  }

  showPlants(plants) {
    plants.map(plant => <Plant 
      name={this.state.name}
      waterDate={this.state.waterDate}
      fertilizeDate={this.state.fertilizeDate}
      lightPref={this.state.lightPref}
      fertilizerPref={this.state.fertilizerPref}
      notes={this.state.notes}
      /> )
  }

  render() {
    <div></div>
  }
}

export default PlantView;