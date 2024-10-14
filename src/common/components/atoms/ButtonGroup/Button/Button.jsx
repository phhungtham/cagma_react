import PropTypes from 'prop-types';

export const Button = ({
  className,
  label,
  disable,
  onClick,
  variant,
  startIcon,
  size,
  children,
  endIcon,
  ...otherProps
}) => {
  const customClass = [`btn__${variant} btn__${size} ${disable ? 'disable' : ''}`, className].join(' ');
  return (
    <button
      className={customClass}
      onClick={onClick}
      {...otherProps}
      disabled={disable}
    >
      <section className="btn__contain">
        {startIcon && <span className={`btn__icon icon__${size}`}>{startIcon}</span>}
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
  type: PropTypes.oneOf(['submit', 'button']),
  variant: PropTypes.oneOf([
    'filled__primary',
    'text__primary',
    'text__gray',
    'outlined__primary',
    'outlined__gray',
    'filled__secondary-blue',
    'filled__secondary-gray',
  ]),
};

Button.defaultProps = {
  className: '',
  disable: false,
  label: 'Button',
  onClick: undefined,
  variant: 'filled__primary',
  size: 'default',
};
