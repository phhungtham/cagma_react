import React, { useEffect, useMemo, useRef, useState } from 'react';

import { INPUT_MODE } from '@common/components/constants';
import { PropTypes } from 'prop-types';

import TextError from '../TextError';

const InputPin = ({ clazz, mode, stepsNumber, errorMsg, onChange }) => {
  const [codeValue, setCodeValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = event => {
    const inputValue = event.target.value;
    if (inputValue.length > stepsNumber) return;
    if (onChange) onChange(inputValue);
    if (inputValue.length === 0 || !inputValue.length) {
      setFocused(false);
    } else {
      setFocused(true);
    }
    setCodeValue(inputValue);
  };

  const handleInputFocus = () => setFocused(true);

  // Disable scroll action input type number...
  const handleMouseWheel = event => event.target.blur();

  const handleInputBlur = () => {};

  // auto open keyboard...
  useEffect(() => {
    inputRef.current.focus();
    setFocused(true);
  }, []);

  const inputJSX = useMemo(() => {
    const inputArray = new Array(stepsNumber)
      .fill('')
      .map((epmty, index) => (codeValue[index] ? codeValue[index] : epmty));

    return (
      <div className="dots">
        {inputArray.map((item, idx) => (
          <div
            key={idx}
            className={`dots__input ${mode === INPUT_MODE.ON_BACKGROUND && !focused ? 'on__background' : ''}`}
          >
            {item && <span className="dots__item" />}
          </div>
        ))}
      </div>
    );
  }, [codeValue, focused]);

  return (
    <div className={`input__wrapper ${clazz}`}>
      {inputJSX}
      <input
        className="input__pin"
        ref={inputRef}
        value={codeValue}
        type="number"
        maxLength={6}
        inputMode="numeric"
        onChange={handleInputChange}
        onClick={handleInputFocus}
        onWheel={handleMouseWheel}
        onBlur={handleInputBlur}
        autoFocus
      />
      {errorMsg && (
        <TextError
          clazz=""
          text={errorMsg}
        />
      )}
    </div>
  );
};

InputPin.propTypes = {
  clazz: PropTypes.string,
  mode: PropTypes.oneOf(['normal', 'onBackground']),
  stepsNumber: PropTypes.number,
  errorMsg: PropTypes.string,
};

InputPin.defaultProps = {
  clazz: '',
  mode: 'normal',
  stepsNumber: 6,
  errorMsg: '',
};

export default InputPin;
