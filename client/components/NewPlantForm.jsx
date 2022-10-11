import React, {Component} from 'react';
import '../../src/styles';
import FormField from './FormField';


class NewPlantForm extends Component {
  constructor(props) {
    super(props);
    this.makeFormFields = this.makeFormFields.bind(this);
  };

  

  makeFormFields() {
    // make inputIds for all visible fields. slice off the id, since it isn't visible.
    const inputProperties = Object.keys(this.props.plantState).slice(1);
    const fieldLabels = [' Plant Name', ' Water Frequency', ' Fertilize Frequency', ' Light Preference', ' Soil Preference', ' Fertilizer Preference', ' Notes'];
    return fieldLabels.map( (label, index) => {
      return (
        <FormField 
          value={this.props.plantState[inputProperties[index]]}
          key={`plant${index}`}
          fieldLabel={label}
          inputProperty={inputProperties[index]}
          setNewPlantState={this.props.setNewPlantState}
        /> 
      )
   });
  }
  
  
  render() {
    const { id, name, water_at_date, fertilize_at_date, light_pref, soil_pref, fertilizer_pref, notes} = this.props.plantState;
    const formFields = this.makeFormFields()
    // >>> Warning: For some reason, lifting up the state of the modal toggle into plantView causes props to be undefined when modal state is changed. <<<
    if (!this.props.modalVisible) return null;
    return (
        <div id="plant-form-overlay">
          <div id="new-plant-form">
            <button onClick={() => this.props.toggle()}> x </button>
              {formFields}
            <button onClick={() => {
              this.props.addPlant();
              this.props.toggle();
              }}>Add Plant</button>
          </div>
        </div>
    );
  }
}

export default NewPlantForm;