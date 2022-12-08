import React, { Component } from 'react';

// Desc: dropdown menu, which lets you set how often to water a plant or fertilize a plant.
// Relationships: Rendered by NewPlantForm and EditPlantForm. 


class WaterDateDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
       isOpen: false,
       schedule: {
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0
      }
    }
    this.makeScheduleOptions = this.makeScheduleOptions.bind(this);
  }

  makeScheduleOptions(unit) {
    const { dateObj, setNewPlantState } = this.props
    // these will be passed through props
    let i = 0;
    let max;
    const list = [];

    const getUnit = () => {
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
    }

    getUnit();

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
          onChange={(e) => setNewPlantState('date', unit, e.target.value)}
        >{items}</select>
      </>
    );  
  }

  render() {
    
    return (
      <div className="schedule-drop-down"> 
          <span>
            {this.makeScheduleOptions('weeks')}
            {this.makeScheduleOptions('days')}
            {/* {this.makeScheduleOptions('hours')}
            {this.makeScheduleOptions('mins')} */}
          </span>
          <span className="label">{this.props.label}</span>
      </div>
    );
  }
}

export default WaterDateDropDown;