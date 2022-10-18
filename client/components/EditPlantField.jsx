import React from 'react';

const EditPlantField = (props) => {
  return (
    <label> 
      <input type="text" onChange={(e) => props.editPlantState(props.plantField, e.target.value, props.plantName)} value={props.plantField}></input>
      {props.fieldLabel}
    </label>
  )
};

export default EditPlantField;