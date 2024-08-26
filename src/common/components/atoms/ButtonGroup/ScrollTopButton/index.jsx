import React from 'react';

import ArrowMoveTop from 'assets/icons/ArrowMoveTop';

const ScrollTopButton = ({ onClick }) => {
  return (
    <div
      className="scroll__top"
      onClick={onClick}
    >
      <ArrowMoveTop />
    </div>
  );
};

export default ScrollTopButton;
