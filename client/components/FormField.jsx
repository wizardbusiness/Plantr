import React from 'react';

const FormField = ({stateObjName, inputProperty, fieldLabel, setPlantState, value}) => {
  return (
    <label> 
      <input onBlur={(e) => setPlantState(stateObjName, null, inputProperty, e.target.value)} defaultValue={value}></input>
      {fieldLabel}
    </label>
  )
}

export default FormField;