import React, {useState, useEffect, useMemo, useRef} from 'react';

import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  KeyboardSensor, 
  PointerSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Plant from './Plant';
import NewPlant from './NewPlant'
import Shelf from './Shelf';


function usePrevious(value) {
  const ref = useRef([]);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function PlantView({ waterPlant }) {
  
  const [ showModal, setShowModal ] = useState(false);
  const [ currSortId, setCurrSortId ] = useState(0);
  
  
  const [ plants, setPlants ] = useState([])
  const [ plantInfo, setPlantInfo ] = useState({
    plantSpecies: '',
    name: '',
    light: '',
    soil: '',
    fertilizer: '',
    notes: '',
  });
  const [ plantImg, setPlantImg ] = useState({}); 
  const [ wateringSched, setWateringSched ] = useState({
    days: 0,
    weeks: 0, 
    months: 0,
  });

  const [ wateringTime, setWateringTime ] = useState({
    unselected_tod: true,
    morning: false,
    midday: false,
    evening: false,
  });
  const [ fertilizeSched, setFertilizeSched ] = useState({
    days: 0,
    weeks: 0, 
    months: 0,
  });
  const [ fertilizeTime, setFertilizeTime ] = useState({
    unselected_tod: true,
    morning: false,
    midday: false,
    evening: false
  });
  const [ mist, setMist ] = useState(false);
  const [ initialWaterDate, setInitialWaterDate ] = useState(null);
  const [ nextWaterDate, setNextWaterDate ] = useState(null);
  const [ initialFertilizeDate, setInitialFertilizeDate ] = useState(null);
  const [ nextFertilizeDate, setNextFertilizeDate ] = useState(null);
  const [ plantImgData, setPlantImgData ] = useState([]);
  const [ newPlantIcon, setNewPlantIcon ] = useState('');
  const sortIds = useMemo(() => plants.map((plant) => plant.sortId), [plants]);

  useEffect(() => {
    getPlants();
  }, []);

  useEffect(() => {
    setScheduleTime();
  }, [wateringSched, fertilizeSched]);

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // RESET STATE
  function resetPlantState() {
    setPlantInfo({
      plantSpecies: '',
      name: '',
      light: '',
      soil: '',
      fertilizer: '',
      notes: '',
    });
    setPlantImg({});
    setMist(false);
    setWateringSched({
      days: 0,
      weeks: 0, 
      months: 0,
    });
    setWateringTime({
      unselectedTime: true,
      morning: false,
      midday: false,
      evening: false
    });
    setFertilizeSched({
      days: 0,
      weeks: 0, 
      months: 0,
    });

    setFertilizeTime({
      unselected_Time: true,
      morning: false,
      midday: false,
      evening: false
    });
  };

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  /*
  =================
    GET ALL PLANTS 
  =================
  */

  useEffect(() => {
    setCurrSortId( sortIds.length > 0 ? Math.max(...sortIds) : 0 );
    console.log(sortIds);
  }, [sortIds]);

  useEffect(() => {
    getNewPlantIcon();
  }, []);

  async function getPlants() {
    try {
      const response = await fetch('/plants');
      const plants = await response.json();
      const sortedPlants = plants.sort((a, b) => a.sortId < b.sortId ? -1 : 1);
      console.log(sortedPlants)
      setPlants(sortedPlants);
    } catch (err) {
      console.log(err);
    };
  };


    /*
  ================
    GET ALL SVGS
  ================
  */

  async function getAllPlantImgData() {
    try {
      const response = await fetch('/images/plantSvgs');
      const plantImgData = await response.json();
      setPlantImgData(plantImgData)
    } catch (err) {
      console.log(err)
    }
  }

  /*
  =========================
    GET NEW PLANT SVG ICON
  =========================
  */

  async function getNewPlantIcon() {
    try {
      const response = await fetch('/images/newPlantIcon');
      const icon = await response.json();
      setNewPlantIcon(icon[0]);
    } catch(err) {
      console.log(err);
    }
  }

  /*
  =============
    ADD PLANT
  =============
  */
  async function submitPlant() {
    await createDatesFromSchedule(wateringSched, 'water');
    await createDatesFromSchedule(fertilizeSched, 'fertilize');
    const body = {
      ...plantInfo,
      ...plantImg,
      sortId: currSortId + 1,
      mist,
      wateringSched,
      wateringTime,
      initialWaterDate,
      nextWaterDate,
      fertilizeSched,
      fertilizeTime,
      initialFertilizeDate,
      nextFertilizeDate,
    };

    try {
      const plantTableResponse = await fetch('/plants', {
        method: 'POST', 
        headers: {
          'Content-Type': 'Application/JSON'
        },
        // send the values from new plant in state to the db. 
        body: JSON.stringify(body)
      });
      // wait for the okay from the db.
      const plant = await plantTableResponse.json();
      const { plant_id } = plant;
      const {
        plantSpecies,
        plantSvgSrc
      } = plantImg;
      setPlants(prevState => {
        return [...prevState, 
          {
            ...plantInfo,
            plantSpecies,
            img: plantSvgSrc,
            plantId: plant_id, 
            sortId: currSortId + 1,
            mist,
            wateringSched,
            wateringTime,
            initialWaterDate,
            nextWaterDate,
            fertilizeSched,
            fertilizeTime,
            initialFertilizeDate,
            nextFertilizeDate,
          }
        ]
      });
      return;
    } catch (err) {
      console.log(err);
    };
  };

  function copyPlantStateForEditing(plant) {
    setPlantInfo(plant);      
  }

  /*
  ===========
    UPDATE
  ===========
  */
  async function submitPlantEdit () {
    const {
      plantSpecies,
      name,
      img,
      light,
      soil,
      fertilizer,
      notes
    } = plantInfo;
    await createDatesFromSchedule(wateringSched, 'water');
    await createDatesFromSchedule(fertilizeSched, 'fertilize');
    const body = {
      plantSpecies,
      name,
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      mist,
      wateringSched,
      wateringTime,
      initialWaterDate,
      nextWaterDate,
      fertilizeSched,
      fertilizeTime,
      initialFertilizeDate,
      nextFertilizeDate,
    };
    try {
      const response = await fetch(`/plants/${plantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'Application/JSON'
        },
        body: JSON.stringify(body)
      });
      const dbResponseOk = await response.json();
      const editedPlant = { plantId: plantId, ...plantInfo};
      setCurrSortId(prevState => prevState + 1);
      setPlants(prevState => plants.map((plant, index) => plant.plantId === plantId ? plants[index] = editedPlant : plant));
    } catch (err) {
      console.log(err);
    };
  };

  /*
  ===========
    DELETE
  ===========
  */
  async function deletePlant (plantId) {
    try {
      const response = await fetch(`/plants/${plantId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'Application/JSON'
        },
      });
      const dbResponseOk = await response.json();      
      setPlants(plants.filter(plant => plant.plantId !== plantId));
    } catch (err) {
      console.log(err);
    }
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  /*
  ====================================
    SCHEDULE STATE MANAGEMENT
  ====================================
  */

  function createDatesFromSchedule(scheduleObj, typeOfScheduledDate, caredForPlant=false) {
    // if the schedule hasn't been set, don't create any dates.
    if (Object.values(scheduleObj).every(value => !value)) return;
    const times = scheduleObj === wateringSched ? wateringTime : fertilizeTime;
    const scheduledTime = Object.entries(times).filter(entry => entry[1])[0][0];
    // schedule interval in days
    let intervalInDays = 0;
    // iterate through schedule dropDown
    for (const interval in scheduleObj) {
      // convert all values to days and add to intervalInDays
        if (interval === 'days') intervalInDays += 1 * scheduleObj[interval];
        if (interval === 'weeks') intervalInDays += 7 * scheduleObj[interval]; 
      };

    // set a new initial date if one hasn't been set, or the plant has been cared for. Otherwise, keep the old initial date.
    const initialDate = typeOfScheduledDate === 'water' ? initialWaterDate : initialFertilizeDate;
    const setInitialDate = typeOfScheduledDate === 'water' ? setInitialWaterDate : setInitialFertilizeDate;
    const setNextDate = typeOfScheduledDate === 'water' ? setNextWaterDate : setNextFertilizeDate;
    const initialDateUpdated = !initialDate || caredForPlant ? new Date() : initialDate;
    // clone the initial date as the basis for the schedule
    const nextScheduledDate = new Date(initialDateUpdated.valueOf());
    // get the scheduled time in hours from midnight of the current day.
    const timeOfDay = nextScheduledDate === 'morning' ? 6 : scheduledTime === 'midday' ? 12 : 18;
    // mutate scheduledDate
    nextScheduledDate.setDate(nextScheduledDate.getDate() + intervalInDays);
    nextScheduledDate.setHours(timeOfDay);
    nextScheduledDate.setMinutes(0);
    nextScheduledDate.setSeconds(0);
    
    // set nextScheduledDate state
    setInitialDate(initialDate);
    setNextDate(nextScheduledDate)
    return nextScheduledDate;
  }

  function setScheduleTime(scheduleType, value, scheduleCleared=false) {
    
    const setTimeToMorning = (scheduledTimes) => {
      if (scheduledTimes.unselected_time === true) {
        setTime((prevState) => {
          return({
            ...prevState,
            unselected_time: false, 
            morning: true
          });
        });
      };
      return;
    };

    const clearTime = () => {
      setTime((prevState) => {
        return({
          ...prevState, 
          unselected_time: true, 
          morning: false,
          midday: false,
          evening: false
        });
      });
      return;
    }

    const schedule = scheduleType === 'watering' ? wateringSched : fertilizeSched;
    const scheduleHasBeenSet = schedule.days || schedule.weeks || schedule.months;
    const scheduledTimes = scheduleType === 'watering' ? wateringTime : fertilizeTime;
    const setTime = scheduleType === 'watering' ? setWateringTime : setFertilizeTime;
    if (scheduleCleared) {
      clearTime();
      return;
    };
    if (!scheduleHasBeenSet) {
      setTimeToMorning(scheduledTimes);
      return;
    };
    // iterate through times, if the properties value equals the passed in value, set it to true. 
    for (const time in scheduledTimes) {
      if (scheduledTime[time] === value) {
        setTime(prevState => {
          return ({
            ...prevState,
            [value]: true
          });
        });
        // otherwise set it to false.
      } else {
        setTime(prevState => {
          return ({
            ...prevState,
            time: false
          });
        });
      };
    };
    return;
  };

  function setSchedule(scheduleType, unit, value, scheduleCleared=false) {
    const schedule = scheduleType === 'watering' ? wateringSched : fertilizeSched;
    const setWaterOrFertSchedule = scheduleType === 'watering' ? setWateringSched : setFertilizeSched;
    if (scheduleCleared) {
      clearSchedule();
      return;
    }
    for (const property in schedule) {
      if (property === unit) {
        setWaterOrFertSchedule(prevState => {
          return({
            ...prevState,
            [unit]: value,
          });
        });
      } else {
        setWaterOrFertSchedule(prevState => {
          return({
            ...prevState,
            [property]: 0
          });
        });
      };
    }       
      const clearSchedule = () => {
        setWaterOrFertSchedule((prevState) => {
          return({
            ...prevState,
            unselected_Time: true,
            morning: false,
            midday: false,
            evening: false
          })
        })
      }
      return;
    };

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  /*
  ==============================================================
    DND-KIT API
  ==============================================================
  */
  
  // not part of API, just what is this tho lol.
  // DND-kit sort id's don't change, only their sort order. 
  // However, to update the sort order in the database, the sort id are converted to the index at which they occur.
  // for example, if plant 1 is in position 4, its sort id will change to four, in position 1. eg [2, 3, 4, 1] -> [4, 1, 2, 3].
  // In the controller, these are then used to update the sortIds on each plant, in order of plant Id.
  // then when the plants and their sort ids are retrieved from the database, the sort ids initialize once again
  // sorted from least to greatest. so whatever plant is in position 1 will have a sort id of 1, etc. eg [4, 1, 2, 3] -> [1, 2, 3, 4]
  // this method is really confusing, because the sort ids are always changing, even though dnd-kit doesn't require them to change.
  // to make this clearer, it might be better to simply store the sortIds and their current order as a seperate table 
  // rather than recalculating them for each plant in the plants table as the sort order changes. (see the updateSortOrder controller)
  function getSortOrder () {
    const sortOrder = [];
    let sortId = 0;
    for (let i = 0; i < plants.length; i++) {  
      sortId++;
      for (let j = 0; j < plants.length; j++) {
        if (plants[j].sortId === sortId) {
          sortOrder.push(j + 1);    
        };
      };
    };
    return sortOrder;
  }

  useEffect(() => {
    sendNewCoordsToDb();
  }, [sortIds]);

  const prevSortOrder = usePrevious(getSortOrder());
  async function sendNewCoordsToDb() {
    const nextSortOrder = getSortOrder();
    if (prevSortOrder.length === 0 || nextSortOrder.length === 0) return;


    const body = {
      prevSortOrder,
      nextSortOrder,
    };
    try {
      const response = await fetch('/plants', { 
      method: 'PATCH',
      headers: {
        'Content-type' :'Application/JSON'
      },
      body: JSON.stringify(body)
      })
      const dbResponseOk = await response.json();
      // console.log(dbResponseOk)
    } catch (err) {
      console.log(err);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setPlants(plants => {
        const oldIndex = plants.findIndex((plant) => plant.sortId === active.id);
        const newIndex = plants.findIndex((plant) => plant.sortId === over.id);
        return arrayMove(plants, oldIndex, newIndex);
      });
    };
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  /* 
  ==============================================================
    Render plants components
  ============================================================== 
  */

  function viewPlants() {
    return plants.map((plant, index) => {
      return (
        <Plant 
          key={plant.sortId}
          sortId={plant.sortId}
          // properties
          thisPlantsInfo={plant}
          modalState={showModal}
          // methods
          setPlantInfo={setPlantInfo}
          plantInfo={plantInfo}
          plantImg={plant.img}
          wateringSched={wateringSched}
          wateringTime={wateringTime}
          fertilizeSched={fertilizeSched}
          fertilizeTime={fertilizeTime}
          setSchedule={setSchedule}
          setScheduleTime={setScheduleTime}
          createDatesFromSchedule={createDatesFromSchedule}
          setMist={setMist}
          resetPlantState={resetPlantState}
          submitPlantEdit={submitPlantEdit}
          copyPlantStateForEditing={copyPlantStateForEditing}
          deletePlant={deletePlant}
          waterPlant={waterPlant}
        /> 
     );
    });
  };
  return (
        <div className="plants">
          <NewPlant 
            id="new-plant"
            // rest api
            submitPlant={submitPlant}
            getAllPlantImgData={getAllPlantImgData}
            // all plant img data
            plantImgData={plantImgData}
            // new plant icon data
            newPlantIcon={newPlantIcon}
            // state, state hooks and related functions.
            plantInfo={plantInfo}
            setPlantInfo={setPlantInfo}
            setPlantImg={setPlantImg}
            wateringSched={wateringSched}
            wateringTime={wateringTime}
            initialWaterDate={initialWaterDate}
            nextWaterDate={nextWaterDate}
            fertilizeSched={fertilizeSched}
            fertilizeTime={fertilizeTime}
            initialFertilizeDate={initialFertilizeDate}
            nextFertilizeDate={nextFertilizeDate}
            setSchedule={setSchedule}
            setScheduleTime={setScheduleTime}
            setMist={setMist}
            mist={mist}
            resetPlantState={resetPlantState}      
          />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortIds} 
              strategy={rectSortingStrategy}
            >
              {viewPlants()}
            </SortableContext>
          </DndContext>
          <Shelf plants={[...plants, 'newPlant']}/>
        </div>

  )
}

export default PlantView;