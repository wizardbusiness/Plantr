import React from 'react';

const PlantFormField = ({label, name, value, setPlantInfo}) => {
  return (
      <div className='field'>
        <label className='field-label'>
          {label}&nbsp;
        </label>
        <input className='field-input' value={value} name={name} type='text' 
          onChange={(e) => setPlantInfo(prevState => {
            return(
              {
              ...prevState,
              [name]: e.target.value
              }
            )
          }
        )} />
      </div>
  )
}

export default PlantFormField;