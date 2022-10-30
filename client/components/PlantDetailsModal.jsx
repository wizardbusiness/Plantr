import React, { Component } from 'react';
import PlantInfo from './PlantInfo';

class PlantDetailsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        show: false,
      }
    };
    this.toggleModal = this.toggleModal.bind(this);
  };
  // inputs: unique id, event info 
  // output: modal with info from database
  
  // gets info for plant that was clicked. 
  // input: plant id

  toggleModal() {
    this.setState({
      ...this.state.modal,
        show: this.state.modal.show === false ? this.state.modal.show = true : this.state.modal.show = false
    });
  };

  // render each component with this modal
  // on click, check the element being clicked against the plant id in the database. 
  // retrieve info for that plant, and display inside the modal. 
  render() {
    return (
      <article id="info-button">
        <button onClick={() => this.toggleModal()}>Info</button>
        <PlantInfo  
          id={this.props.id} 
          index={this.props.index}
          plants={this.props.plants}
          backupPlant={this.props.backupPlant}
          editedPlant={this.props.editedPlant}
          plantDetails={this.props.plantDetails} 
          modalVisible={this.state.modal.show} 
          toggle={this.toggleModal} 
          editPlantState={this.props.editPlantState}
          saveEditedPlant={this.props.saveEditedPlant}
        />
      </article>
    )
  };
}

export default PlantDetailsModal;