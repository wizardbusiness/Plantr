import React from 'react';

const FormField = ({stateObjName, inputProperty, fieldLabel, setPlantState}) => {
  return (
    <label> 
      <input onBlur={(e) => setPlantState(stateObjName, null, inputProperty, e.target.value)}></input>
      {fieldLabel}
    </label>
  )
}

export default FormField;