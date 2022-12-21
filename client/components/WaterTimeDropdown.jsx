import React from 'react';

// Description: dropdown menu which sets the time of day to water a plant.
// Relationships: Rendered by NewPlantForm and EditPlantForm. 

const WaterTimeDropdown = ({stateObjName, tod, setPlantState, label}) => {
  
  // picks the time of day to water plants
  const scheduleTOD = () => {
    const labels = {
      'morning': 'Morning',
      'mid': 'Afternoon', 
      'evening': 'Evening'
    };
    const timesOfDay = Object.keys(tod);
    const options = timesOfDay.map((time, index) => {
      return (
        <option
          key={`time${index}`}
          value={time}
        >
          {labels[time]}
        </option>
      )
    });
    const chosenTime = Object.entries(tod).filter(entry => entry[1] === true);
    return (
      <>
        <select
          id='select'
          value={chosenTime[0][0]}
          onChange={(e) => {
            setPlantState(stateObjName, 'tod', e.target.value, 0, timesOfDay)
            }
          }
          >
          {options}
        </select>
      </>
    )
  }

    return (
      <div className="drop-down">
          <span>
            {scheduleTOD()}
          </span>
          <span className="label">{label}</span>
      </div>
    )
  }


export default WaterTimeDropdown;