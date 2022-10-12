import React from 'react';

const PlantDetail = (props) => {
  return (
      <div>{props.infoLabel}: 
        <span> {props.detail}</span>
      </div>
  );
};

export default PlantDetail;