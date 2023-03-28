import React from 'react';

const PlantFormField = ({label, name, value, setPlantInfo}) => {
  return (
      <div>
        <label className='field-label'>
          {label}
        </label>
        <input className='field-input' value={value} name={name} type='text' 
          onChange={(e) => setPlantInfo(prevState => {
            console.log(name)
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