import React, {Component} from 'react';
import ScheduleDropdown from './ScheduleDropdown';
import TimeDropdown from './TimeDropDown';
import MistCheckbox from './MistCheckbox';
import PlantFormField from './PlantFormField';

class PlantForm extends Component {
  constructor(props) {
    super(props)
    // field labels. Only for text input fields. 
    this.state = {
      name: 'Name: ',
      light: 'Light: ',
      soil: 'Soil: ',
      fertilizer: 'Fertilizer: ',
      notes: 'Notes: ' 
    };
    this.makeTextFields = this.makeTextFields.bind(this);
  }

  // make all input boxes with labels.
  makeTextFields() {
    const {plantState, setTextfieldState} = this.props
    const formFields = Object.entries(this.state).map((label, index) => {
      const key = `att${index}`;
      return(
        <PlantFormField
          key={key}
          label={label[1]}
          name={label[0]}
          value={plantState[label[0]]}
          setTextfieldState={setTextfieldState}
        />
      );
    });
    return formFields;
  }

  // render whole form, including dropdown and checkbox components. 
  render() {
    const {submitPlant, btnText, formName, plantState, setScheduleState, setTimeOfDayState, setMistState, toggleModal} = this.props;
    const textFields = this.makeTextFields(); 
    return (
      <form 
        className='plant-form' 
        name={formName} 
        onSubmit={(e) => {
          submitPlant(e);
          toggleModal();

        }
        }>
        <div className='form-text-fields'>
          {textFields}
        </div> 
        <label>
          Watering Schedule:&nbsp;
        </label>
        <span>
            <label>
              Every&nbsp;
            </label> 
            <ScheduleDropdown
            setScheduleState={setScheduleState}
            scheduleType='watering_schedule'
            currentSchedule={plantState.watering_schedule}
            />
          
          <label>
            in the:&nbsp;
            <TimeDropdown 
              setTimeOfDayState={setTimeOfDayState}
              timeOfDayState={plantState.watering_time_of_day}
              stateObjName='watering_time_of_day'
            />
          </label>
        </span>
        
        <label>
          Fertilizer Schedule:&nbsp;
        </label>
        <span>
          <label>
            Every&nbsp;
          </label>
          <ScheduleDropdown 
            setScheduleState={setScheduleState}
            scheduleType='fertilizer_schedule'
            currentSchedule={plantState.fertilizer_schedule}
          />
        <label>
          in the:&nbsp;
          <TimeDropdown 
            setTimeOfDayState={setTimeOfDayState}
            timeOfDayState={plantState.fertilize_time_of_day}
            stateObjName='fertilize_time_of_day'
          />
        </label>
        </span>  
        <label>
          Mist:&nbsp;
          <MistCheckbox value={plantState.mist} setMistState={setMistState}/>
        </label>
        <button type="submit">{btnText}</button>
      </form>
    );
  }
}

export default PlantForm;