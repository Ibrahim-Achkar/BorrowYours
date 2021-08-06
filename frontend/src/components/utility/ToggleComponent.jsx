//package imports
import React from 'react';

//app imports
import Toggle from 'react-bootstrap-toggle';
import '../../styles/bootstrap2-toggle.css';

const ToggleComponent = ({ item, onClick }) => {
  const { isAvailable } = item;

  return (
    <Toggle
      active={isAvailable}
      on='On'
      off='Off'
      onstyle='success'
      offstyle='outline-danger'
      size='md'
      onClick={(event) => {
        onClick(item);
      }}
    />
  );
};

export default ToggleComponent;
