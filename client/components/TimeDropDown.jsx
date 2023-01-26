import React from 'react';

// Description: dropdown menu which sets the time of day to water a plant.
// Relationships: Rendered by NewPlantForm and EditPlantForm. 

const TimeDropdown = ({timeOfDayState, setTimeOfDayState, stateObjName, label}) => {
  // console.log(setTimeOfDayState)
  // console.log(timeOfDayState)
  // picks the time of day to water plants
  const scheduleTOD = () => {
    const labels = {
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
          defaultValue={chosenTime}
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
      <div className="drop-down">
          <span>
            {scheduleTOD()}
          </span>
          <span className="label">{label}</span>
      </div>
    )
  }


export default TimeDropdown;