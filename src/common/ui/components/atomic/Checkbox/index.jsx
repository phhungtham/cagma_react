import { CheckLargeIcon, CheckSmallIcon } from 'assets/icons';
import React from 'react';
import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { SIZE } from '@common/ui/constants';
import { AppCfg } from '@configs/appConfigs';

const CheckBox = ({
  clazz,
  size,
  label,
  backgroundSelected,
  disabled,
  hideCheckBox,
  onChange,
  staticCheckBox,
  defaultChecked = false,
  onChecked
}) => {
  const [selected, setSelected] = useState(false);
  const sizeClassName = size === SIZE.SMALL ? 'checkbox__small' : 'checkbox__large';
  const disabledClassName = disabled ? 'disabled' : '';
  const selectedClassName = selected || staticCheckBox ? 'selected' : '';

  const handleCheckbox = e => {
    const isSelected = e.target.checked;
    if (onChange) onChange(isSelected);
    setSelected(!selected);
    if (onChecked && !selected) {
      onChecked();
    }
  };
  return (
    <label className={`checkbox ${clazz}`}>
      {staticCheckBox ? (
        <input
          type="checkbox"
          className={`checkbox__input ${disabledClassName}`}
          defaultChecked={true}
          disabled={true}
        />
      ) : (
        <input
          type="checkbox"
          className={`checkbox__input ${disabledClassName}`}
          onChange={handleCheckbox}
          disabled={disabled}
          defaultChecked={defaultChecked}
        />
      )}
      {!hideCheckBox && (
        <span
          className={`checkbox__inner ${selectedClassName} ${disabledClassName} ${sizeClassName} ${backgroundSelected}`}
        >
          {size === SIZE.SMALL ? <CheckSmallIcon /> : <CheckLargeIcon />}
        </span>
      )}

      <span className={`checkbox__label ${sizeClassName} ${disabledClassName}  `}>{label ? `${label}` : ''}</span>
    </label>
  );
};

CheckBox.propTypes = {
  clazz: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large']),
  backgroundSelected: PropTypes.oneOf(['light', 'dark']),
  disabled: PropTypes.bool,
  label: PropTypes.string,
  hideCheckBox: PropTypes.bool,
  staticCheckBox: PropTypes.bool,
  onChange: PropTypes.func,
  url: PropTypes.string
};

CheckBox.defaultProps = {
  clazz: '',
  size: SIZE.SMALL,
  disabled: false,
  backgroundSelected: 'light',
  label: '',
  hideCheckBox: false,
  staticCheckBox: false,
  onChange: undefined,
  url: null
};

export default CheckBox;
