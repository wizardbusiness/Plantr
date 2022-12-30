
import React, { Component } from 'react';
import PlantDetailsModal from './PlantDetailsModal';
import '../../src/styles.css';



class Plant extends Component {
  constructor(props) {
    super(props);

    this.waterPlant = this.waterPlant.bind(this);
  }

  componentDidMount() {
   this.props.checkSchedule(this.props.plantInfo.water_date);
  }

  componentWillUnmount() {
    clearInterval(this.props.checkSchedule())
  }

  
  render() {
    const { 
      index,
      plantInfo,
      editPlant,
      clonePlant,
      savePlantEdits,
      setPlantState,
      deletePlant,
      editedPlant } = this.props;
    return (
      <div>
        <div className="plant"onClick={() => this.waterPlant()}> 
          <div className="plant-remove">
            <button onClick={() => deletePlant(plantInfo.plant_id)}>x</button>
          </div>
          <PlantDetailsModal 
            index={index}
            plantInfo={plantInfo}
            editedPlant={editedPlant}
            clonePlant={clonePlant}
            editPlant={editPlant}
            savePlantEdits={savePlantEdits}
            setPlantState={setPlantState}
            deletePlant={deletePlant}
          />
          <div className="plant-name">{plantInfo.name}</div>
        </div>
      </div>
    )
  }
}

export default Plant;