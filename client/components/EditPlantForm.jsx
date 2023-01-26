import React from 'react';
import EditPlantField from './EditPlantField';
import WaterDateDropDown from './ScheduleDropdown';
import WaterTimeDropdown from './WaterTimeDropdown';
import Checkbox from './MistCheckbox';

const EditPlantForm = ({setPlantState, plantDetails, toggleEditPlant, savePlantEdits, index}) => {
  const makeFields = () => {
    const fieldLabels = [
      ['name', ' Plant Name'], 
      ['light', ' Light Preference'], 
      ['soil', ' Soil Preference'], 
      ['fertilizer', 'Fertilizer Preference'], 
      ['notes', ' Notes'], 
      ['date', ' Schedule'], 
      ['tod', ' Watering Time'], 
      ['mist', ' Mist']
    ];
    const stateObjName = 'editedPlant';
    return fieldLabels.map((label, index) => {
      // if (plantDetails[field][0]) 
      const key = `field${index}`
      if (index === 5) {
        return (
          <WaterDateDropDown
            key={key}
            isOpen={false}
            label={label[1]}
            stateObjName={stateObjName}
            waterSchedule={plantDetails.date}
            setPlantState={setPlantState}
          />
        )
      }
      if (index === 6) {
        return (
          <WaterTimeDropdown 
          key={key}
          label={label[1]}
          tod={plantDetails.tod}
          stateObjName={stateObjName}
          setPlantState={setPlantState}
          />
        )
      }
      if (index === 7) {
        return (
          <Checkbox
            key={key}
            label={label[1]}
            propertyToChange={label[0]}
            value={plantDetails.mist}
            stateObjName={stateObjName}
            setPlantState={setPlantState}
          />
        )
      }
      return (
        <EditPlantField
          key={key}
          stateObjName={stateObjName}
          setPlantState={setPlantState}
          fieldLabel={label[1]}
          plantField={plantDetails[label[0]]}
          propertyToEdit={label[0]}
        />
      );
    });
  }

  const editPlantForm = makeFields();
  return (
    <main className="plant-info-overlay"> 
      <div className="plant-modal">
          <div id="info-modal-buttons">
            <button onClick={() => toggleEditPlant()}>x</button>
          </div>
            {editPlantForm}
            <button onClick={() => {
              toggleEditPlant()
              savePlantEdits()
            }
          }>Save</button>
        </div>
    </main>
  );
};

export default EditPlantForm;