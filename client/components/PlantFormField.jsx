import React from 'react';

const FormField = ({label, property, value, setFieldState}) => {
  return (
    <label>
      <span>
        {label}
        <input onBlur={(e) => setFieldState(property, e.target.value)}>
          {value}
        </input>
      </span>
    </label>
  )
}

export default FormField;