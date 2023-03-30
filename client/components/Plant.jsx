
import React, { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PlantModal from './PlantModal';
import PlantForm from './PlantForm';
import PlantInfo from './PlantInfo';
import '../../src/styles.css';

export default function Plant({
    sortId,
    thisPlantsInfo,
    modalState,
    setPlantInfo,
    plantInfo,
    plantImg,
    wateringSched,
    wateringTime,
    fertilizeSched,
    fertilizeTime,
    setSchedule,
    setScheduleTime,
    createDatesFromSchedule,
    setMist,
    resetPlantState,
    submitPlant,
    copyPlantStateForEditing,
    submitPlantEdit,
    deletePlant,
    waterPlant, 
    
    
    
  }) {
  // dnd-kit
  const { 
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: sortId});
  // state
  const [ showModal, setShowModal ] = useState(false);
  const [ editPlant, setEditPlant ] = useState(false);
  const [ showInfo, setShowInfo ] = useState(true);
  const [ waterMeter, setWaterMeter ] = useState(100);
  const [ waterPlantIndicator, setWaterPlantIndicator ] = useState(false);
  const [ fertilizePlantIndicator, setfertilizePlantIndicator ] = useState(false);

  // functions
  function handleShowModal() {
    setShowModal(showModal === false ? true : false);
  }

  function handleShowInputForm() {
    setEditPlant(editPlant === false ? true : false);
  }

  function handleShowInfo() {
    setShowInfo(showInfo === false ? true : false)
  }

  // useEffect(() => {
  //   makeMeter();
  //   const interval = setInterval(() => { 
  //     makeMeter();
  //   }, 3000);
    
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, []);
  function makeMeter() {
    const initialDateMs = new Date(initialWaterDate).getTime();
    const currentDateMs = new Date().getTime();
    const scheduledDateMs = new Date(nextWaterDate).getTime();
    // Thu Feb 09 2023 17:03:32 GMT-0800 (Pacific Standard Time) 
    //  Wed Dec 31 1969 16:00:00 GMT-0800 (Pacific Standard Time)
    // if scheduled watering_schedule is less than current watering_schedule, {css logic} (for now just console log that plant needs watering or fertilizing)
    // display the fraction of the time that has elapsed between the initial date and the scheduled date as a percentage between 0 and 100 percent. 
    const percentage = Math.round((1 / ((scheduledDateMs - initialDateMs) / (currentDateMs - initialDateMs))) * 100)
    const result = initialDateMs <= scheduledDateMs && nextWaterDate ? percentage : console.log('plant needs watering!');
    setWaterMeter(percentage);
    setWaterPlantIndicator(prev => {
      return percentage < 100 || !nextWaterDate ? false : true;
    });
    return;
  };
    // scheduleObj, typeOfScheduledDate, typeOfInitialDate, caredForPlant=false
    async function careForPlant() {
      if (waterPlant) {
        await copyPlantStateForEditing(thisPlantsInfo);
        await createDatesFromSchedule(wateringSchedule, 'water', true)
        await submitPlant();
        await makeMeter(); // not working yet
      };
    };

    const dragStyle = { 
    transform: CSS.Transform.toString(transform),
    transition,
  }
    // console.log(plantImg)
    return (
      <div>
        <div 
          className='plant'
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={
          {transform: CSS.Transform.toString(transform),
          transition,}}
          onClick={() => careForPlant()}
        > 
        <img  
          width='100' 
          height='100'
          src={plantImg} 
          alt='plant'
        />
        <button 
          id='delete-plant-btn' 
          className='plant-btns'
          style={{"--button-color": waterPlantIndicator === true ? "#61464d" : "#c1c1c1"}} 
          onClick={() => deletePlant(thisPlantsInfo.plantId)}>x
        </button> 
        <button 
          id="plant-info-btn" 
          className="plant-btns" 
          onClick={() => {
            handleShowModal();
            copyPlantStateForEditing(thisPlantsInfo);
          }}>Info
        </button>
        <div className = "water-meter" style={{"--water-meter-height" : `${waterMeter}%`}}/>
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
      {/* sortId,
    thisPlantsInfo,
    modalState,
    setPlantInfo,
    setSchedule,
    setScheduleTime,
    createDatesFromSchedule,
    setMist,
    resetPlantState,
    submitPlant,
    copyPlantStateForEditing,
    submitPlantEdit,
    deletePlant,
    waterPlant, */}
    {
      editPlant && <PlantForm 
        plantInfo={plantInfo}
        wateringSched={wateringSched}
        wateringTime={wateringTime}
        fertilizeSched={fertilizeSched}
        fertilizeTime={fertilizeTime}
        setPlantInfo={setPlantInfo}
        setSchedule={setSchedule}
        setScheduleTime={setScheduleTime}
        createDatesFromSchedule={createDatesFromSchedule}
        setMist={setMist}
        submitPlant={submitPlant}
        resetPlantState={resetPlantState}
        handleShowModal={handleShowModal}   
        /> 
        || 
    // show plant info
      showInfo && <PlantInfo 
        thisPlantsInfo={thisPlantsInfo}
        submitPlantEdit={submitPlantEdit}
        setPlantInfo={setPlantInfo}
        setSchedule={setSchedule}
        setScheduleTime={setScheduleTime}
        setMist={setMist}
    />}  
      </PlantModal>}
      
      </div>
      )
    }
