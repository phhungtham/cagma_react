import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const BackButton = ({ className, onClick }) => {
  return (
    <button className={`back-button ${className}`} onClick={onClick}>
      ←
    </button>
  );
};

BackButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func
};

BackButton.defaultProps = {
  className: ''
};

export default BackButton;