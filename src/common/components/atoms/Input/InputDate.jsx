import { forwardRef, useEffect, useState } from 'react';

import { SIZE, TAG_NAME } from '@common/components/constants';
import useComposeRefs from '@hooks/useComposeRefs';
import { CalendarIcon } from 'assets/icons';
import PropTypes from 'prop-types';

const InputDate = forwardRef((props, ref) => {
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
    // helperText,
    // remainingTime,
    // isCountCharacter,
    tagName,
    mode,
    value,
    // onClearInput,
    // endAdornment,
    ...otherProps
  } = props;
  const [customClass, setCustomClass] = useState('');
  const [errorTextField, setErrorTextField] = useState(errorMessage);

  // const [minutes, setMinutes] = useState(remainingTime.minutes);
  // const [seconds, setSeconds] = useState(remainingTime.seconds);

  const composeRef = useComposeRefs(ref);

  const handleFocusStatus = (focusMode = 'focus') => {
    onFocus();
    if (value && focusMode === 'blur') {
      setCustomClass('input__completed');
      return;
    }

    if (focusMode === 'focus') {
      setCustomClass('input__focus');
    } else {
      setCustomClass('');
    }
  };

  const handleOnBlur = () => {
    onBlur();
    handleFocusStatus('blur');
  };

  // const handleClearInputText = () => {
  //   setInputValues('');
  //   composeRef.current.value = '';
  //   // setErrorTextField('');
  //   onChange();
  //   onClearInput();
  // };

  useEffect(() => {
    if (value) {
      setCustomClass('input__completed');
    }
  }, [value]);

  useEffect(() => {
    setErrorTextField(errorMessage);
  }, [errorMessage]);

  return (
    <div className={`text__field ${clazz}`}>
      <section
        className={`input__wrapper input__calendar ${customClass} ${tagName} ${errorTextField && 'input__error'} ${
          disabled && 'disable'
        } ${mode}`}
        onClick={() => handleFocusStatus()}
      >
        <div className={`input__wrapper__label input__calendar ${customClass} ${disabled && 'disable'} ${mode}`}>
          {label}
        </div>
        <input
          autoComplete="new-password"
          name={name}
          readOnly
          ref={composeRef}
          placeholder={placeHolder}
          disabled={disabled}
          onFocus={() => handleFocusStatus()}
          onBlur={handleOnBlur}
          style={style}
          type={type}
          value={value}
          {...otherProps}
        />
        <div className="input__icon">
          <CalendarIcon />
        </div>
      </section>
    </div>
  );
});

InputDate.propTypes = {
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
  remainingTime: PropTypes.exact({
    minutes: PropTypes.number,
    seconds: PropTypes.number,
  }),
  style: PropTypes.object,
  mode: PropTypes.oneOf(['normal', 'onBackground']),
  type: PropTypes.oneOf(['text', 'password', 'number', 'email']),
  onClearInput: PropTypes.func,
};

InputDate.defaultProps = {
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
  remainingTime: {
    minutes: null,
    seconds: null,
  },
  helperText: '',
  mode: 'normal',
  tagName: TAG_NAME.INPUT,
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onClearInput: () => {},
};

export default InputDate;
