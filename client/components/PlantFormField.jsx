import React from 'react';

const PlantFormField = ({label, name, value, setTextfieldState}) => {
  return (
      <div>
        <label className='field-label'>
          {label}
        </label>
        <input className='field-input' value={value} name={name} type='text' onChange={(e) => setTextfieldState(name, e.target.value)} />
      </div>
  )
}

export default PlantFormField;