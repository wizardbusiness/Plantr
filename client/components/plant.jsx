
import React, { Component } from 'react';
import PlantDetailsModal from './PlantDetailsModal';
import '../../src/styles.css';



class Plant extends Component {
  constructor(props) {
    super(props);

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
    const { 
      index,
      plantInfo,
      editPlant,
      clonePlant,
      savePlantEdits,
      deletePlant,
      editedPlant } = this.props;
    return (
      <div>
        <div className="plant"onClick={() => this.waterPlant()}> 
          <div className="plant-remove">
            <button onClick={() => this.props.deletePlant(this.props.id)}>x</button>
          </div>
          <PlantDetailsModal 
            index={index}
            plantInfo={plantInfo}
            editedPlant={editedPlant}
            clonePlant={clonePlant}
            editPlant={editPlant}
            savePlantEdits={savePlantEdits}
            deletePlant={deletePlant}
          />
          <div className="plant-name">{plantInfo.name}</div>
        </div>
      </div>
    )
  }
}

export default Plant;