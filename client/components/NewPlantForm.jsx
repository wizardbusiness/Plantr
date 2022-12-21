import React, {Component} from 'react';
import '../../src/styles';
import FormField from './FormField';
import Checkbox from './Checkbox';
import WaterDateDropdown from './WaterDateDropdown';
import WaterTimeDropdown from './WaterTimeDropdown';


class NewPlantForm extends Component {
  constructor(props) {
    super(props);
    this.makeFormFields = this.makeFormFields.bind(this);
  };
  
  makeFormFields() {

    const {plantState, setPlantState } = this.props
    const fieldLabels = [
      ['name', ' Plant Name'], 
      ['light', ' Light Preference'], 
      ['soil', ' Soil Preference'], 
      ['fertilizer', 'Fertilizer Preference'], 
      ['notes', ' Notes'], 
      ['date', ' Schedule'], 
      ['tod', ' Watering Time'], 
      ['mist', ' Mist']
    ];
    const stateObjName = 'newPlant';
    return fieldLabels.map( (label, index) => {
      const key = `plant${index}`;
      if (index === 5) 
        return (
          <WaterDateDropdown
            key={key}
            isOpen={false}
            label={label[1]}
            stateObjName={stateObjName}
            setPlantState={setPlantState}
            waterSchedule={plantState.date}
          />
        )
      else if (index === 6) 
          return (
            <WaterTimeDropdown
              key={key}
              label={label[1]}
              stateObjName={stateObjName}
              setPlantState={setPlantState}
              tod={plantState.tod}
            />
          )
      else if (index === 7)
        return (
          <Checkbox
            key={key}
            stateObjName={stateObjName}
            setPlantState={setPlantState}
            propertyToChange={label[0]}
            label={label[1]}
          />
        )
      else return (
        <FormField 
          key={key}
          fieldLabel={label[1]}
          inputProperty={label[0]}
          stateObjName={stateObjName}
          setPlantState={setPlantState}
        /> 
      )
   });
  }
  
  render() {
    const formFields = this.makeFormFields();
    const { toggleModal, savePlant, modalVisible } = this.props;
    // >>> Warning: For some reason, lifting up the state of the modal toggle into plantView causes props to be undefined when modal state is changed. <<<
    if (!modalVisible) return null;
    return (
        <div id="plant-form-overlay">
          <div id="new-plant-form">
            <button onClick={() => toggleModal()}> x </button>
            {formFields}
            <button onClick={() => {
              savePlant();
              toggleModal();
            }}>Add Plant</button>
          </div>
        </div>
    );
  }
}

export default NewPlantForm;