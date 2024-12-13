import { forwardRef, useEffect, useRef, useState } from 'react';

import { SIZE, TAG_NAME } from '@common/components/constants';
import { ignoreKeys } from '@common/constants/ignoreKeys';
import useComposeRefs from '@hooks/useComposeRefs';
import { formatSecondsDisplay } from '@utilities/dateTimeUtils';
import { ClearIcon } from 'assets/icons';
import PropTypes from 'prop-types';

const Input = forwardRef((props, ref) => {
  const {
    // autoComplete,
    // children,
    clazz = '',
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
    onResetTimer,
    ignoreReadonlyStyle, //Using for call plugin, prevent enter value. Keep style like enable
    ...otherProps
  } = props;
  const [inputValues, setInputValues] = useState(value);
  const [customClass, setCustomClass] = useState('');
  const [errorTextField, setErrorTextField] = useState(errorMessage);
  const timerRef = useRef(null);
  const countRef = useRef(remainingTime);
  const displayRef = useRef(null);

  const composeRef = useComposeRefs(ref);
  const isComposingRef = useRef(false);

  const handleFocusStatus = (focusMode = 'focus') => {
    if (isComposingRef) {
      isComposingRef.current = false;
    }
    if (focusMode === 'focus') {
      onFocus?.();
    }
    if (readOnly) {
      return;
    }
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

  const validateInput = value => {
    if (regex) {
      value = value.replace(regex, '');
    }
    //Handle for case input type number
    if (maxLength) {
      if (value?.length > maxLength) {
        value = value.slice(0, maxLength);
      }
    }
    onChange(value);
    setInputValues(value);
  };

  const handleInputChange = e => {
    console.log('access handleInputChange e.target.value :>> ', e.target.value);
    console.log('access handleInputChange isComposing :>> ', isComposingRef.current);
    let value = e.target.value;
    if (!isComposingRef?.current) {
      validateInput(value);
    }
  };

  const handleOnBlur = () => {
    onBlur?.();
    handleFocusStatus('blur');
  };

  const handleClearInputText = e => {
    e.preventDefault();
    setInputValues('');
    composeRef.current.value = '';
    // setErrorTextField('');
    onChange();
    onClearInput();
  };

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

  const handleOnCompositionStart = () => {
    if (isComposingRef) {
      console.log('access composition start :>> ');
      isComposingRef.current = true;
    }
  };

  //Handle the final step where onInput will no longer trigger. Handle for IME
  const handleOnCompositionEnd = e => {
    if (isComposingRef) {
      console.log('access composition end e.target.value :>> ', e.target.value);
      isComposingRef.current = false;
      validateInput(e.target.value);
    }
  };

  useEffect(() => {
    setInputValues(value);
    if (customClass !== 'input__focus') {
      setCustomClass(value || value === 0 ? 'input__completed' : '');
    }
  }, [value]);

  useEffect(() => {
    setErrorTextField(errorMessage);
  }, [errorMessage]);

  useEffect(() => {
    if (remainingTime) {
      timerRef.current = setInterval(updateCountdown, 1000);
      return () => {
        clearInterval(timerRef.current);
      };
    }
  }, []);

  useEffect(() => {
    if (onResetTimer && typeof onResetTimer === 'function') {
      onResetTimer(() => {
        clearInterval(timerRef.current);
        countRef.current = remainingTime;
        timerRef.current = setInterval(updateCountdown, 1000);
      });
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    // when opening the keyboard on mobile
    const handleViewportChange = () => {
      const activeInput = document.activeElement;
      if (activeInput === composeRef.current) {
        activeInput.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    };
    const viewPort = window?.visualViewport ? window.visualViewport : window;
    viewPort.addEventListener('resize', handleViewportChange);
    return () => {
      viewPort.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  const handleKeyDown = event => {
    if (regex) {
      if (ignoreKeys.includes(event.key)) return;
      if (event.ctrlKey || event.metaKey) return;
      let convertRegex = new RegExp(regex);
      if (convertRegex && convertRegex.test(event.key)) {
        event.preventDefault();
      }
    }
  };

  return (
    <div className={`text__field ${clazz}`}>
      <section
        className={`input__wrapper ${customClass} ${tagName} ${errorTextField && 'input__error'} ${
          disabled ? 'disable' : ''
        } ${readOnly && !ignoreReadonlyStyle ? 'readonly' : ''} ${mode} ${!!endAdornment ? 'has-endAdornment' : ''}`}
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
            onCompositionStart={handleOnCompositionStart}
            onCompositionEnd={handleOnCompositionEnd}
            style={style}
            type={type}
            value={value}
            onKeyDown={handleKeyDown}
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
          inputValues &&
          !endAdornment && (
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
  placeHolder: PropTypes.string,
  remainingTime: PropTypes.number,
  style: PropTypes.object,
  mode: PropTypes.oneOf(['normal', 'onBackground']),
  type: PropTypes.oneOf(['text', 'password', 'number', 'email']),
  onClearInput: PropTypes.func,
  onResetTimer: PropTypes.func,
};

Input.defaultProps = {
  className: '',
  disabled: false,
  size: SIZE.SMALL,
  type: 'text',
  label: '',
  readOnly: false,
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
  onResetTimer: () => {},
};

export default Input;
