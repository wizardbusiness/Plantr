import React, {Component, useRef} from 'react';
import WaterDateDropDown from './WaterDateDropdown';

class PlantForm extends Component {
  constructor(props) {
    super(props)
    // field labels. Only for text input fields. 
    this.labelRefs = useRef({
      name: 'Name ',
      light: 'Light ',
      soil: 'Soil ',
      fertilizer: 'Fertilizer ',
      notes: 'Notes ' 
    });

    this.makeTextFields = this.makeTextFields.bind(this);
  }

  // make all input boxes with labels.
  makeTextFields() {
    const {fieldValues, addPlant, setFieldState, children: {dropdowns, mist}} = this.props
    Object.entries(labelRefs.current).map((label, index) => {
      const key = `att${index}`;
      return(
          <PlantFormField
            key={key}
            label={label[1]}
            setFieldState={setFieldState}
            name={label[0]}
            value={fieldValues[label[0]]}
          />
      )
    });
  }

  // render whole form, including dropdown and checkbox components. 
  render() {
    const {addPlant, btnText} = this.props;
    const textFields = this.makeTextFields();
    return (
      <form onSubmit={addPlant}>
        {textFields}
        <br />
        <label>
          Watering Schedule:&nbsp;
          <SchedulingDropdown/>
        </label>
        <br />
        <label>
          Fertilizing Schedule:&nbsp; 
          <SchedulingDropdown/>
        </label>
        <label>
          Mist:&nbsp;
          <MistCheckBox/>
        </label>
        <button type="submit">{btnText}</button>
      </form>
    );
  }
}

export default PlantForm;