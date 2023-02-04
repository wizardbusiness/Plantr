import React, {Component} from 'react';
import PlantForm from './PlantForm';
import PlantInfo from './PlantInfo';

class PlantModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editPlant: false,
    }
    this.handleEditPlant = this.handleEditPlant.bind(this);
  }



  handleEditPlant() {
    this.setState({
      ...this.state,
      editPlant: this.state.editPlant === true ? false : true
    })
  }
  
  render() {
    const {
      formName,
      handleShowModal,
      resetPlantState, 
      plantState,
      submitPlant,
      setTextfieldState,
      setScheduleState,
      setTimeOfDayState,
      setMistState,
      // plant info
      editPlant,
      focusedPlantState,
      genericPlantState,
      savePlantEdits,
    } = this.props;
    console.log(formName)
    if (this.state.editPlant || formName === 'addPlant') {
      return (
          <div className="modal-bg-overlay">
            <div className="modal">
              <button
                className="plant-btns"
                onClick={() => {
                  handleShowModal();
                  resetPlantState();
                }}
              >x</button>
              <PlantForm 
                formName="addplant"
                btnText="Add Plant"
                handleShowModal={handleShowModal}
                submitPlant={submitPlant}
                setTextfieldState={setTextfieldState}
                setScheduleState={setScheduleState}
                setTimeOfDayState={setTimeOfDayState}
                setMistState={setMistState}
                plantState={plantState}
              />
            </div>
          </div>
      );
    } else {
      return (
          <div className="modal-bg-overlay">
          <div className="modal">
            <div className="modal-btns-container">
              <button id='edit-plant-btn' className="modal-btns" onClick={() => this.handleEditPlant()}>Edit Info</button>
              <button
                className="modal-btns"
                id="exit-modal-btn"
                onClick={() => {
                  handleShowModal();
                  resetPlantState();
                }}
              >x</button>
            </div>
            <PlantInfo 
              handleShowModal={handleShowModal}
              editPlant={editPlant}
              focusedPlantState={focusedPlantState}
              genericPlantState={genericPlantState}
              savePlantEdits={savePlantEdits}
              setTextfieldState={setTextfieldState}
              setScheduleState={setScheduleState}
              setTimeOfDayState={setTimeOfDayState}
              setMistState={setMistState}
            />
          </div>
          </div>
      )
    };


  }  
  };


export default PlantModal;