import React, {Component} from 'react';

class PlantModal extends Component {
  // modal state
  constructor(props) {
    super(props);
    this.state = {
      show: false
    }
    this.toggle = this.toggle.bind(this);
  }
  // toggle modal
  toggle() {
    this.setState({
      // show: this.state.show === false ? true : false
      show: this.state.show === false ? this.state.show = true : this.state.show = false
    });
  }

  render() {
    const {children, buttonText, buttonId, resetPlantState} = this.props;
    if (this.state.show === false) {
      return (
        <button id={buttonId} onClick={this.toggle}>{buttonText}</button>
      );
    } else if (this.state.show === true) {
      return (
        <div>
          <button id={buttonId}>{buttonText}</button>
          <div className='modal-bg-overlay'>
            <div className='modal'>
              <button
                onClick={() => {
                  this.toggle()
                  resetPlantState();
                }}
              >x</button>
              {children}
            </div>
          </div>
        </div>
        
      );
    };
  }
}

export default PlantModal;