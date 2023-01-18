import React, {Component} from 'react';
import ScheduleDropdown from './ScheduleDropdown';
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
    const {addPlant, btnText, formName, plantState, setScheduleState, setMistState} = this.props;
    const textFields = this.makeTextFields(); 
    return (
      <form className='form' name={formName} onSubmit={addPlant}>
        <div className='form-text-fields'>
          {textFields}
        </div>
        <label>
          Watering Schedule:&nbsp;
          <ScheduleDropdown
            setScheduleState={setScheduleState}
            scheduleType='watering_schedule'
            currentSchedule={plantState.watering_schedule}
          />
        </label>
        <label>
          Fertilizer Schedule:&nbsp;
          <ScheduleDropdown 
            setScheduleState={setScheduleState}
            scheduleType='fertilizing_schedule'
            currentSchedule={plantState.fertilizing_schedule}
          />
        </label>
        <label>
          Mist:&nbsp;
          <MistCheckbox value={plantState.mist} setMistState={setMistState}/>
        </label>
        {/* <button id={buttonId} onClick={this.toggle()}>{buttonText}</button>s */} 
        <button type="submit">{btnText}</button>
      </form>
    );
  }
}

export default PlantForm;