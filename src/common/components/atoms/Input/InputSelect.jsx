import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowIcon } from 'assets/icons';
import Input from './Input';
import { IconButton } from '../ButtonGroup/IconButton/IconButton';

const InputSelect = forwardRef((props, ref) => {
  const { clazz, errorMessage, beExpand, label, onClick, value, disabled, ...otherProps } = props;

  const [isFocus, setIsFocus] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const handleSetInputStatus = status => {
    setIsFocus(status);
  };

  const handleOnBlur = () => {
    handleSetInputStatus(false);
    if (inputValue) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  const handleOnFocus = () => {
    handleSetInputStatus(true);
    setIsCompleted(false);
  };

  const handleInputChange = e => {
    const inputValueLiteral = e?.target.value || '';
    setInputValue(inputValueLiteral);
  };

  return (
    <div className="input__select" onClick={onClick}>
      <div
        onBlur={handleOnBlur}
        className={`input__select__wrapper ${isFocus && beExpand && 'expand'} ${isCompleted && 'completed'} ${
          errorMessage && inputValue && 'error'
        } ${disabled && 'disabled'}`}
      >
        <section className={`input__select__contain ${(isFocus || isCompleted) && beExpand && 'expand'}`}>
          <IconButton size="w-40" />
          <div className="input__select__text">Input Text</div>
        </section>
        <section className={`input__select__icon ${(isFocus || isCompleted) && beExpand && 'expand'}`}>
          <ArrowIcon />
          {/* <ArrowIcon direction="down" /> */}
        </section>
        <Input
          disabled={disabled}
          onFocus={handleOnFocus}
          onChange={handleInputChange}
          clazz="input__select"
          label={label}
          value={value}
          {...otherProps}
        />
      </div>
      {errorMessage && inputValue && <section className="input__subtitle__error">{errorMessage}</section>}
    </div>
  );
});

InputSelect.propTypes = {
  clazz: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  disabled: PropTypes.bool,
  beExpand: PropTypes.bool,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  placeHolder: PropTypes.string
};

InputSelect.defaultProps = {
  clazz: '',
  disabled: false,
  beExpand: true,
  label: 'Label',
  placeHolder: 'Place Holder',
  errorMessage: ''
};

export default InputSelect;
