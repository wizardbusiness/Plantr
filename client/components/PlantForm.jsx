import React, {Component} from 'react';
import ScheduleDropdown from './ScheduleDropdown';
import TimeDropdown from './TimeDropDown';
import PickPlant from './PickPlant';
import MistCheckbox from './MistCheckbox';
import PlantFormField from './PlantFormField';

class PlantForm extends Component {
  constructor(props) {
    super(props)
    // field labels. Only for text input fields. 
    this.state = {
      name: 'Name:',
      light: 'Light:',
      soil: 'Soil:',
      fertilizer: 'Fertilizer:',
      notes: 'Notes:',
    };
    this.makeTextFields = this.makeTextFields.bind(this);
  }

  // make all input boxes with labels.
  makeTextFields() {
    const {plantInfo, setPlantInfo, windowWidth} = this.props
    const formFields = Object.values(this.state).map((entry, index) => {
      const key = `att${index}`;
      return(
        <PlantFormField
          id={`info-field-${index + 1}`}
          key={key}
          label={entry[1]}
          name={entry[0]}
          value={plantInfo[entry[0]]}
          setPlantInfo={setPlantInfo}
          windowWidth={windowWidth}
        />
      );
    });
    return formFields;
  }

  // render whole form, including dropdown and checkbox components. 
  render() {
    const {
      showModal,
      handleShowModal,
      submitPlant,
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
      setPlantImg
    } = this.props;
    const textFields = this.makeTextFields(); 
    return (
      <form 
        name='plantForm'
        onSubmit={(e) => {
          e.preventDefault();
          submitPlant();
          handleShowModal();
        }
        }>
        {/* <PickPlant plantImgData={plantImgData} setPlantImg={setPlantImg} />  */}
          {textFields}
        {/* <label>
          Watering Schedule:&nbsp;
        </label>
        <span>
            <label>
              Every&nbsp;
            </label> 
            <ScheduleDropdown
            setSchedule={setSchedule}
            scheduleType='watering'
            schedule={wateringSched}
            />
          <label>
            in the:&nbsp;
            <TimeDropdown 
              setScheduleTime={setScheduleTime}
              scheduleTimes={wateringTime}
              scheduleTimesType='watering'
              chosenTime={Object.entries(wateringTime).filter(entry => entry[1])[0][0]}
            />
          </label>
        </span>
        <label>
          Fertilizer Schedule:&nbsp;
        </label>
        <span>
          <label>
            Every&nbsp;
          </label>
          <ScheduleDropdown 
            setSchedule={setSchedule}
            scheduleType='fertilizer'
            schedule={fertilizeSched}
          />
        <label>
          in the:&nbsp;
          <TimeDropdown 
            setScheduleTime={setScheduleTime}
            scheduleTimes={fertilizeTime}
            scheduleTimesType='fertilizer'
            chosenTime={Object.entries(fertilizeTime).filter(entry => entry[1])[0][0]}
          />
        </label>
        </span>  
        <label>
          Mist:&nbsp;
          <MistCheckbox value={mist} setMistState={setMist}/>
        </label>
        <button id="submit-plant-btn" type="submit">Save Plant!</button> */}
      </form>
    );
  }
}

export default PlantForm;