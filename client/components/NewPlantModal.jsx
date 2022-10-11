
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
        <NewPlantForm
          nameValue={this.props.nameValue}
          modalVisible={this.state.modal.show}
          toggle={this.toggleModal}
          plantState={this.props.plantState}
          setNewPlantState={this.props.setNewPlantState}
          addPlant={this.props.addPlant}
        /> 
      </div>
    );
    }
}
    


export default NewPlantModal;