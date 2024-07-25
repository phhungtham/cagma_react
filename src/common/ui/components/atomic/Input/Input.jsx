import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useComposeRefs from '../../../../../hooks/useComposeRefs';
import { InputTypes, SIZE, TAG_NAME } from '@common/ui/constants';
import { ClearIcon } from 'assets/icons';
import { IconButton } from '../ButtonGroup/IconButton/IconButton';

const Input = forwardRef((props, ref) => {
  const {
    autoComplete,
    children,
    clazz,
    defaultValue,
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
    completedMode,
    ignoreInitShow = false,
    ...otherProps
  } = props;
  const [inputValues, setInputValues] = useState(defaultValue || value);
  const [customClass, setCustomClass] = useState('');
  const [errorTextField, setErrorTextField] = useState(errorMessage);

  const [minutes, setMinutes] = useState(remainingTime.minutes);
  const [seconds, setSeconds] = useState(remainingTime.seconds);
  const [initShow, setInitShow] = useState(true);

  const composeRef = useComposeRefs(ref);

  useEffect(() => {
    completedMode && setCustomClass('input__completed');
  }, [completedMode]);

  const handleFocusStatus = (focusMode = 'focus') => {
    setInitShow(true);
    if (readOnly) {
      setCustomClass('input__completed');
      return;
    }
    onFocus();
    if (inputValues && focusMode === 'blur') {
      setMinutes(null);
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
    onChange(e);
    const values = e.target.value;
    setInputValues(values);
    if (initShow) {
      setInitShow(false);
    }
  };

  const handleOnBlur = () => {
    onBlur();
    handleFocusStatus('blur');
  };

  const handleClearInputText = () => {
    setInputValues('');
    setInitShow(true);
    composeRef.current.value = '';
    // setErrorTextField('');
    onChange();
    onClearInput();
  };

  useEffect(() => {
    let myInterval;
    if (!readOnly) {
      myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(myInterval);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      setMinutes(null);
    }
    return () => {
      clearInterval(myInterval);
    };
  });
  useEffect(() => {
    if ((value || (defaultValue && !readOnly)) && !initShow) {
      setInputValues(value || defaultValue);
      setCustomClass('input__focus');
    } else if ((readOnly || initShow) && !ignoreInitShow) {
      setInputValues(value || defaultValue);
      setCustomClass('input__completed');
    }
  }, [value, defaultValue]);

  useEffect(() => {
    setErrorTextField(errorMessage);
  }, [errorMessage]);

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
            defaultValue={defaultValue}
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
            defaultValue={defaultValue}
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
        {minutes ? (
          <div className="input__remaining">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
        ) : (
          customClass === 'input__focus' &&
          inputValues && (
            <div onMouseDown={handleClearInputText} className={`input__icon ${tagName}`}>
              <ClearIcon />
            </div>
          )
        )}
      </section>
      {isCountCharacter ? (
        <section
          className={`input__character__counter ${disabled && 'disable'}`}
        >{`${inputValues?.length}/${maxLength}bytes`}</section>
      ) : (
        <>
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
  defaultValue: PropTypes.string,
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
  remainingTime: PropTypes.exact({
    minutes: PropTypes.number,
    seconds: PropTypes.number
  }),
  style: PropTypes.object,
  mode: PropTypes.oneOf(['normal', 'onBackground']),
  type: PropTypes.oneOf(['text', 'password', 'number', 'email']),
  onClearInput: PropTypes.func
};

Input.defaultProps = {
  className: '',
  defaultValue: '',
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
  remainingTime: {
    minutes: null,
    seconds: null
  },
  helperText: '',
  mode: 'normal',
  tagName: TAG_NAME.INPUT,
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onClearInput: () => {}
};

export default Input;
