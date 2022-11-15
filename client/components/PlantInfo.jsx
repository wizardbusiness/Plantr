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
    savePlantEdits
  }) {
    super(
      index,
      plantInfo,
      editedPlant,
      clonePlant,
      editPlant,
      savePlantEdits
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
    // if no modal opened, don't render anything. 
    if (!this.props.modalVisible) return null;
    // if plant is not being edited, return plant info. 
    if (!this.state.editPlant) {
      return (
      <main className="plant-info-overlay">
        <div className="plant-info">
          <div id="info-modal-buttons">
            <button onClick={() => {
              // copy the state of the plant to be edited to isolated edited plant state object 
              this.props.clonePlant(index);
              this.toggleEditPlant();
              }
            }>Edit Info</button>
            <button onClick={() => this.props.toggle()}>x</button>   
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
