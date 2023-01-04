import React, {Component} from 'react';

class PlantModal extends Component {
  // modal state
  constructor(props) {
    super(props);
    this.state = {
      show: false
    }
  }
  // toggle modal
  toggle() {
    this.setState({
      // show: this.state.show === false ? true : false
      show: this.state.show === false ? this.state.show = true : this.state.show = false
    });
  }

  render() {
    const {children, buttonText, buttonId} = this.props;
    return (
      <div className="plant-form-overlay">
        <div className="plant-form">
          <button id={buttonId} onClick={this.toggle()}>{buttonText}</button>
          {this.state.show === true && children}
        </div>
      </div>
    )
  }
}