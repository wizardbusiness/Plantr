import React, { Component } from 'react';
import PlantForm from './PlantForm';

class PlantInfo extends Component {
  constructor(props) {
    super(props); 

    this.state = {
      plantLabelMap: {
        plantSpecies: 'Species ',
        name: 'Name: ',
        img: null,
        light: 'Light: ',
        soil: 'Soil: ',
        fertilizer: 'Fertilizer: ',
        notes: 'Notes: ',
        wateringSched: 'Water every ',
        wateringTime: 'in the ',
        days: ' day(s)',
        weeks: ' week(s)',
        months: ' month(s)',
        fertilizerSched: 'Fertilize Every ',
        fertilizeTime: 'in the ',
        morning: ' morning',
        midday: ' afternoon',
        evening: ' evening'
      },
    }

    this.toggleEditPlant = this.toggleEditPlant.bind(this);
    this.createInfoFields = this.createInfoFields.bind(this);
    this.createSchedule = this.createSchedule.bind(this);
  }

  toggleEditPlant() {
    this.setState({
      editPlant: this.state.editPlant === false ? this.state.editPlant = true : this.state.editPlant = false
    })
  };

  
  createInfoFields() {
    const { thisPlantsInfo } = this.props;
    const labelMap = this.state.plantLabelMap;
    // initial pass: string attributes
    // iterate through plant properties and select all primitive values that need a label.
    const primitivePropsWithLabel = [];
    for (const property in thisPlantsInfo) {
      const value = thisPlantsInfo[property];
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

  createSchedule(water=true, fertilize=false) { 
    const { thisPlantsInfo } = this.props;

    const labelMap = this.state.plantLabelMap; 
    const schedule = water ? thisPlantsInfo.wateringSched: thisPlantsInfo.fertilizeSched;
    const timeOfDay = water ? thisPlantsInfo.wateringTime : thisPlantsInfo.fertilizeTime;
    // check if the schedule is empty
    const scheduleIsSet = Object.values(schedule).some(value => value);
    // if schedule is empty, return the message 'Schedule not Set' to the user.
    if (!scheduleIsSet) return (
      <div>Schedule Not Set</div>
    );
    // if schedule isnt' empty, return an element containing all scheduling info summarized on one line. 
    // get the relevant info for the schedule being displayed to the user. s
    const allScheduleInfo = [...Object.entries(schedule), ...Object.entries(timeOfDay)];
    // iterate through plant properties and filter for the options that the user has selected (eval to true);
    const selectedInfo = allScheduleInfo.filter(entry => entry[1]);
    // map the info to elements
    const scheduleSummaryNode = selectedInfo.map(entry => {
      return (
        <span>
          <output>{entry[1] === true ? ' in the ' : entry[1]}</output>
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
    const infoFieldElements = this.createInfoFields();
    const wateringInfo = this.createSchedule(true, false)
    const fertilizeInfo = this.createSchedule(false, true)
    // if no modal opened (either info modal or edit modal), don't render anything. 
    // if modal is open but plant isn't being edited, return plant info. 
      return (
        <div className="plant-modal">
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
  }
  
};

export default PlantInfo;
