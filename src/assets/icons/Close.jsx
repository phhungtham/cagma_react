import React from 'react';

import PropTypes from 'prop-types';

const CloseIcon = ({ size }) => {
  const renderSmall = () => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 2L10 10"
          stroke="currentColor"
          strokeLinecap="round"
        />
        <path
          d="M2 10L10 2"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const renderMedium = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
      >
        <path
          d="M4 4.73438L20 20.7344"
          stroke="#222428"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 20.7344L20 4.73438"
          stroke="#222428"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  };
  return size === 'small' ? renderSmall() : renderMedium();
};

CloseIcon.propTypes = {
  size: PropTypes.oneOf(['small', 'medium']),
};

CloseIcon.defaultProps = {
  size: 'small',
};

export default CloseIcon;
