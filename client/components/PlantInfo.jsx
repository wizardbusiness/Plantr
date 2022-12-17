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
    const infoLabels = [' Plant Name', ' Light Preference', ' Soil Preference', ' Fertilizer Preference', ' Notes', ' Schedule', ' Watering Time', ' Mist'];
    // should only pass relevant props, but for now, here's a hack to filter out the ones we don't want. 
    const { name, light, soil, ferilizer, notes, date, tod, mist } = plantInfo;
    const relevantInfo = { name, light, soil, ferilizer, notes, date, tod, mist };

    const flattenObj = (obj) => {
      const flattenedObj = Object.entries(obj).filter((entry) => (entry[1]))
      
      return flattenedObj;
    };

    const renderFlattenedObjs= (flattenedObj) => {
      const fragments = flattenedObj.map((entry, index) => {
        if (entry[0] === 'morning' || entry[0] === 'mid' || entry[0] === 'evening') return (
          <React.Fragment key={`entry${index}`}>
            {entry[0]}&nbsp; 
          </React.Fragment>
        )
        return (
          <React.Fragment key={`entry${index}`}>
            {entry[0]}: {entry[1]}&nbsp; 
          </React.Fragment>
        );
       
      });

      return (
        <span>{fragments}</span>
      );
    };

    const chosenDate = flattenObj(date);
    console.log(chosenDate)
    const chosenTod = flattenObj(tod);
    console.log(chosenTod)
    

    const infoToShow = Object.values(relevantInfo);
    return infoToShow.map((info, index) => {
      // map plant info to plant info modal, line by line
      if (info === date) return (
        <PlantDetail
          key={`plant${index}`}
          infoLabel={infoLabels[index]}
          info={renderFlattenedObjs(chosenDate)}
        />
      )
      if (info === tod) return (
        <PlantDetail
          key={`plant${index}`}
          infoLabel={infoLabels[index]}
          info={renderFlattenedObjs(chosenTod)}
        />
      )
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
    const {
      index,
      editedPlant,
      clonePlant,
      editPlant,
      savePlantEdits,
      modalVisible,
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
      return (
        <EditPlantForm 
          index={index}
          // get the plant details from the isolated edited plant state object. 
          plantDetails={editedPlant}
          editPlant={editPlant}
          savePlantEdits={savePlantEdits}
          toggleEditPlant={this.toggleEditPlant}
        />
      );
    }
  }
  
};

export default PlantInfo;
