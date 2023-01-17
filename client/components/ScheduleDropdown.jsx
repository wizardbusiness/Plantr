import React, { Component } from 'react';

// Desc: dropdown menu, which lets you set how often to water a plant or fertilize a plant.
// Relationships: Rendered by NewPlantForm and EditPlantForm. 


const ScheduleDropdown = ({scheduleType, setScheduleState}) => {
  const getUnit = (unit, max) => {
    switch(unit) {
      case 'weeks':
        max = 5;
        break;
      case 'days': 
        max = 7;
        break;
      case 'hours': 
        max = 24;
        break;
      case 'mins':
      max = 60;
      break;
    };
    return max;
  }

  const makeScheduleOptions = (unit) => {
    
    // these will be passed through props
    let i = 0;
    let max;
    const list = [];
    max = getUnit(unit, max);


    while (i < max) {
      list.push(i)
      i++;
    }

    const items = list.map((value, index) => {
      return (
          <option
          key={'opt' + index}
          value={value}
          >
            {value}
          </option>
      )
    });

    return (
      <>
        <label> {unit}: </label>
        <select
          value={scheduleType[unit]}
          onChange={(e) => setScheduleState(scheduleType, unit, Number(e.target.value))}
        >{items}</select>
      </>
    );  
  }
    
  return (
    <div className="schedule-drop-down"> 
        <span>
          {makeScheduleOptions('weeks')}
          {makeScheduleOptions('days')}
          {/* {makeScheduleOptions('hours')}
          {makeScheduleOptions('mins')} */}
        </span>
    </div>
  );
}

export default ScheduleDropdown;