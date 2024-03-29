
import React, { useEffect, useState } from 'react';
import PlantModal from './PlantModal';
import PlantForm from './PlantForm';
import PlantInfo from './PlantInfo';
import '../../src/styles.css';

export default function Plant(
  { 
    waterPlant, 
    createDatesFromSchedule,
    submitPlant,
    focusedPlantState,
    copyPlantStateForEditing,
    savePlantEdits,
    deletePlant,
    resetPlantState,
    setTextfieldState,
    setScheduleState,
    setTimeOfDayState,
    setMistState,
    genericPlantState
  }) {
  const [ state, setState ] = useState({
    showModal: false,
    editPlant: false,
    showInfo: true,
    waterMeter: 100,
    waterPlantIndicator: false,
    fertilizerMeter: null,
    fertilizePlantIndicator: false,
  })

  const [ showModal, setShowModal ] = useState(false);
  const [editPlant, setEditPlant ] = useState(false);
  const [showInfo, setShowInfo ] = useState(true);
  const [waterMeter, setWaterMeter ] = useState(100);
  const [waterPlantIndicator, setWaterPlantIndicator ] = useState(false);
  const [ fertilizePlantIndicator, setfertilizePlantIndicator ] = useState(false);

  function handleShowModal() {
    setShowModal(showModal === false ? true : false);
  }

  function handleShowInputForm() {
    setEditPlant(editPlant === false ? true : false);
  }

  function handleShowInfo() {
    setShowInfo(showInfo === false ? true : false)
  }

  useEffect(() => {
    makeMeter();
    const interval = setInterval(() => { 
      makeMeter();
    }, 3000);
    
    return () => {
      clearInterval(interval)
    }
  }, []);

  function makeMeter() {
    console.log(state)
    const initialDateMs = new Date(focusedPlantState.initial_water_date).getTime();
    const currentDateMs = new Date().getTime();
    const scheduledDateMs = new Date(focusedPlantState.next_water_date).getTime();
    // Thu Feb 09 2023 17:03:32 GMT-0800 (Pacific Standard Time) 
    //  Wed Dec 31 1969 16:00:00 GMT-0800 (Pacific Standard Time)
    // if scheduled watering_schedule is less than current watering_schedule, {css logic} (for now just console log that plant needs watering or fertilizing)
    // display the fraction of the time that has elapsed between the initial date and the scheduled date as a percentage between 0 and 100 percent. 
    const percentage = Math.round((1 / ((scheduledDateMs - initialDateMs) / (currentDateMs - initialDateMs))) * 100)
    const result = initialDateMs <= scheduledDateMs && focusedPlantState.next_water_date ? percentage : console.log('plant needs watering!');
    setState({
      ...state,
      waterMeter: percentage,
      waterPlantIndicator: percentage < 100 || !focusedPlantState.next_water_date ? state.waterPlantIndicator = false : true
    });
    setWaterMeter(percentage);
    setWaterPlantIndicator(prev => {
      return percentage < 100 || !focusedPlantState.next_water_date ? false : true;
    })
    return;
  };

    // scheduleObj, typeOfScheduledDate, typeOfInitialDate, caredForPlant=false
    async function careForPlant() {
      if (waterPlant) {
        await copyPlantStateForEditing(focusedPlantState);
        await createDatesFromSchedule(genericPlantState.watering_schedule, 'next_water_date', 'initial_water_date', true)
        await submitPlant();
        await makeMeter(); // not working yet
      };
    }

    return (
      <div>
        <div className="plant" 
          style={
          {"--bg-color" : waterPlantIndicator === true ? "#fa5c1e" : "#42d642"}}
          onClick={() => careForPlant()}
        >
        <button 
        id='delete-plant-btn' 
        className='plant-btns'
        style={{"--button-color": waterPlantIndicator === true ? "#61464d" : "#c1c1c1"}} 
        onClick={() => deletePlant(focusedPlantState.plant_id)}>x</button>
        <button 
          id="plant-info-btn" 
          className="plant-btns" 
          onClick={() => {
            handleShowModal();
            copyPlantStateForEditing(focusedPlantState);
          }}
          >Info</button>
        <div id="plant-species-name">{focusedPlantState.plant_species}</div>
        <div className = "water-meter" style={{"--water-meter-height" : `${state.waterMeter}%`}}/>
      </div>
      {/* show the modal */}
      {showModal && <PlantModal
        handleShowModal={handleShowModal}
        showInfo={showInfo}
        handleShowInfo={handleShowInfo}
        handleShowInputForm={handleShowInputForm}
        showInputForm={editPlant}
        resetPlantState={resetPlantState}
        >
          {/* modal contents */}
          {/* show edit form */}
          {editPlant && <PlantForm 
            setTextfieldState={setTextfieldState}
            setScheduleState={setScheduleState}
            setTimeOfDayState={setTimeOfDayState}
            setMistState={setMistState}
            submitPlant={submitPlant}
            handleShowModal={handleShowModal}
            plantState={genericPlantState}
          /> || 
          // show plant info
          showInfo && <PlantInfo 
              focusedPlantState={focusedPlantState}
              genericPlantState={genericPlantState}
              savePlantEdits={savePlantEdits}
              setTextfieldState={setTextfieldState}
              setScheduleState={setScheduleState}
              setTimeOfDayState={setTimeOfDayState}
              setMistState={setMistState}
            />
          }  
        </PlantModal>
        }
      </div>
      )
    }
