
import React, { Component } from 'react';
import PlantDetailsModal from './PlantDetailsModal';
import '../../src/styles.css';
import NewPlantModal from './NewPlantModal';



class Plant extends Component {
  constructor(props) {
    super(props)

    this.waterPlant = this.waterPlant.bind(this);
  }

  componentDidMount() {
    
    // setTimeout(() => {
    //   console.log(`${this.props.name} needs watering`)
    // }, 3000)
  }

  waterPlant() {
    console.log(`${this.props.name} watered!`)
  }

  
  render() {
    return (
      <div>
        <div className="plant"onClick={() => this.waterPlant()}> 
          <div className="plant-remove">
            <button onClick={() => this.props.deletePlant(this.props.id)}>x</button>
          </div>
          <PlantDetailsModal id={this.props.id} ></PlantDetailsModal>
          <div className="plant-name">{this.props.name}</div>
          
        </div>
      </div>
    )
  }
}

export default Plant;