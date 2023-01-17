import React from 'react';

const MistCheckbox = ({label, stateObjName, propertyToChange, value, setPlantState}) => { 
  return (
    <label>
      <input 
        type = 'checkbox'
        checked = {value} 
        onChange={() => setPlantState(stateObjName, null, propertyToChange)}
      />
      {label}
    </label>
  )
}

export default MistCheckbox;