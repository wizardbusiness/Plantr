import React, { Component } from 'react';
import PlantForm from './PlantForm';

class PlantInfo extends Component {
  constructor(props) {
    super(props); 

    this.state = {
      editPlant: false,
      plantLabelMap: {
        name: 'Name: ',
        img: null,
        light: 'Light: ',
        soil: 'Soil: ',
        fertilizer: 'Fertilizer: ',
        notes: 'Notes: ',
        watering_schedule: 'Water every ',
        watering_time_of_day: 'in the ',
        days: ' days',
        weeks: ' weeks',
        months: ' months',
        fertilizer_schedule: 'Fertilize Every ',
        fertilize_time_of_day: 'in the ',
        morning: ' morning',
        midday: ' afternoon',
        evening: ' evening'
      },
    }

    this.toggleEditPlant = this.toggleEditPlant.bind(this);
    this.createInfoFieldNodes = this.createInfoFieldNodes.bind(this);
    this.createScheduleNodes = this.createScheduleNodes.bind(this);
  }

  toggleEditPlant() {
    this.setState({
      editPlant: this.state.editPlant === false ? this.state.editPlant = true : this.state.editPlant = false
    })
  };

  
  createInfoFieldNodes() {
    const { focusedPlantState } = this.props;
    const labelMap = this.state.plantLabelMap;
    // initial pass: string attributes
    // iterate through plant properties and select all primitive values that need a label.
    const primitivePropsWithLabel = [];
    for (const property in focusedPlantState) {
      const value = focusedPlantState[property];
      if (property in labelMap && typeof value === 'string') primitivePropsWithLabel.push([property, value])
    }
    // map info and info labels to elements
    const infoFieldElements = primitivePropsWithLabel.map((entry, index) => {
      const key = `att${index}`
      const [ property, value ] = entry;
      const label = labelMap[property];
      return(
        <label key={key}>
          {label}
          <span>
            {value}
          </span>
        </label>
      );
    });
    // return labeled string attributes and labeled schedules
    return infoFieldElements
  };



  createScheduleNodes(scheduleType) { 
    const { focusedPlantState } = this.props;
    const labelMap = this.state.plantLabelMap; 
    const schedule = scheduleType === 'watering_schedule' ? focusedPlantState.watering_schedule: focusedPlantState.fertilizer_schedule;
    // check if the schedule is empty
    let emptySchedule = true;
    for (const property in schedule) {
      if (schedule[property] !== 0) emptySchedule =  false;
    }
    // if schedule is empty, return the message 'Schedule not Set' to the user.
    if (emptySchedule === true) return (
      <div>Schedule Not Set</div>
    ) 
    // if schedule isnt' empty, return an element containing all scheduling info summarized on one line. 
    // get the relevant info for the schedule being displayed to the user. s
    const timeOfDay = scheduleType === 'watering_schedule' ? focusedPlantState.watering_time_of_day : focusedPlantState.fertilize_time_of_day;
    const allScheduleInfo = [...Object.entries(schedule), ...Object.entries(timeOfDay)];
    // iterate through plant properties and filter for the options that the user has selected (eval to true);
    const selectedInfo = allScheduleInfo.filter(entry => entry[1]);
    // map the info to elements
    const scheduleSummaryNode = selectedInfo.map(entry => {
      return (
        <span>
          <output>{entry[1] === true ? ' in the ' + labelMap[entry[0]] : entry[1]}</output>
          <label>{labelMap[entry[0]]}&nbsp;</label>
        </span>
      )
    })
    return (
      <span>
        <label>{labelMap[scheduleType]}</label>
        <output>{scheduleSummaryNode}</output>
      </span>
    );
  }

  render() {
    const infoFieldElements = this.createInfoFieldNodes();
    const wateringInfo = this.createScheduleNodes('watering_schedule')
    const fertilizeInfo = this.createScheduleNodes('fertilize_schedule')
    const {
      toggleModal,
      editPlant,
      genericPlantState,
      focusedPlantState,
      savePlantEdits,
      resetPlantState,
      setTextfieldState,
      setScheduleState,
      setTimeOfDayState,
      setMistState,
    } = this.props;
    // if no modal opened (either info modal or edit modal), don't render anything. 
    // if modal is open but plant isn't being edited, return plant info. 
    if (!this.state.editPlant) {
      return (
        <div className="plant-modal">
          <div className="info-modal-buttons">
            <button 
              onClick={() => {
                this.toggleEditPlant();
                editPlant(focusedPlantState);
              }
            }>Edit</button>
          </div>
          <fieldset className="plant-info">
            {infoFieldElements}
            <label>Watering Schedule: </label>
            {wateringInfo}
            <label>Fertilize Schedule: </label>
            {fertilizeInfo}
          </fieldset>
        </div>
      )
    // else if plant is being edited, render edit plant modal. 
    } else { 
      return (
        <PlantForm
              formName='edit-plant'
              btnText='Save Plant'
              toggleModal={toggleModal}
              submitPlant={savePlantEdits}
              resetPlantState={resetPlantState}
              setTextfieldState={setTextfieldState}
              setScheduleState={setScheduleState}
              setTimeOfDayState={setTimeOfDayState}
              setMistState={setMistState}
              plantState={genericPlantState}
            >
          </PlantForm>
      );
    }
  }
  
};

export default PlantInfo;
