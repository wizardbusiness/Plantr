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
import TestPlant from './TestPlant'
import NewPlant from './NewPlant'
import PlantInfo from './PlantInfo';

function usePrevious(value) {
  const ref = useRef([]);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function PlantView({ waterPlant }) {
  
  const [showModal, setShowModal] = useState(false);
  const [currSortId, setCurrSortId] = useState([]);
  
  
  const [plants, setPlants] = useState([])
  const [plantInfo, setPlantInfo] = useState({
    plant_species: '',
    name: '',
    img: '',
    light: '',
    soil: '',
    fertilizer: '',
    notes: '',
  });
  const [wateringSched, setWateringSched] = useState({
    days: 0,
    weeks: 0, 
    months: 0,
  });
  const [wateringTime, setWateringTime] = useState({
    unselected_tod: true,
    morning: false,
    midday: false,
    evening: false,
  });
  const [fertilizeSched, setFertilizeSched] = useState({
    days: 0,
    weeks: 0, 
    months: 0,
  });
  const [fertilizeTime, setFertilizeTime] = useState({
    unselected_tod: true,
    morning: false,
    midday: false,
    evening: false
  });
  const [mist, setMist] = useState(false);
  const [initialWaterDate, setInitialWaterDate] = useState(null);
  const [nextWaterDate, setNextWaterDate] = useState(null);
  const [initialFertilizeDate, setInitialFertilizeDate] = useState(null);
  const [nextFertilizeDate, setNextFertilizeDate] = useState(null);
  const sortIds = useMemo(() => plants.map((plant) => plant.sortId), [plants]);
  
  useEffect(() => {
    getPlants();
  }, [])

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // RESET STATE
  function resetPlantState() {
    setPlantInfo({
      plantSpecies: '',
      name: '',
      img: '',
      light: '',
      soil: '',
      fertilizer: '',
      notes: '',
    });
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
  ====================================
    SCHEDULE STATE MANAGEMENT
  ====================================
  */

  useEffect(() => {
    setScheduleTime();
  }, [wateringSched, fertilizeSched]);

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
    setInitialDate(nextScheduledDate);
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


  function setTextfieldState(name, value) {
    setPlantInfo(prevState => {
      return({
        ...prevState,
      [name]: value
      });
    });
  }

  function setMistState() {
    mist === false ? setMist(true) : setMist(false);
  }
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  /*
  ===========
    GET ALL 
  ===========
  */
  async function getPlants() {
    try {
      const response = await fetch('/plants');
      const plants = await response.json();
      const currSortId = sortIds.length ? Math.max(...sortIds) : 0;
      setCurrSortId(currSortId + 1);
      const sortedPlants = plants.sort((a, b) => a.sortId < b.sortId ? -1 : 1)
      setPlants(sortedPlants);
    } catch (err) {
      console.log(err);
    };
  };

  /*
  ===========
    ADD
  ===========
  */
  async function submitPlant() {
    const {
      plant_species,
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
      currSortId,
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
      const { plantId } = plant;
      // after okay from database, use local state to add plant to plants. It's faster than sending the response body
      setCurrSortId(prevState => prevState + 1);
      setPlants(prevState => [...prevState, {...plant, plantId}]);
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
      plant_species,
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
      currSortId,
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
      const response = await fetch(`/plants/${plant_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'Application/JSON'
        },
        body: JSON.stringify(body)
      });
      const dbResponseOk = await response.json();
      const editedPlant = { plant_id: plant_id, ...plantInfo};
      setCurrSortId(prevState => prevState + 1);
      setPlants(prevState => plants.map((plant, index) => plant.plant_id === plant_id ? plants[index] = editedPlant : plant));
    } catch (err) {
      console.log(err);
    };
  };

  /*
  ===========
    DELETE
  ===========
  */
  async function deletePlant (plant_id) {
    try {
      const response = await fetch(`/plants/${plant_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'Application/JSON'
        },
      });
      const dbResponseOk = await response.json();      
      setPlants(plants.filter(plant => plant.plant_id !== plant_id));
    } catch (err) {
      console.log(err);
    }
  }

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
  // then when the plants and their sort ids are retrieved from the database, the sort ids initialize once again
  // sorted from least to greatest. so whatever plant is in position 1 will have a sort id of 1, etc. eg [4, 1, 2, 3] -> [1, 2, 3, 4]
  // this method is really confusing, because the sort ids are always changing, even though dnd-kit doesn't require them to change.
  // to make this clearer, it would be better to simply store the sortIds in their current order as an array directly, 
  // rather than recalculating them in the database each time the sort order changes. 
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
    console.log(sortIds)
    sendNewCoordsToDb();
  }, [sortIds]);

  const prevSortOrder = usePrevious(getSortOrder());
  async function sendNewCoordsToDb() {
    const nextSortOrder = getSortOrder();
    if (prevSortOrder.length === 0 || nextSortOrder.length === 0) return;
    console.log('prev')
    console.log(prevSortOrder)
    console.log('next')
    console.log(nextSortOrder)


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
    useSensor(PointerSensor),
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
    return plants.map((plant) => {
      return (
        <Plant 
          key={plant.sortId}
          sortId={plant.sortId}
          // plant properties
          focusedPlantState={plant}
          plantInfo={plant}
          modalState={showModal}
          // plant methods
          setTextfieldState={setTextfieldState}
          setSchedule={setSchedule}
          setScheduleTime={setScheduleTime}
          createDatesFromSchedule={createDatesFromSchedule}
          setMist={setMist}
          resetPlantState={resetPlantState}
          submitPlantEdit={submitPlantEdit}
          deletePlant={deletePlant}
          editedPlant={plant}
          waterPlant={waterPlant}
        /> 
     );
    });
  };

  return (
      <div className="planter-box">
        <div className="plants">
          <NewPlant id="new-plant"
            resetPlantState={resetPlantState}
            submitPlant={submitPlant}
            setTextfieldState={setTextfieldState}
            setSchedule={setSchedule}
            setTimeOfDayState={setScheduleTime}
            setMistState={setMist}
            mist={mist}
            wateringSched={wateringSched}
            fertilizeSched={fertilizeSched}
            plantInfo={plantInfo}
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
        </div>
      </div>   
  )
}

export default PlantView;