import React from 'react';

const EditPlantField = ({setPlantState, stateObjName, fieldLabel, plantField, propertyToEdit}) => {
  return (
    <label> 
      <input type="text" onChange={(e) => setPlantState(stateObjName, null, propertyToEdit, e.target.value)} defaultValue={plantField}></input>
      {fieldLabel}
    </label>
  )
};

export default EditPlantField;