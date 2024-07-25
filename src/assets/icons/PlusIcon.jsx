import React from 'react';

const PlusIcon = (props) => {
  const { iconWidth = '10', iconHeight = '10'} = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={iconWidth} height={iconHeight} viewBox="0 0 10 10" fill="none">
      <path d="M1 5L9 5.00029" stroke="white" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M5 1L5 9" stroke="white" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
};

export default PlusIcon;
