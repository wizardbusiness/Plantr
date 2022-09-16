import React from 'react';
import { render } from 'react-dom';

const FormField = props => {

  return (
    <label> {props.fieldLabel}
      <input onChange={(e) => props.setNewPlantState(props.inputId, e.target.value)}></input>
    </label>
  )
}

export default FormField;