import React, { Component } from 'react';

const PlantInfo = (props) => {

  const populateInfo = () => {
    const infoLabels = [' Plant Name', ' Water Frequency', ' Fertilize Frequency', ' Light Preference', ' Soil Preference', ' Fertilizer Preference', ' Notes'];

    infoLabels.map((line, index) => {
      return (
        <article class="plant-info">
          <label for={`info${1}`}>{line}</label>
          <p id={`info${1}`}>{props.info[index]}</p>
        </article>
      )
    })
  }
  if (props.show === false) return null;
  return (
    <>
      {populateInfo()}
    </>
  )
};

export default PlantInfo;
