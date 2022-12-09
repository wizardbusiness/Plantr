import React from 'react';

// Description: dropdown menu which sets the time of day to water a plant.
// Relationships: Rendered by NewPlantForm and EditPlantForm. 

const WaterTimeDropdown = ({tod, setPlantState, label}) => {
  
  // picks the time of day to water plants
  const scheduleTOD = () => {
    const labels = ['Morning', 'Afternoon', 'Evening'];
    const timesOfDay = Object.keys(tod);
    const options = timesOfDay.map((time, index) => {
      return (
        <option
          key={'time' + index}
          value={time}
        >
          {labels[index]}
        </option>
      )
    });

    return (
      <>
        <select
          id='select'
          onChange={(e) => {
            setPlantState('tod', e.target.value, 0, timesOfDay)
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