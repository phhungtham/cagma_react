import React from 'react';

import PropTypes from 'prop-types';

export const IconButton = ({ className, label, size, disable, onClick, icon, type }) => {
  const customClass = [`btn__icon btn__icon__${type} icon--${size} ${disable ? 'disable' : ''}`, className].join(' ');

  return (
    <div className={`btn__icon__wrapper ${customClass}`}>
      <div
        className="btn__icon__main"
        onClick={onClick}
      >
        <div className="icon__container">{icon}</div>
      </div>
      {label && <div className="btn__icon__label">{label}</div>}
    </div>
  );
};

IconButton.propTypes = {
  className: PropTypes.string,
  disable: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  size: PropTypes.oneOf(['xl', 'lg', 'md', 'sm']),
  type: PropTypes.oneOf(['circle', 'box', 'card', 'wide']),
};

IconButton.defaultProps = {
  className: '',
  disable: false,
  label: null,
  onClick: undefined,
  icon: null,
  size: 'xl',
  type: 'circle',
};
