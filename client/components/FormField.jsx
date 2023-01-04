import React from 'react';

const FormField = ({stateObjName, name, inputProperty, fieldLabel, setPlantState, value}) => {
  return (
    <label htmlFor={name}> 
      <input 
        type="text"
        name={name}
        defaultValue={value}
        onBlur={(e) => setPlantState(stateObjName, null, inputProperty, e.target.value)}>
        </input>
      {fieldLabel}
    </label>
  )
}
export default FormField;