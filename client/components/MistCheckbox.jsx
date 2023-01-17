import React from 'react';

const MistCheckbox = ({value, setMistState}) => { 
  return (
    <input 
      type = 'checkbox'
      checked = {value} 
      onClick={() => setMistState()}
    />
  );
};
export default MistCheckbox;