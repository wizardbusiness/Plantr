import React from 'react';

const PlantDetail = ({infoLabel, info}) => {
  return (
    <>
      <label>{infoLabel}: <span>{info}</span></label> 
    </>
      
  );
};

export default PlantDetail;