import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '../IconButton/IconButton';

export const Button = ({ className, label, disable, onClick, variant, iconPosition, size, children, endIcon, ...otherProps }) => {
  const customClass = [`btn__${variant} btn__${size} ${disable ? 'disable' : ''}`, className].join(' ');
  return (
    <button className={customClass} onClick={onClick} {...otherProps} disabled={disable}>
      <section className={`btn__contain ${iconPosition}`}>
        {label}
        {endIcon && <span className={`btn__icon icon__${size}`}>{endIcon}</span>}
      </section>
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  disable: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['default', 'xl', 'lg', 'md', 'sm']),
  iconPosition: PropTypes.oneOf(['right', 'left']),
  type: PropTypes.oneOf(['submit', 'button']),
  variant: PropTypes.oneOf(['filled__primary', 'text__primary', 'outlined__primary', 'outlined__gray', 'filled__secondary-blue'])
};

Button.defaultProps = {
  className: '',
  disable: false,
  iconPosition: 'left',
  label: 'Button',
  onClick: undefined,
  variant: 'filled__primary',
  size: 'default'
};
