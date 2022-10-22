import React from 'react';
import EditPlantField from './EditPlantField';

const EditPlantForm = (props) => {

  const makeFields = () => {
    const fieldLabels = [' Plant Name', ' Water Frequency', ' Fertilize Frequency', ' Light Preference', ' Soil Preference', ' Fertilizer Preference', ' Notes'];
    const plantId = props.plantDetails.id;
    const plantDetails = Object.values(props.plantDetails).slice(1);
    const plantProperties = Object.keys(props.plantDetails).slice(1);
    
    return plantDetails.map((field, index) => {
      const key = `field${index}`
      return (
        <EditPlantField
          key={key}
          id={plantId}
          editPlantState={props.editPlantState}
          fieldLabel={fieldLabels[index]}
          plantField={field}
          propertiesToEdit={plantProperties[index]}
        />
      );
    });
  }
  const editPlantForm = makeFields();

  return (
    <main className="plant-info-overlay"> 
      <div className="plant-info">
          <div id="info-modal-buttons">
            <button onClick={() => props.toggleEditPlant()}>x</button>
          </div>
          {editPlantForm}
        </div>
    </main>
  );
};

export default EditPlantForm;