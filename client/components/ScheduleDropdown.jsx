import React, { Component } from 'react';

// Description: dropdown menu, which lets you set how often to water a plant or fertilize a plant.
const ScheduleDropdown = ({scheduleType, currentSchedule, setScheduleState}) => {
  // get the unit of time that is being selected by the user.
  const getDateUnit = (dateUnit) => {
    let max;
    switch(dateUnit) {
      case 'weeks':
        max = 4;
        break;
      case 'days': 
        max = 6;
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
    let unit = 1;
    const list = [`set ${dateUnit}`];
    let max = getDateUnit(dateUnit)
    while (unit <= max) {
      list.push(unit)
      unit++;
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
    // console.log(currentSchedule)
    return (
      <> 
        <select
          value={currentSchedule[dateUnit]}
          onChange={(e) => setScheduleState(scheduleType, dateUnit, e.target.value)}
        >
          {items}
        </select>
        <label> {dateUnit} </label>
      </>
    );  
  };
  // return the completed schedule component jsx.
  return (
        <span>
          {makeScheduleOptions('weeks')}
          {makeScheduleOptions('days')}
        </span>
  );
};

export default ScheduleDropdown;