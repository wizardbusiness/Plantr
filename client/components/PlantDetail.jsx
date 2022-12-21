import React from 'react';

const PlantDetail = ({infoLabel, info}) => {
  return (
      <div>{infoLabel}: <span> {info}</span> </div>
  );
};

export default PlantDetail;