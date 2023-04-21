import React, {useState, useRef, useEffect, useMemo, useLayoutEffect} from 'react';


function PlantModal({
  handleShowModal,
  resetPlantState,
  showInputForm,
  handleShowInputForm, 
  showInfo,
  handleShowInfo,
  children
}){

  return (
    <>
      <div className="modal-bg-overlay"/>
        <div className='modal'>
          <div className='journal'>
            <div id='journal-page'>
              {(showInfo && 
              <div className="journal-page-contents">
                <div className="modal-btns-container">
                  <button 
                    id='edit-plant-info-btn' 
                    className="modal-btns" 
                    onClick={() => {
                      handleShowInfo()
                      handleShowInputForm()
                    }}
                    // edit plant
                  >Edit</button>
                  <button
                    className="modal-btns exit-modal-btn "
                    onClick={() => {
                      handleShowModal();
                    }}
                    >x</button>
                </div>
                {children}
              </div>) 
              || 
              (showInputForm && <div className="journal-page-contents">  
                <button
                  className="modal-btns exit-modal-btn"
                  onClick={() => {
                    if (handleShowInfo) handleShowInfo();
                    if (handleShowInputForm) handleShowInputForm(); 
                    handleShowModal();
                    resetPlantState()
                  }}>x
                </button>
                {children}
              </div>
              )
            }
          </div>
        </div>  
      </div>   
    </>
  );
};

export default PlantModal;