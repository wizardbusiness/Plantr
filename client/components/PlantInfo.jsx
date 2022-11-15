import React, { Component } from 'react';
import PlantDetail from './PlantDetail';
import EditPlantForm from './EditPlantForm';

class PlantInfo extends Component {
  constructor({
    index,
    plantInfo,
    editedPlant,
    clonePlant,
    editPlant,
    savePlantEdits,
    modalVisible,
    toggle
  }) {
    super(
      index,
      plantInfo,
      editedPlant,
      clonePlant,
      editPlant,
      savePlantEdits,
      modalVisible,
      toggle
    ); 

    this.state = {
      editPlant: false
    }

    this.populateInfo = this.populateInfo.bind(this);
    this.toggleEditPlant = this.toggleEditPlant.bind(this);
  }

  toggleEditPlant() {
    this.setState({
      editPlant: this.state.editPlant === false ? this.state.editPlant = true : this.state.editPlant = false
    })
  };
  
  populateInfo () {
    const infoLabels = [' Plant Name', ' Light Preference', ' Soil Preference', ' Fertilizer Preference', ' Notes', ' Schedule', ' Watering Time', ' Mist'];
    // should only pass relevant props, but for now, here's a hack to filter out the ones we don't want. 
    const { name, light, soil, ferilizer, notes, schedule, tod, mist } = plantInfo;
    const relevantInfo = { name, light, soil, ferilizer, notes, schedule, tod, mist };
    const infoToShow = Object.values(relevantInfo);
    return infoToShow.map((info, index) => {
      // map plant info to plant info modal, line by line
      return (
          <PlantDetail
            key={`plant${index}`} 
            infoLabel={infoLabels[index]} 
            info={info}
          />
      );  
    });  
  };

  render() {
    const plantInfo = this.populateInfo();
    // if no modal opened (either info modal or edit modal), don't render anything. 
    if (!modalVisible) return null;
    // if modal is open but plant isn't being edited, return plant info. 
    if (!this.state.editPlant) {
      return (
      <main className="plant-info-overlay">
        <div className="plant-info">
          <div id="info-modal-buttons">
            <button onClick={() => {
              // copy the state of the plant to be edited to isolated edited plant state object 
              clonePlant(index);
              this.toggleEditPlant();
              }
            }>Edit Info</button>
            <button onClick={() => toggle()}>x</button>   
          </div>
          {plantInfo}
        </div>
      </main>
      )
    // if plant is being edited, render edit plant modal. 
    } else { 
      return (
        <EditPlantForm 
          plants={this.props.plants}
          index={this.props.index}
          // get the plant details from the isolated edited plant state object. 
          plantDetails={this.props.editedPlant}
          editPlantState={this.props.editPlantState}
          id={this.props.id}
          saveEditedPlant={this.props.saveEditedPlant}
          toggleEditPlant={this.toggleEditPlant}
        />
      );
    }
  }
  
};

export default PlantInfo;
