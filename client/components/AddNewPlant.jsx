import React, { Component } from 'react';
import { render } from 'react-dom';

const AddNewPlant = (props) => {
  return (
    <>
      <button id="new-plant" type="button" onClick={() => props.toggle()}> + </button> 
      <div>{props.children}</div>
    </>
  )
}

export default AddNewPlant;