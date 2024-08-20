import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '../IconButton/IconButton';

export const Button = ({ className, label, disable, onClick, variant, iconPosition, children, ...otherProps }) => {
  const customClass = [`btn__${variant} ${disable ? 'disable' : ''}`, className].join(' ');
  return (
    <button className={customClass} onClick={onClick} {...otherProps} disabled={disable}>
      <section className={`btn__contain ${iconPosition}`}>
        {children && (
          <div className={`btn__icon ${iconPosition}`}>
            <IconButton size="w-16" />
          </div>
        )}
        {label}
      </section>
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  disable: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  iconPosition: PropTypes.oneOf(['right', 'left']),
  type: PropTypes.oneOf(['submit', 'button']),
  variant: PropTypes.oneOf(['filled__primary', 'background', 'outlined__primary', 'outlined__gray', 'filled__secondary-blue'])
};

Button.defaultProps = {
  className: '',
  disable: false,
  iconPosition: 'left',
  label: 'Button',
  onClick: undefined,
  variant: 'filled__primary'
};
