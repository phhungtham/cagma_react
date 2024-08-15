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
  disabled,
  hideCheckBox,
  onChange,
  checked
}) => {
  const sizeClassName = size === SIZE.SMALL ? 'checkbox__small' : 'checkbox__large';
  const disabledClassName = disabled ? 'disabled' : '';
  const selectedClassName = checked ? 'selected' : '';

  const handleCheckbox = e => {
    const isSelected = e.target.checked;
    onChange?.(isSelected);
  };
  
  return (
    <label className={`checkbox ${clazz}`}>
      <input
        type="checkbox"
        className={`checkbox__input ${disabledClassName}`}
        onChange={handleCheckbox}
        disabled={disabled}
        checked={checked}
      />
      {!hideCheckBox && (
        <span
          className={`checkbox__inner ${selectedClassName} ${disabledClassName} ${sizeClassName}`}
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
  disabled: PropTypes.bool,
  label: PropTypes.string,
  hideCheckBox: PropTypes.bool,
  onChange: PropTypes.func,
};

CheckBox.defaultProps = {
  clazz: '',
  size: SIZE.LARGE,
  disabled: false,
  label: '',
  hideCheckBox: false,
  onChange: undefined,
};

export default CheckBox;
