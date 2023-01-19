import React, { Component } from 'react';
import PlantForm from './PlantForm';

class PlantInfo extends Component {
  constructor(props) {
    super(props); 

    this.state = {
      editPlant: false,
      plantLabelMap: {
        name: 'Name ',
        img: null,
        light: 'Light: ',
        soil: 'Soil: ',
        fertilizer: 'Fertilizer: ',
        notes: 'Notes: ',
        watering_schedule: 'Water Every: ',
        fertilizing_schedule: 'Fertilize Every: ',
        days: ' Days',
        weeks: ' Weeks',
        months: ' Months',
        watering_time_of_day: 'Water in the: ',
        fertilizing_time_of_day: 'Fertilize in the: ',
        morning: ' Morning',
        midday: ' Afternoon',
        evening: ' Evening'
      },
    }

    this.mapLabelsToProperties = this.mapLabelsToProperties.bind(this);
    this.toggleEditPlant = this.toggleEditPlant.bind(this);
  }

  toggleEditPlant() {
    this.setState({
      editPlant: this.state.editPlant === false ? this.state.editPlant = true : this.state.editPlant = false
    })
  };

  
  mapLabelsToProperties () {
    const { plantState } = this.props;
    const labelMap = this.state.plantLabelMap;
    // initial pass: string attributes
    // iterate through plant properties and filter for string values.
    const stringValues = Object.entries(plantState).filter(entry => typeof entry[1] === 'string');
    const labeledStringAttributes = stringValues.map((entry, index) => {
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
    // second pass: schedule objects
    // iterate through plant properties and filter for object values.
    const scheduleObjValues = Object.entries(plantState).filter((entry) => typeof entry[1] === 'object' && entry[0] !== 'img');
    const labeledSchedules = scheduleObjValues.map((entry, index) => {
      const key =`schedule${index}`;
      const [ property, scheduleObj] = entry;
      const label = labelMap[property];
      // label the schedule values
      const labeledScheduleValues = Object.entries(scheduleObj).map((entry, index) => {
        const [ property, value ] = entry;
        const key= `scheduleVal${index}`;
        return (
          <span key={key}>
            {value}
            <label >
              {labelMap[property]}&nbsp;
            </label>
          </span>
          
        );
      }); 
      // label the schedule
      return(
        <label key={key}>
          {label}
          <span>
            {labeledScheduleValues}
          </span>
        </label>
      )
    });

    // return labeled string attributes and labeled schedules
    return [labeledStringAttributes, labeledSchedules];
  };

  render() {
    const labeledAttributes = this.mapLabelsToProperties()[0];
    const labeledSchedules = this.mapLabelsToProperties()[1];
    const {
      index,
      editPlant,
      plantState,
      savePlantEdits,
      resetPlantState,
      setTextfieldState,
      setScheduleState,
      setMistState,
      

    } = this.props;
    // if no modal opened (either info modal or edit modal), don't render anything. 
    // if modal is open but plant isn't being edited, return plant info. 
    if (!this.state.editPlant) {
      return (
        <div className="plant-modal">
          <div id="info-modal-buttons">
            <button onClick={() => {
              this.toggleEditPlant();
              editPlant(plantState);
              }
            }>Edit Info</button>
          </div>
          <fieldset className="plant-info">
            {labeledAttributes}
            {labeledSchedules}
          </fieldset>
        </div>
      )
    // else if plant is being edited, render edit plant modal. 
    } else { 
      console.log('Edit Plant Form rendered')
      return (
        <PlantForm
              formName='edit-plant'
              btnText='Save Plant'
              submitPlant={savePlantEdits}
              resetPlantState={resetPlantState}
              setTextfieldState={setTextfieldState}
              setScheduleState={setScheduleState}
              setMistState={setMistState}
              plantState={plantState}
            >
          </PlantForm>
      );
    }
  }
  
};

export default PlantInfo;
