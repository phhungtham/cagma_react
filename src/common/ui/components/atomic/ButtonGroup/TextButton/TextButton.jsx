import React from 'react';
import PropTypes from 'prop-types';
export const TextButton = ({
  className,
  label,
  disable,
  onClick,
  variant,
  iconPosition,
  size,
  children,
  ...otherProps
}) => {
  const customClass = [`text__btn__${variant} ${disable ? 'disable' : ''}  ${iconPosition} ${size}`, className].join(' ');
  return (
    <section className={customClass} onClick={onClick} {...otherProps}>
      {children && (
        <div className={`text__btn__${variant}__icon`}>
          <div className={`text__btn__${variant}__icon ${size} ${iconPosition}--${size}`}>{children}</div>
        </div>
      )}
      {label}
    </section>
  );
};

TextButton.propTypes = {
  className: PropTypes.string,
  disable: PropTypes.bool,
  label: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
  onClick: PropTypes.func,
  iconPosition: PropTypes.oneOf(['right', 'left']),
  type: PropTypes.oneOf(['submit', 'button']),
  variant: PropTypes.oneOf(['gray', 'primary'])
};

TextButton.defaultProps = {
  className: '',
  disable: true,
  iconPosition: '',
  label: 'Text Button',
  onClick: undefined,
  variant: 'gray',
  size: 'small'
};
