
import React, { Component } from 'react';
import PlantModal from './PlantModal';
import PlantInfo from './PlantInfo';
import '../../src/styles.css';



class Plant extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { plantState } = this.props;
    this.props.checkSchedule(plantState.next_water_date);
  }

  componentWillUnmount() {
    clearInterval(this.props.checkSchedule())
  }

  
  render() {
    const { 
      index,
      plantState,
      editPlant,
      savePlantEdits,
      deletePlant,
      resetPlantState,
      setTextfieldState,
      setScheduleState,
      setMistState,
      genericPlantState,
    } = this.props;
    return (
      <div className="plant"> 
        <div id='modal-header'>
          <PlantModal
            buttonId="plant-info-btn"
            buttonText="Info"
            resetPlantState={resetPlantState}
          >
            <PlantInfo 
              index={index}
              editPlant={editPlant}
              plantState={plantState}
              genericPlantState={genericPlantState}
              savePlantEdits={savePlantEdits}
              setTextfieldState={setTextfieldState}
              setScheduleState={setScheduleState}
              setMistState={setMistState}
            />
          </PlantModal>
          <button onClick={() => deletePlant(plantState.plant_id)}>x</button>
        </div>
        <div id='plant-display-name'>
          {plantState.name}
        </div>
      </div>
    )
  }
}

export default Plant;