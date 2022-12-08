import React, {Component} from 'react';
import '../../src/styles';
import FormField from './FormField';
import WaterDateDropdown from './WaterDateDropdown';
import WaterTimeDropdown from './WaterTimeDropdown';


class NewPlantForm extends Component {
  constructor(props) {
    super(props);
    this.makeFormFields = this.makeFormFields.bind(this);
  };

  
  makeFormFields() {

    const {plantState, setPlantState } = this.props
    // make inputIds for all visible fields. slice off the id, since it isn't visible.
    const inputProperties = Object.keys(plantState).slice(1);
    const fieldLabels = [' Plant Name', ' Light Preference', ' Soil Preference', ' Fertilizer Preference', ' Notes', ' Schedule', ' Watering Time', ' Mist'];
    return fieldLabels.map( (label, index) => {
      if (index === 5) 
        return (
          <WaterDateDropdown
            key={`plant${index}`}
            isOpen={false}
            label={label}
            setPlantState={setPlantState}
            waterDate={plantState.date}
          />
        )

      if (index === 6) 
          return (
            <WaterTimeDropdown
              key={`plant${index}`}
              label={label}
              tod={plantState.tod}
              setPlantState={setPlantState}
            />
          )
      return (
        <FormField 
          value={plantState[inputProperties[index]]}
          key={`plant${index}`}
          fieldLabel={label}
          inputProperty={inputProperties[index]}
          setPlantState={setPlantState}
        /> 
      )
   });
  }
  
  render() {
    const formFields = this.makeFormFields();
    const { toggleModal, addPlant, modalVisible } = this.props;
    // >>> Warning: For some reason, lifting up the state of the modal toggle into plantView causes props to be undefined when modal state is changed. <<<
    if (!modalVisible) return null;
    return (
        <div id="plant-form-overlay">
          <div id="new-plant-form">
            <button onClick={() => toggleModal()}> x </button>
            {formFields}
            <button onClick={() => {
              addPlant();
              toggleModal();
            }}>Add Plant</button>
          </div>
        </div>
    );
  }
}

export default NewPlantForm;