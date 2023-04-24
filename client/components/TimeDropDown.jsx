import React, {useEffect, useState} from 'react';

// Description: dropdown menu which sets the time of day to water a plant.
// Relationships: Rendered by NewPlantForm and EditPlantForm. 

const TimeDropdown = ({
    setScheduleTime,
    scheduleTimes,
    scheduleTimesType,
    chosenTime,
  }) => {
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
    const timesOfDay = Object.keys(scheduleTimes);
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
    return (
        <select
          id='select'
          value={chosenTime} 
          onChange={(e) => {
            setScheduleTime(e.target.value, scheduleTimesType)
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
      </span>
      
    )
  }


export default TimeDropdown;