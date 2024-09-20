import { forwardRef, useEffect, useRef, useState } from 'react';

import { SIZE, TAG_NAME } from '@common/components/constants';
import useComposeRefs from '@hooks/useComposeRefs';
import { formatSecondsDisplay } from '@utilities/dateTimeUtils';
import { ClearIcon } from 'assets/icons';
import PropTypes from 'prop-types';

import { IconButton } from '../ButtonGroup/IconButton/IconButton';

const Input = forwardRef((props, ref) => {
  const {
    // autoComplete,
    // children,
    clazz,
    disabled,
    errorMessage,
    label,
    onChange,
    onFocus,
    onBlur,
    maxLength,
    minLength,
    name,
    readOnly,
    isMemo,
    placeHolder,
    style,
    type,
    helperText,
    remainingTime,
    isCountCharacter,
    tagName,
    mode,
    value,
    onClearInput,
    endAdornment,
    regex,
    ...otherProps
  } = props;

  const [inputValues, setInputValues] = useState(value);
  const [customClass, setCustomClass] = useState('');
  const [errorTextField, setErrorTextField] = useState(errorMessage);

  const timerRef = useRef(null);
  const countRef = useRef(remainingTime);
  const displayRef = useRef(null);

  // const [minutes, setMinutes] = useState(remainingTime.minutes);
  // const [seconds, setSeconds] = useState(remainingTime.seconds);

  const composeRef = useComposeRefs(ref);

  const handleFocusStatus = (focusMode = 'focus') => {
    if (readOnly) {
      setCustomClass('input__completed');
      return;
    }
    onFocus();
    if (inputValues && focusMode === 'blur') {
      setCustomClass('input__completed');
      return;
    }

    if (focusMode === 'focus') {
      setCustomClass('input__focus');
    } else {
      setCustomClass('');
    }
  };

  const handleInputChange = e => {
    let value = e.target.value;
    if (regex) {
      value = value.replace(regex, '');
    }
    onChange(value);
    setInputValues(value);
  };

  const handleOnBlur = () => {
    onBlur();
    handleFocusStatus('blur');
  };

  const handleClearInputText = () => {
    setInputValues('');
    composeRef.current.value = '';
    // setErrorTextField('');
    onChange();
    onClearInput();
  };

  useEffect(() => {
    setInputValues(value);
    if (value) {
      setCustomClass('input__completed');
    }
  }, [value]);

  useEffect(() => {
    setErrorTextField(errorMessage);
  }, [errorMessage]);

  useEffect(() => {
    if (remainingTime) {
      const updateCountdown = () => {
        if (countRef.current > 0) {
          countRef.current -= 1;
          if (displayRef.current) {
            displayRef.current.textContent = formatSecondsDisplay(countRef.current); //Update DOM without rerendering
          }
        } else {
          clearInterval(timerRef.current);
        }
      };

      timerRef.current = setInterval(updateCountdown, 1000);

      return () => {
        clearInterval(timerRef.current);
      };
      // let myInterval;
      // if (!readOnly) {
      //   myInterval = setInterval(() => {
      //     if (seconds > 0) {
      //       setSeconds(seconds - 1);
      //     }
      //     if (seconds === 0) {
      //       if (minutes === 0) {
      //         clearInterval(myInterval);
      //       } else {
      //         setMinutes(minutes - 1);
      //         setSeconds(59);
      //       }
      //     }
      //   }, 1000);
      // } else {
      //   setMinutes(null);
      // }
      // return () => {
      //   clearInterval(myInterval);
      // };
    }
  }, []);

  return (
    <div className={`text__field ${clazz}`}>
      {isMemo && (
        <section className="input__memo">
          <div className="input__memo__title">Memo</div>
          <div className="input__memo__icon">
            <IconButton size={'w-16'} />
          </div>
        </section>
      )}
      <section
        className={`input__wrapper ${customClass} ${tagName} ${errorTextField && 'input__error'} ${
          disabled && 'disable'
        } ${mode}`}
        onBlur={handleOnBlur}
      >
        <div className={`input__wrapper__label ${customClass} ${disabled && 'disable'} ${mode}`}>{label}</div>
        {tagName === TAG_NAME.INPUT ? (
          <input
            autoComplete="new-password"
            name={name}
            readOnly={readOnly}
            ref={composeRef}
            maxLength={maxLength}
            minLength={minLength}
            placeholder={placeHolder}
            disabled={disabled}
            onChange={handleInputChange}
            onFocus={() => handleFocusStatus()}
            onBlur={handleOnBlur}
            style={style}
            type={type}
            value={value}
            {...otherProps}
          />
        ) : (
          <textarea
            autoComplete="new-password"
            name={name}
            readOnly={readOnly}
            ref={composeRef}
            maxLength={maxLength}
            minLength={minLength}
            placeholder={placeHolder}
            disabled={disabled}
            onChange={handleInputChange}
            onFocus={() => handleFocusStatus()}
            onBlur={handleOnBlur}
            style={style}
            type={type}
            value={value}
            {...otherProps}
          />
        )}
        {remainingTime ? (
          <div className={`input__remaining ${!!endAdornment ? 'has-endAdornment' : ''}`}>
            {/* {minutes}:{seconds < 10 ? `0${seconds}` : seconds} */}
            <span ref={displayRef} />
          </div>
        ) : (
          customClass === 'input__focus' &&
          inputValues && (
            <div
              onMouseDown={handleClearInputText}
              className={`input__icon ${tagName}`}
            >
              <ClearIcon />
            </div>
          )
        )}
        {endAdornment}
      </section>
      {isCountCharacter ? (
        <section
          className={`input__character__counter ${disabled && 'disable'}`}
        >{`${inputValues?.length}/${maxLength}bytes`}</section>
      ) : (
        <>
          {/* TODO: Add icon error prefix */}
          {errorTextField && <section className="input__subtitle error">{errorMessage}</section>}
          {helperText && !errorTextField && <section className="input__subtitle">{helperText}</section>}
        </>
      )}
    </div>
  );
});

Input.propTypes = {
  children: PropTypes.node,
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  helperText: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  isCountCharacter: PropTypes.bool,
  isMemo: PropTypes.bool,
  placeHolder: PropTypes.string,
  remainingTime: PropTypes.number,
  style: PropTypes.object,
  mode: PropTypes.oneOf(['normal', 'onBackground']),
  type: PropTypes.oneOf(['text', 'password', 'number', 'email']),
  onClearInput: PropTypes.func,
};

Input.defaultProps = {
  className: '',
  disabled: false,
  size: SIZE.SMALL,
  type: 'text',
  label: '',
  readOnly: false,
  isMemo: false,
  maxLength: null,
  minLength: null,
  placeHolder: '',
  isCountCharacter: false,
  errorMessage: '',
  remainingTime: 0,
  helperText: '',
  mode: 'normal',
  tagName: TAG_NAME.INPUT,
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onClearInput: () => {},
};

export default Input;
