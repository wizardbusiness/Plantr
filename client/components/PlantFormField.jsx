import React from 'react';

const PlantFormField = ({label, name, value, setTextfieldState}) => {
  // console.log(label)
  return (
    <label>
      <span>
        {label}
        <input value={value} name={name} type='text' onChange={(e) => setTextfieldState(name, e.target.value)} />
      </span>
    </label>
  )
}

export default PlantFormField;