
import React, { Component } from 'react';
import PlantDetailsModal from './PlantDetailsModal';
import '../../src/styles.css';



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
          <PlantDetailsModal 
            id={this.props.id}
            name={this.props.name}
            plants={this.props.plants}
            plantDetails={this.props.plantInfo}
            editPlantState={this.props.editPlantState}
            saveEditedPlant={this.props.saveEditedPlant}
          />
          <div className="plant-name">{this.props.name}</div>
          
        </div>
      </div>
    )
  }
}

export default Plant;