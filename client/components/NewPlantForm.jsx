import React, {Component} from 'react';
import '../../src/styles';
import NewPlant from './NewPlant';
import FormField from './FormField';

class NewPlantForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plantForm: {
        name: '',
        waterFreq: '',
        fertilizeFreq: '',
        lightPref: '',
        soilPref: '',
        fertilizerPref: '',
        notes: '',
      },
    }
    this.makeFormFields = this.makeFormFields.bind(this);
    this.setNewPlantState = this.setNewPlantState.bind(this);
  }

  setNewPlantState(property, value) {
    console.log(this.state.plantForm)
    this.setState({
      plantForm: {
        ...this.state.plantForm,
        [property]: value,
      }
    })

    
  }

  componentDidMount() {
    this.makeFormFields();
  }

  makeFormFields() {
    const inputIds = Object.keys(this.state.plantForm)
    const fieldLabels = ['Plant Name: ', 'Water Frequency: ', 'Fertilize Frequency: ', 'Light Preference: ', 'Soil Preference: ', 'Fertilizer Preference: ', 'Notes: '];
   return fieldLabels.map( (label, index) => {
      return (
        <FormField 
          fieldLabel={label}
          inputId={inputIds[index]}
          setNewPlantState={this.setNewPlantState}
        /> 
      )
   });
  }
  
  
  render() {
    const formFields = this.makeFormFields()
    return (
    <div id="form-border">
        {formFields}
      <NewPlant />
    </div>
    );
  }
}

export default NewPlantForm;