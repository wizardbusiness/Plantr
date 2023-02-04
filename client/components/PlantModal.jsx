import React, {Component} from 'react';
import PlantForm from './PlantForm';
import PlantInfo from './PlantInfo';

class PlantModal extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    const {
      handleShowModal,
      resetPlantState,
      showInputForm,
      handleShowInputForm, 
      showInfo,
      handleShowInfo,
      children,
    } = this.props;
      return (
        <div className="modal-bg-overlay">
        {(showInfo && <div className="modal">
            <div className="modal-btns-container">
              <button 
                id='edit-plant-btn' 
                className="modal-btns" 
                onClick={() => {
                  handleShowInfo()
                  handleShowInputForm()
                }}
              >Edit Info</button>
              <button
                className="modal-btns"
                id="exit-modal-btn"
                onClick={() => {
                  handleShowModal();
                }}
              >x</button>
              {children}
            </div>
          </div>) || 
          (showInputForm && 
          <div className="modal">
            <button
              className="plant-btns"
              onClick={() => {
                handleShowInfo();
                handleShowModal();
                resetPlantState();
                handleShowInputForm();
              }}
            >x</button>
            {children}
          </div>)
        }
      </div>
    );
  };
};

export default PlantModal;