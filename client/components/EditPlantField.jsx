import React from 'react';

const EditPlantField = (props) => {
  return (
    <label> 
      <input type="text" onChange={(e) => props.editPlantState(props.propertiesToEdit, e.target.value, props.plantName, props.plants)} value={props.plantField}></input>
      {props.fieldLabel}
    </label>
  )
};

export default EditPlantField;