import React, { Component } from 'react';
import PlantDetail from './PlantDetail';
import EditPlantForm from './EditPlantForm';

class PlantInfo extends Component {
  constructor(props) {
    super(props) 

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
    const infoLabels = [' Plant Name', ' Water Frequency', ' Fertilize Frequency', ' Light Preference', ' Soil Preference', ' Fertilizer Preference', ' Notes'];
    const plantName = this.props.plantDetails.name;
    const plantDetails = Object.values(this.props.plantDetails).slice(1);
    return plantDetails.map((detail, index) => {
      return (
          <PlantDetail
            plantName={plantName}
            key={`plant${index}`} 
            infoLabel={infoLabels[index]} 
            detail={detail}
             
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
            <button onClick={() => this.toggleEditPlant()}>Edit Info</button>
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
          plantDetails={this.props.plantDetails}
          editPlantState={this.props.editPlantState}
          saveEditedPlant={this.props.saveEditedPlant}
          toggleEditPlant={this.toggleEditPlant}
        />
      );
    }
  }
  
};

export default PlantInfo;
