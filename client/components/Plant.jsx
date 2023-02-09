
import React, { Component } from 'react';
import PlantModal from './PlantModal';
import PlantForm from './PlantForm';
import PlantInfo from './PlantInfo';
import '../../src/styles.css';

class Plant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      editPlant: false,
      showInfo: true,
      waterMeter: 0,
      waterPlantIndicator: false,
      fertilizerMeter: null,
      fertilizePlantIndicator: false
    };

    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleShowInfo = this.handleShowInfo.bind(this);
    this.handleShowInputForm = this.handleShowInputForm.bind(this);
    this.careForPlant = this.careForPlant.bind(this);
    this.checkSchedule = this.checkSchedule.bind(this);
  }

  handleShowModal() {
    this.setState({
      showModal: this.state.showModal === false ? true : false
    });
  }

  handleShowInputForm() {
    this.setState({
      editPlant: this.state.editPlant === false ? true : false
    }, () => console.log(this.state.editPlant));
  }

  handleShowInfo() {
    this.setState({
      showInfo: this.state.showInfo === false ? true : false
    });
  }

  componentDidMount() {
    const { focusedPlantState } = this.props;
    this.checkSchedule(focusedPlantState.next_water_date, focusedPlantState.initial_water_date);
  }

  componentWillUnmount() {
    const { focusedPlantState } = this.props;
    clearInterval(this.checkSchedule(focusedPlantState.next_water_date))
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
      const result = initialDateMs <= scheduledDateMs && scheduledDate ? percentage : console.log('plant needs watering!');
      this.setState({
        ...this.state,
        waterMeter: result,
        waterPlantIndicator: percentage < 100 || !scheduledDate? this.state.waterPlantIndicator = false : true
      });
      return;
    };
    checkingLogic();
    return setInterval(() => {
      checkingLogic();
    }, 3000)
  }

  careForPlant() {
    // will be called when plant is watered or fertilized, and will reset the initial date that will be called when that happens.
  }

  render() {
    const { 
      submitPlant,
      focusedPlantState,
      copyPlantStateForEditing,
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
      <div>
          <div className="plant" style={
            {"--bg-color" : this.state.waterPlantIndicator === true ? "#fa5c1e" : "#42d642"}}>
            <button 
            id='delete-plant-btn' 
            className='plant-btns'
            style={{"--button-color": this.state.waterPlantIndicator === true ? "#61464d" : "#c1c1c1"}} 
            onClick={() => deletePlant(focusedPlantState.plant_id)}>x</button>
            <button 
              id="plant-info-btn" 
              className="plant-btns" 
              onClick={() => {
                this.handleShowModal();
                copyPlantStateForEditing(focusedPlantState);
              }}
              >Info</button>
            <div id="plant-species-name">{focusedPlantState.plant_species}</div>
            <div className = "water-meter" style={{"--water-meter-height" : `${this.state.waterMeter}%`}}/>
          </div>
          {/* show the modal */}
          {this.state.showModal && <PlantModal
            handleShowModal={this.handleShowModal}
            showInfo={this.state.showInfo}
            handleShowInfo={this.handleShowInfo}
            handleShowInputForm={this.handleShowInputForm}
            showInputForm={this.state.editPlant}
            resetPlantState={resetPlantState}
            >
              {/* modal contents */}
              {/* edit plant */}
              {this.state.editPlant && <PlantForm 
                setTextfieldState={setTextfieldState}
                setScheduleState={setScheduleState}
                setTimeOfDayState={setTimeOfDayState}
                setMistState={setMistState}
                submitPlant={submitPlant}
                handleShowModal={this.handleShowModal}
                plantState={genericPlantState}
              /> || 
              // show plant info
              this.state.showInfo && <PlantInfo 
                  focusedPlantState={focusedPlantState}
                  genericPlantState={genericPlantState}
                  savePlantEdits={savePlantEdits}
                  setTextfieldState={setTextfieldState}
                  setScheduleState={setScheduleState}
                  setTimeOfDayState={setTimeOfDayState}
                  setMistState={setMistState}
                />
              }  
            </PlantModal>
          }
      </div>
    )
  }
}

export default Plant;