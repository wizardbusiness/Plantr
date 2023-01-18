import React, { Component } from 'react';

// Description: dropdown menu, which lets you set how often to water a plant or fertilize a plant.
const ScheduleDropdown = ({scheduleType, currentSchedule, setScheduleState}) => {
  // get the unit of time that is being selected by the user.
  const getDateUnit = (dateUnit) => {
    let max;
    switch(dateUnit) {
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
  };
  // make the menu options depending on what unit was selected. 
  const makeScheduleOptions = (dateUnit) => {
    let i = 0;
    const list = [];
    let max = getDateUnit(dateUnit)
    while (i < max) {
      list.push(i)
      i++;
    };
    const items = list.map((value, index) => {
      return (
          <option
          key={'opt' + index}
          value={value}
          >
            {value}
          </option>
      );
    });
    // return the schedule dropdown menu for the selected date unit.
    return (
      <>
        <label> {dateUnit}: </label>
        <select
          defaultValue={currentSchedule[dateUnit]}
          onChange={(e) => setScheduleState(scheduleType, dateUnit, e.target.value)}
        >
          {items}
        </select>
      </>
    );  
  };
  // return the completed schedule component jsx.
  return (
    <div className="schedule-drop-down"> 
        <span>
          {makeScheduleOptions('weeks')}
          {makeScheduleOptions('days')}
        </span>
    </div>
  );
};

export default ScheduleDropdown;