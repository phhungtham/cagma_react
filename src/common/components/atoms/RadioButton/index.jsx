import React from 'react';
import { PropTypes } from 'prop-types';
import { SIZE } from '@common/components/constants';

const RadioButton = ({ clazz, value = '', size, label, disabled, selected, onChange, handleClick }) => {
  const toggleRadio = e => {
    if (disabled) return;
    if (onChange) onChange(e.target.checked);
  };
  const onClickRadio = e => {
    if (disabled) return;
    handleClick && handleClick(value);
  };
  return (
    <div className={`radio__group ${clazz}`} onClick={onClickRadio}>
      <label className="radio__item">
        <input
          className="radio__input"
          type="radio"
          name="radio"
          value={value}
          disabled={disabled}
          onChange={toggleRadio}
          checked={value === selected}
        />
        <span className={`radio__button ${size} ${disabled ? 'disabled' : ''}`}>
          <p className={`${disabled ? 'radio__label' : ''}`}>{`${label ? label : ''}`}</p>
        </span>
      </label>
    </div>
  );
};

RadioButton.propTypes = {
  clazz: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large']),
  disabled: PropTypes.bool,
  selected: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func
};
RadioButton.defaultProps = {
  clazz: '',
  size: SIZE.SMALL,
  disabled: false,
  selected: '',
  label: '',
  onChange: undefined
};
export default RadioButton;
