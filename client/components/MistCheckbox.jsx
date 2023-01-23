import React from 'react';

const MistCheckbox = ({value, setMistState}) => { 
  return (
    <input 
      type = 'checkbox'
      checked = {value} 
      onChange={() => setMistState()}
    />
  );
};
export default MistCheckbox;