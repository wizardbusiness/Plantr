import React, {Component} from 'react';
import PlantForm from './PlantForm';
import PlantInfo from './PlantInfo';

class PlantModal extends Component {
  constructor(props) {
    super(props)
    this.state ={
      showModal: false
    }
    this.toggleModal = this.toggleModal.bind(this);
  }
  
  toggleModal() {
    this.setState({
      showModal: this.state.showModal === false ? this.state.showModal = true : this.state.showModal = false
    });
  }
  render() {
    const {
      buttonText, 
      buttonId, 
      resetPlantState, 
      plantState,
      contents, 
      submitPlant,
      setTextfieldState,
      setScheduleState,
      setMistState,
      // plant info
      editPlant,
      focusedPlantState,
      genericPlantState,
      savePlantEdits,
    } = this.props;

    if (this.state.showModal === false) {
      return (
        <div className='modal-btn-container'>
          <button id={buttonId} onClick={() => this.toggleModal()}>{buttonText}</button>
        </div>
      );
    } else if (this.state.showModal === true && contents === 'plantform') {
      return (
        <div className='modal-btn-container'>
          <button id={buttonId}>{buttonText}</button>
          {/* <div className='modal-bg-overlay'> */}
            <div className='modal'>
              <button
                className='info-modal-buttons'
                onClick={() => {
                  this.toggleModal()
                  resetPlantState();
                }}
              >x</button>
              <PlantForm 
                formName='add-plant'
                btnText='Add Plant'
                // getPlants={this.getPlants} 
                toggleModal={this.toggleModal}
                submitPlant={submitPlant}
                setTextfieldState={setTextfieldState}
                setScheduleState={setScheduleState}
                setMistState={setMistState}
                showModal={this.state.showModal}
                plantState={plantState}
              />
            </div>
          </div>
        // </div>
      );
    } else if (this.state.showModal === true && contents === 'plantinfo'){
      return (
        <div className='modal-btn-container'>
          <button id={buttonId}>{buttonText}</button>
          {/* <div className='modal-bg-overlay'> */}
          <div className='modal'>
            <button
              className='info-modal-buttons'
              onClick={() => {
                this.toggleModal()
                resetPlantState();
              }}
            >x</button>
            <PlantInfo 
              toggleModal={this.toggleModal}
              editPlant={editPlant}
              focusedPlantState={focusedPlantState}
              genericPlantState={genericPlantState}
              savePlantEdits={savePlantEdits}
              setTextfieldState={setTextfieldState}
              setScheduleState={setScheduleState}
              setMistState={setMistState}
            />
          </div>
        </div>
      )
    };


  }  
  };


export default PlantModal;