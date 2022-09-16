import React, {Component} from 'react';

const NewPlant = (props) => {
  const addPlant = async () => {
    const { id, name, water_at_date, fertilize_at_date, light_pref, soil_pref, fertilizer_pref, notes} = props;
    const body = {
      id,
      name,
      water_at_date,
      fertilize_at_date,
      light_pref,
      soil_pref,
      fertilizer_pref,
      notes
    }
    try {
      await fetch('/plants/:id', {
        method: 'POST', 
        headers: {
          'Content-Type': 'Application/JSON'
        },
        body: JSON.stringify(body)
      })
    } catch (err) {
      console.log(err);
    }
  }

  addPlant();

  return (
    <button onClick={() => addPlant()}>Add Plant</button>
  )
}

export default NewPlant;