import React, {Component} from 'react';
import PlantModal from './PlantModal';
import PlantForm from './PlantForm';

class NewPlant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      showInputForm: true
    }
    this.handleShowModal = this.handleShowModal.bind(this);
  }
  handleShowModal() {
    this.setState({
      ...this.state,
      showModal: this.state.showModal === true ? false : true
    });
  }
  render() {
    const {
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
      resetPlantState
    } = this.props;

    return(
      <div>
        <button id="new-plant" onClick={() => this.handleShowModal()}>+</button>
        {this.state.showModal &&
          <PlantModal
            resetPlantState={resetPlantState}
            handleShowModal={this.handleShowModal}
            showModal={this.state.showModal}
            showInputForm={this.state.showInputForm}
          >
            <PlantForm 
                showModal={this.state.showModal}
                handleShowModal={this.handleShowModal}
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
            />
          </PlantModal>
        }
      </div>
    )
  }
 }

export default NewPlant;
