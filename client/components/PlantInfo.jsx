import React, { Component } from 'react';
import PlantDetail from './PlantDetail';

class PlantInfo extends Component {
  constructor(props) {
    super(props) 
    this.populateInfo = this.populateInfo.bind(this);
  }
  
  populateInfo () {
    const infoLabels = [' Plant Name', ' Water Frequency', ' Fertilize Frequency', ' Light Preference', ' Soil Preference', ' Fertilizer Preference', ' Notes'];
    const plantDetails = Object.values(this.props.plantDetails).slice(1);
    return plantDetails.map((detail, index) => {
      return (
          <PlantDetail 
            key={`plant${index}`} 
            infoLabel={infoLabels[index]} 
            detail={detail} 
          />
      );  
    });  
  };

  render() {
    const plantInfo = this.populateInfo();
    if (!this.props.modalVisible) return null;
    return (
      <main className="plant-info-overlay">
        <div className="plant-info">
          <div id="info-modal-buttons">
            <button>Edit Info</button>
            <button onClick={() => this.props.toggle()}>x</button>   
          </div>
          {plantInfo}
        </div>
        
      </main>
    )
  }
  
};

export default PlantInfo;
