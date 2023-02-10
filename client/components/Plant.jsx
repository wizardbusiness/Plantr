
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
      waterMeter: 100,
      waterPlantIndicator: false,
      fertilizerMeter: null,
      fertilizePlantIndicator: false,
      intervalId: null
    };
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleShowInfo = this.handleShowInfo.bind(this);
    this.handleShowInputForm = this.handleShowInputForm.bind(this);
    this.careForPlant = this.careForPlant.bind(this);
    this.checkSchedule = this.checkSchedule.bind(this);
    this.makeMeter = this.makeMeter.bind(this);
  }

  handleShowModal() {
    this.setState({
      showModal: this.state.showModal === false ? true : false
    });
  }

  handleShowInputForm() {
    this.setState({
      editPlant: this.state.editPlant === false ? true : false
    });
  }

  handleShowInfo() {
    this.setState({
      showInfo: this.state.showInfo === false ? true : false
    });
  }

  componentDidMount() {
    // this.checkSchedule();
    this.makeMeter();
  }

  componentDidUpdate() {
    // this.makeMeter();
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  makeMeter() {
    const {focusedPlantState} = this.props;
    const initialDateMs = new Date(focusedPlantState.initial_water_date).getTime();
    const currentDateMs = new Date().getTime();
    const scheduledDateMs = new Date(focusedPlantState.next_water_date).getTime();
    // Thu Feb 09 2023 17:03:32 GMT-0800 (Pacific Standard Time) 
    //  Wed Dec 31 1969 16:00:00 GMT-0800 (Pacific Standard Time)
    // if scheduled watering_schedule is less than current watering_schedule, {css logic} (for now just console log that plant needs watering or fertilizing)
    // display the fraction of the time that has elapsed between the initial date and the scheduled date as a percentage between 0 and 100 percent. 
    const percentage = Math.round((1 / ((scheduledDateMs - initialDateMs) / (currentDateMs - initialDateMs))) * 100)
    const result = initialDateMs <= scheduledDateMs && focusedPlantState.next_water_date ? percentage : console.log('plant needs watering!');
    this.setState({
      ...this.state,
      waterMeter: percentage,
      waterPlantIndicator: percentage < 100 || !focusedPlantState.next_water_date ? this.state.waterPlantIndicator = false : true
    }, () => {if (this.props.focusedPlantState.plant_species === 'Hoopy') console.log(this.state.waterMeter)});
    return;
  };

  checkSchedule() {
    this.makeMeter(); 
    const intervalId = setInterval(() => { 
      this.makeMeter();
    }, 3000)
    this.setState({
      intervalId: intervalId
    })
    return;
  }
  // scheduleObj, typeOfScheduledDate, typeOfInitialDate, caredForPlant=false
  async careForPlant() {
    const { waterPlant, genericPlantState, focusedPlantState, copyPlantStateForEditing, createDatesFromSchedule, submitPlant} = this.props;
    if (waterPlant) {
      await copyPlantStateForEditing(focusedPlantState);
      await createDatesFromSchedule(genericPlantState.watering_schedule, 'next_water_date', 'initial_water_date', true)
      await submitPlant();
      this.makeMeter(); // not working yet
    };
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
          <div className="plant" 
            style={
            {"--bg-color" : this.state.waterPlantIndicator === true ? "#fa5c1e" : "#42d642"}}
            onClick={() => this.careForPlant()}
          >
            
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