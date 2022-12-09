import React from 'react';

const Checkbox = ({label, setPlantState}) => { 
  return (
    <label>
      <input 
        type = 'checkbox' 
        onChange={() => setPlantState(null, 'mist')}
      />
      {label}
    </label>
  )
}

export default Checkbox;