import PropTypes from 'prop-types';

const Switch = ({ label, type, onChange, positionSelected, active, disabled, children }) => {
  const hasIcon = type === 'data';
  const isListType = type === 'list';
  const positionRight = positionSelected === 'right';

  const toggleChecked = () => {
    if (disabled) return;
    onChange && onChange(!active);
  };

  return (
    <div className="switch">
      {label && <span className={`switch__label ${isListType && 'switch__list'}`}>{label}</span>}
      <div className={`switch__group${hasIcon ? '__icon' : ''}`}>
        <input
          type="checkbox"
          className="switch__input"
          checked={!!active}
        />
        <button
          className={`switch__slider ${hasIcon && 'switch__has__icon'} ${disabled && 'disabled'}`}
          type="button"
          onClick={toggleChecked}
        >
          <div className={`circle selected__${positionRight ? 'right' : 'left'}`}>
            {hasIcon && <div className="circle__icon">{children}</div>}
          </div>
        </button>
      </div>
    </div>
  );
};

Switch.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['list', 'label', 'data']),
  positionSelected: PropTypes.oneOf(['left', 'right']),
  disabled: PropTypes.bool,
  active: PropTypes.bool,
};

Switch.defaultProps = {
  label: '',
  onChange: undefined,
  type: 'label',
  positionSelected: 'right',
  disabled: false,
  active: false,
};

export default Switch;
