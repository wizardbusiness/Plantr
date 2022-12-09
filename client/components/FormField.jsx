import React from 'react';

const FormField = ({inputProperty, fieldLabel, setPlantState}) => {
  return (
    <label> 
      <input onBlur={(e) => setPlantState(null, inputProperty, e.target.value)}></input>
      {fieldLabel}
    </label>
  )
}

export default FormField;