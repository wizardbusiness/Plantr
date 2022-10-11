import React, { Component } from 'react';
import PlantInfo from './PlantInfo';

class PlantDetailsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plantId: 0,
      show: false
    }
    this.getPlantInfo = this.getPlantInfo.bind(this);
  }
  // inputs: unique id, event info 
  // output: modal with info from database
  
  // gets info for plant that was clicked. 
  // input: plant id

  toggleModal() {
    this.setState({
      plantId: id,
      modal: this.state.modal === false ? this.state.modal = false : this.state.modal = false
    })
  }

  async getPlantInfo (id) {

    try {
      const response = await fetch(`plants/${id}`);
      const allInfo = await response.json();
      const neededInfo = Object.values(allInfo[0]).slice(1);
      console.log(neededInfo)
      const labels = [' Plant Name', ' Water Frequency', ' Fertilize Frequency', ' Light Preference', ' Soil Preference', ' Fertilizer Preference', ' Notes'];
      labels.map((label, index) => {
        return <PlantInfo show={this.state.show} label={labels[index]} plantInfo={neededInfo} />
      })
    } catch (err) {
      console.log(err);
    }
  }
  // render each component with this modal
  // on click, check the element being clicked against the plant id in the database. 
  // retrieve info for that plant, and display inside the modal. 
  render() {
    const plantInfo = this.getPlantInfo(this.props.id);
    return (
      <article>
        <button onClick={() => this.toggleModal()}>Info</button>
        <div>{plantInfo}</div>
      </article>
    )
  }
}

export default PlantDetailsModal;