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
        watering_time_of_day: 'Water in the: ',
        days: ' Days',
        weeks: ' Weeks',
        months: ' Months',
        fertilizer_schedule: 'Fertilize Every: ',
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
    const { focusedPlantState } = this.props;
    const labelMap = this.state.plantLabelMap;
    // initial pass: string attributes
    // iterate through plant properties and select all primitive values that need a label.
    const primitivePropsWithLabel = [];
    for (const property in focusedPlantState) {
      const value = focusedPlantState[property];
      if (property in labelMap && typeof value === 'string') primitivePropsWithLabel.push([property, value])
    }
    const labeledStringAttributes = primitivePropsWithLabel.map((entry, index) => {
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
    const scheduleObjValues = Object.entries(focusedPlantState).filter((entry) => typeof entry[1] === 'object' && entry[0] !== 'img');
    const labeledSchedules = scheduleObjValues.map((entry, index) => {
      const key =`schedule${index}`;
      const [ stateProperty, scheduleObj] = entry;
      const label = labelMap[stateProperty];
      // filter out unused scheduling options
      const filteredSchedule = Object.entries(scheduleObj).filter(entry => entry[1]);
        // schedule details
        const scheduleInfo = filteredSchedule.map((entry, index) => {
          const [ labelMapProperty, value ] = entry;
          const key = `scheduleVal${index}`;
          return (
            <span key={key}>
              {value}
              <label >
                {labelMap[labelMapProperty]}&nbsp;
              </label>
            </span>
          );
        });  
      // label the schedule
      return(
        <label key={key}>
          {label}
          <span>
            {scheduleInfo}
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
      toggleModal,
      editPlant,
      genericPlantState,
      focusedPlantState,
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
          <div className="info-modal-buttons">
            <button 
              onClick={() => {
                this.toggleEditPlant();
                editPlant(focusedPlantState);
              }
            }>Edit</button>
          </div>
          <fieldset className="plant-info">
            {labeledAttributes}
            {labeledSchedules}
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
              setMistState={setMistState}
              plantState={genericPlantState}
            >
          </PlantForm>
      );
    }
  }
  
};

export default PlantInfo;
