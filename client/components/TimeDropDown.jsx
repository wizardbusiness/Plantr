import React, {useEffect, useState} from 'react';

// Description: dropdown menu which sets the time of day to water a plant.
// Relationships: Rendered by NewPlantForm and EditPlantForm. 

const TimeDropdown = ({timeOfDayState, setTimeOfDayState, stateObjName, label}) => {
  // console.log(setTimeOfDayState)
  // console.log(timeOfDayState)
  // picks the time of day to water plants
  
  // const [selectedTime, setSelectedTime] = useState(chosenTime)

  const scheduleTOD = () => {
    const labels = {
      unselected_tod: 'set time',
      morning: 'Morning',
      midday: 'Afternoon', 
      evening: 'Evening'
    };
    const timesOfDay = Object.keys(timeOfDayState);
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
    const chosenTime = Object.entries(timeOfDayState).filter(entry => entry[1])[0][0];
    return (
        <select
          id='select'
          value={chosenTime} 
          onChange={(e) => {
            setTimeOfDayState(e.target.value, stateObjName)
            }
          }
          >
          {options}
        </select>
    )
  }

    return (
      <span className="drop-down">
        {scheduleTOD()}
        <label className="label">{label}</label>
      </span>
      
    )
  }


export default TimeDropdown;