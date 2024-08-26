import React from 'react';

import PropTypes from 'prop-types';

const ArrowIcon = ({ direction = 'down' }) => {
  let arrowDegree;
  switch (direction) {
    case 'down':
      arrowDegree = 0;
      break;
    case 'left':
      arrowDegree = 90;
      break;
    case 'up':
      arrowDegree = 180;
      break;
    case 'right':
      arrowDegree = 270;
      break;

    default:
      break;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 12 12"
      fill="none"
      transform={`rotate(${arrowDegree})`}
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M1.5 3.75L6 8.25L10.5 3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

ArrowIcon.propTypes = {
  direction: PropTypes.oneOf(['up', 'down', 'right', 'left']),
};

ArrowIcon.defaultProps = {
  direction: 'up',
};

export default ArrowIcon;
