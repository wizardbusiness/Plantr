import React, { Component } from 'react';

// Description: dropdown menu which sets the time of day to water a plant.
// Relationships: Rendered by NewPlantForm and EditPlantForm. 

class WaterTimeDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
    this.scheduleTOD = this.scheduleTOD.bind(this);
  }

  // picks the time of day to water plants
  scheduleTOD() {
    const { tod, setNewPlantState } = this.props;
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
            setNewPlantState('tod', e.target.value, 0, timesOfDay)
            }
          }
          >
          {options}
        </select>
      </>
    )
    
  }

  render() {
    const { isOpen, tod, label} = this.props;
    return (
      <div className="drop-down">
        <div
        onClick={this.toggleDropDown}
        ref={ref => (this.dropTogglerRef = ref)}
        >
          <span>
            {this.scheduleTOD()}
          </span>
          <span className="label">{label}</span>
        </div>
      </div>
    )
  }
}

export default WaterTimeDropdown;