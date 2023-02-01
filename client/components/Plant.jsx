
import React, { Component } from 'react';
import PlantModal from './PlantModal';
import '../../src/styles.css';



class Plant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      waterMeter: 0,
      waterPlantIndicator: false,
      fertilizerMeter: null,
      fertilizePlantIndicator: false
    };

    this.careForPlant = this.careForPlant.bind(this);
    this.checkSchedule = this.checkSchedule.bind(this);
  }

  componentDidMount() {
    const { focusedPlantState } = this.props;
    this.checkSchedule(focusedPlantState.next_water_date, focusedPlantState.initial_water_date);
    console.log(focusedPlantState)
  }

  componentWillUnmount() {
    const { focusedPlantState } = this.props;
    // clearInterval(this.checkSchedule(focusedPlantState.next_water_date))
  }

  checkSchedule(scheduledDate, initialDate) { 
    const {focusedPlantState} = this.props;
    // create new current watering_schedule. 
    // convert both dates to milliseconds
    const checkingLogic = () => {
      const initialDateMs = new Date(initialDate).getTime();
      const currentDateMs = new Date().getTime();
      const scheduledDateMs = new Date(scheduledDate).getTime();
      // if scheduled watering_schedule is less than current watering_schedule, {css logic} (for now just console log that plant needs watering or fertilizing)
      // display the fraction of the time that has elapsed between the initial date and the scheduled date as a percentage between 0 and 100 percent. 
      const percentage = Math.round((1 / ((scheduledDateMs - initialDateMs) / (currentDateMs - initialDateMs))) * 100)
      console.log(percentage)
      const result = initialDateMs <= scheduledDateMs && scheduledDate ? percentage : console.log('plant needs watering!');
      this.setState({
        ...this.state,
        waterMeter: result,
        waterPlantIndicator: percentage < 100 || !scheduledDate? this.state.waterPlantIndicator = false : true
      });
      return;
    };
    checkingLogic();
    setInterval(() => {
      checkingLogic();
    }, 3000)
    return;
  }

  careForPlant() {
    // will be called when plant is watered or fertilized, and will reset the initial date that will be called when that happens.
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
      setTimeOfDayState,
      setMistState,
      genericPlantState,
    } = this.props;
    return (
      <div className="plant" style={{"--water-plant" : this.state.waterPlantIndicator === true ? "#fa5c1e" : "#42d642"}}>
          <button id='delete-plant-btn' onClick={() => deletePlant(focusedPlantState.plant_id)}>x</button>
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
              setTimeOfDayState={setTimeOfDayState}
              contents='plantinfo'
            />
            <div id='plant-species-name'>{focusedPlantState.plant_species}</div>
            <div className = "water-meter" style={{"--water-meter-height" : `${this.state.waterMeter}%`}}/>
      </div>
    )
  }
}

export default Plant;