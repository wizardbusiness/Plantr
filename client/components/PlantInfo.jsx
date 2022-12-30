import React, { Component } from 'react';
import PlantDetail from './PlantDetail';
import EditPlantForm from './EditPlantForm';

class PlantInfo extends Component {
  constructor(props) {
    super(props); 

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
    const { plantInfo } = this.props;
    const infoLabels = [
      ['name', ' Plant Name'], 
      ['light', ' Light Preference'], 
      ['soil', ' Soil Preference'], 
      ['fertilizer', ' Fertilizer Preference'], 
      ['notes', ' Notes'], 
      ['date', ' Schedule'], 
      ['tod', ' Watering Time'], 
      ['mist', ' Mist']];

    const flattenObj = (obj) => {
      const flattenedObj = Object.entries(obj).filter((entry) => (entry[1]))
      return flattenedObj;
    };

    const renderFlattenedObjs= (flattenedObj) => {
      const labels = {
        'morning': 'Morning',
        'mid': 'Afternoon', 
        'evening': 'Evening'
      }
      const fragments = flattenedObj.map((entry, index) => {
        // for schedule info
        if (entry[0] === 'morning' || entry[0] === 'mid' || entry[0] === 'evening') return (
          <React.Fragment key={`entry${index}`}>
            {labels[entry[0]]}&nbsp; 
          </React.Fragment>
        )
        // for time of day
        else return (
          <React.Fragment key={`entry${index}`}>
            {entry[0]}: {entry[1]}&nbsp; 
          </React.Fragment>
        );
       
      });

      return (
        <span>{fragments}</span>
      );
    };

    const chosenDate = flattenObj(plantInfo.date);
    const chosenTod = flattenObj(plantInfo.tod);

    return infoLabels.map((label, index) => {
      const key = `field${index}`;
      if (label[0] === 'date') return (
        <PlantDetail
          key={key}
          infoLabel={label[1]}
          info={renderFlattenedObjs(chosenDate)}
        />
      )
      else if (label[0] === 'tod') return (
        <PlantDetail
          key={key}
          infoLabel={label[1]}
          info={renderFlattenedObjs(chosenTod)}
        />
      )
      else if (label[0] === 'mist') return (
        <label key={key} >
          {label[0]}
          <input type="checkbox" checked={plantInfo.mist} disabled />
        </label>
      )
      else return (
          <PlantDetail
            key={key} 
            infoLabel={label[1]} 
            info={plantInfo[label[0]]}
          />
      );  
    });  
  };

  render() {
    const {
      index,
      editedPlant,
      clonePlant,
      editPlant,
      savePlantEdits,
      modalVisible,
      setPlantState,
      toggleModal
    } = this.props;

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
            <button onClick={() => toggleModal()}>x</button>   
          </div>
          {plantInfo}
        </div>
      </main>
      )
    // else if plant is being edited, render edit plant modal. 
    } else { 
      console.log('Edit Plant Form rendered')
      return (
        <EditPlantForm 
          index={index}
          // get the plant details from the isolated edited plant state object. 
          plantDetails={editedPlant}
          editPlant={editPlant}
          setPlantState={setPlantState}
          savePlantEdits={savePlantEdits}
          toggleEditPlant={this.toggleEditPlant}
        />
      );
    }
  }
  
};

export default PlantInfo;
