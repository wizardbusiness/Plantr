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
        watering_schedule: 'Water Every ',
        watering_time_of_day: 'in the ',
        days: ' Days',
        weeks: ' Weeks',
        months: ' Months',
        fertilizer_schedule: 'Fertilize Every ',
        fertilize_time_of_day: 'in the ',
        morning: ' Morning',
        midday: ' Afternoon',
        evening: ' Evening'
      },
    }

    this.toggleEditPlant = this.toggleEditPlant.bind(this);
    this.createInfoFieldElements = this.createInfoFieldElements.bind(this);
    this.createScheduleElement = this.createScheduleElement.bind(this);
  }

  toggleEditPlant() {
    this.setState({
      editPlant: this.state.editPlant === false ? this.state.editPlant = true : this.state.editPlant = false
    })
  };

  
  createInfoFieldElements() {
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
    console.log(infoFieldElements)
    // return labeled string attributes and labeled schedules
    return infoFieldElements
  };

  createScheduleElement(scheduleType) { 
    const { focusedPlantState } = this.props;
    console.log(focusedPlantState)
    const labelMap = this.state.plantLabelMap; 
    // iterate through plant properties and filter for object values to create schedule elements.
    const scheduleObjValues = Object.entries(focusedPlantState).filter((entry) => typeof entry[1] === 'object' && entry[0] !== 'img');
    const scheduleInfo = scheduleType === 'watering' ? scheduleObjValues.filter(entry => entry[0].match(/watering/)) : 
      scheduleObjValues.filter(entry => entry[0].match(/fertilize/));
      console.log(scheduleInfo)
      // put together all info for schedule on a single line
    const scheduleElement = scheduleInfo.map((entry, index) => {
      const key =`schedule${index}`;
      // each entry has the property name and the schedule object
      const [ stateProperty, scheduleObj] = entry;
      // label each schedule using the labelMap
      const label = labelMap[stateProperty];
      console.log(label)
      // filter out unused scheduling options inside the schedule object
      const filteredSchedule = Object.entries(scheduleObj).filter(entry => entry[1]);
      // map filtered schedule to jsx component
      const scheduleProperties = filteredSchedule.map((entry, index) => {
        // each entry has the property that will be used in the label map to label the value
        const [ labelMapProperty, value ] = entry;
        const key = `scheduleVal${index}`;
        return (
          <span key={key}>
            {value}
            <label>
              {labelMap[labelMapProperty]}&nbsp;
            </label>
          </span>
        );
      });  
      // label the schedule and return the completed component
      return(
        <span>
          <label key={key}>
            {label}
          </label>
          {scheduleProperties}
        </span>
      )
    });
    return (
      <span>
        {scheduleElement}
      </span>
    );
  }

  render() {
    const infoFieldElements = this.createInfoFieldElements();
    const wateringInfo = this.createScheduleElement('watering')
    const fertilizeInfo = this.createScheduleElement('fertilize')
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
            {wateringInfo}
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
