import React, { Component } from 'react';
import PlantDetail from './PlantDetail';
import EditPlantForm from './EditPlantForm';

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
    const { plantProperties } = this.props;
    const labelMap = this.state.plantLabelMap;
    // initial pass:
    // iterate through plant properties and filter for string values.
    const stringValues = Object.entries(plantProperties).filter(entry => typeof entry[1] === 'string');
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
    // second pass:
    // iterate through plant properties and filter for object values.
    const scheduleObjValues = Object.entries(plantProperties).filter((entry) => typeof entry[1] === 'object' && entry[0] !== 'img');
    
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
      editedPlant,
      clonePlant,
      editPlant,
      savePlantEdits,
      setPlantState,
      toggleModal
    } = this.props;

    // if no modal opened (either info modal or edit modal), don't render anything. 
    // if modal is open but plant isn't being edited, return plant info. 
    if (!this.state.editPlant) {
      return (
        <div className="plant-modal">
          <div id="info-modal-buttons">
            <button onClick={() => {
              this.toggleEditPlant();
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
    // } else { 
    //   console.log('Edit Plant Form rendered')
    //   return (
    //     <EditPlantForm 
    //       index={index}
    //       // get the plant details from the isolated edited plant state object. 
    //       plantDetails={editedPlant}
    //       editPlant={editPlant}
    //       setPlantState={setPlantState}
    //       savePlantEdits={savePlantEdits}
    //       toggleEditPlant={this.toggleEditPlant}
    //     />
    //   );
    }
  }
  
};

export default PlantInfo;
