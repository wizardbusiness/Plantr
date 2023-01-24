
import React, { Component } from 'react';
import PlantModal from './PlantModal';
import PlantInfo from './PlantInfo';
import '../../src/styles.css';



class Plant extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { focusedPlantState } = this.props;
    this.props.checkSchedule(focusedPlantState.next_water_date);
  }

  componentWillUnmount() {
    clearInterval(this.props.checkSchedule())
  }

  render() {
    const { 
      toggleModal,
      modalState,
      focusedPlantState,
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
            toggleModal={toggleModal}
            modalState={modalState}
            editPlant={editPlant}
            focusedPlantState={focusedPlantState}
            genericPlantState={genericPlantState}
            savePlantEdits={savePlantEdits}
            setTextfieldState={setTextfieldState}
            setScheduleState={setScheduleState}
            setMistState={setMistState}
            contents='plantinfo'
          />
          <button onClick={() => deletePlant(focusedPlantState.plant_id)}>x</button>
        </div>
        <div id='plant-display-name'>
          {focusedPlantState.name}
        </div>
      </div>
    )
  }
}

export default Plant;