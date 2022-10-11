import React from 'react';

const FormField = props => {
  return (
    <label> 
      <input onChange={(e) => props.setNewPlantState(props.inputProperty, e.target.value)}></input>
      {props.fieldLabel}
    </label>
  )
}

export default FormField;