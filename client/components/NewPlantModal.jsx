
import React, { Component } from 'react';
import NewPlantForm from './NewPlantForm';

class NewPlantModal extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        modal: {
        show: false,
      }
    }
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      ...this.state.modal,
      show: this.state.modal.show === false ? this.state.modal.show = true : this.state.modal.show = false
    })
  };

  render() {
    return (
      <div className="planter-box">
        <button id="new-plant" onClick={ () => this.toggleModal() }> + </button>
        {/* must check for state first for this to work */}
        {this.state.modal.show === true && <NewPlantForm
          nameValue={this.props.nameValue}
          toggleModal={this.toggleModal}
          plantState={this.props.plantState}
          setPlantState={this.props.setPlantState}
          resetPlantState={this.props.resetPlantState}
          savePlant={this.props.savePlant}
        />}
      </div>
    );
  }
}
    


export default NewPlantModal;