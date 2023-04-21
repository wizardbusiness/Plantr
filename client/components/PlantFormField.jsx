import React from 'react';

const PlantFormField = ({id, name, value, setPlantInfo, windowWidth}) => {


  return (
      <div id={id} className='journal-line'>
        {/* <label className='field-label'>
          {name}&nbsp;
        </label> */}
        
      <input className='field-input' style={{'fontSize': `${windowWidth * .0062}pt`}} value={value} name={name} type='text' 
        onChange={(e) => setPlantInfo(prevState => {
          return(
            {
            ...prevState,
            [name]: e.target.value
            }
          )
        }
      )} />
      <svg className='journal-line-text' height={windowWidth * .035} width={windowWidth * .11} viewBox="0 0 229.4 72.5">
      {/* <defs> */}
      <path id="line-text-path" d="M2,57.9c4.2-0.4,75.5,2.8,126.8,6.9c57.8,4.7,82.2,7.6,82.2,7.6"/>

      {/* </defs> */}
        <text fill='#827978'>
          <textPath href="#line-text-path">{value}</textPath>
        </text>
        
      </svg> 
      
    </div>
  )
}

export default PlantFormField;