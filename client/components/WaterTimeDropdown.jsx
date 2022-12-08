import React, { Component } from 'react';

// Description: dropdown menu which sets the time of day to water a plant.
// Relationships: Rendered by NewPlantForm and EditPlantForm. 

class WaterTimeDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.scheduleTOD = this.scheduleTOD.bind(this);
  }

  toggleDropDown() {
    this.setState({
      isOpen: this.state.isOpen === false ? this.state.isOpen = true: this.state.isOpen = false
    });
  }

  handleClickOutside(event) {
    const path = event.path || (event.composedPath && event.composedPath());

    if (
      !path.includes(this.displayAreaRef) &&
      !path.includes(this.dropTogglerRef)
    ) {
      this.setState({
        isOpen: false
      });
      // no idea what this does, from dd tutorial. 
      // onChange && onChange(false)
    }
  }

  componentDidMount() {
    // Assign click handler to listen to the click to close the dropdown when clicked outside. 
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    // remove click handler when component closes. 
    document.removeEventListener('click', this.handleClickOutside);
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
            setNewPlantState('tod', e.target.value, timesOfDay)
            }
          }
          >
          {options}
        </select>
      </>
    )
    
  }

  render() {
    const { isOpen, tod, label, children } = this.props;
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

        {/* <div className="display-area">
          {this.state.isOpen && (
            <div
              className="children"
              ref={ref => (this.displayAreaRef = ref)}
            >
              {children}
            </div>
          )}
        </div> */}
      </div>
    )
  }
}

export default WaterTimeDropdown;