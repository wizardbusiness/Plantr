import React, {Component} from 'react';
import PlantModal from './PlantModal';

class NewPlant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
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
      plantState,
      resetPlantState,
      submitPlant,
      setTextfieldState,
      setScheduleState,
      setTimeOfDayState,
      setMistState
    } = this.props;
    return(
      <div>
        <button id="new-plant" onClick={() => this.handleShowModal()}>+</button>
        {this.state.showModal &&
          <PlantModal
            resetPlantState={resetPlantState}
            handleShowModal={this.handleShowModal}
            showModal={this.state.showModal}
            formName='addPlant'
            btnText='Add Plant' 
            submitPlant={submitPlant}
            setTextfieldState={setTextfieldState}
            setScheduleState={setScheduleState}
            setTimeOfDayState={setTimeOfDayState}
            setMistState={setMistState}
            plantState={plantState}
          />
        }
      </div>
    )
  }
 }

export default NewPlant;
