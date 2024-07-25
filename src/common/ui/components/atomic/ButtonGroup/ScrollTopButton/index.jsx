import ArrowMoveTop from 'assets/icons/ArrowMoveTop';
import React from 'react';

const ScrollTopButton = ({onClick}) => {
  return (
    <div className='scroll__top' onClick={onClick}>
      <ArrowMoveTop />
    </div>
  );
};

export default ScrollTopButton;
