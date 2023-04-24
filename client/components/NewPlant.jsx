import React, {useState, useEffect} from 'react';
import PlantModal from './PlantModal';
import PlantForm from './PlantForm';

function useWindowWidth() {
  const [ windowWidth, setWindowWidth ] = useState(undefined);
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize)
    handleResize();
    return (() => window.removeEventListener('resize', handleResize))
  }, []);
 return windowWidth;
}

function NewPlant({
  submitPlant,
  getAllPlantImgData,
  plantInfo,
  setPlantInfo,
  wateringSched,
  wateringTime,
  fertilizeSched,
  fertilizeTime,
  setSchedule,
  setScheduleTime,
  mist,
  setMist,
  resetPlantState,   
  plantImgData,
  newPlantIcon,
  setPlantImg
  }) {

    const [ showModal, setShowModal ] = useState(false);
    const [ showInputForm, setShowInputForm ] = useState(true);
    const windowWidth = useWindowWidth();
    console.log(windowWidth)
  function handleShowModal() {
    setShowModal(prevState => prevState === true ? false : true);
  }
    return(
      <>
        <img 
          id='new-plant'
          src={newPlantIcon}
          onClick={() => {
            handleShowModal();
            getAllPlantImgData();
          }}
        />
        {showModal &&
          <PlantModal
            resetPlantState={resetPlantState}
            handleShowModal={handleShowModal}
            showModal={showModal}
            showInputForm={showInputForm}
          >
            <PlantForm 
                showModal={showModal}
                windowWidth={windowWidth}
                handleShowModal={handleShowModal}
                submitPlant={submitPlant}
                plantInfo={plantInfo}
                setPlantInfo={setPlantInfo}
                wateringSched={wateringSched}
                wateringTime={wateringTime}
                fertilizeSched={fertilizeSched}
                fertilizeTime={fertilizeTime}
                setSchedule={setSchedule}
                setScheduleTime={setScheduleTime}
                mist={mist}
                setMist={setMist}
                resetPlantState={resetPlantState}  
                plantImgData={plantImgData}  
                setPlantImg={setPlantImg}
            />
          </PlantModal>
        }
      </>
  );
}
 

export default NewPlant;
