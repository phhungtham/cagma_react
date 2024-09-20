import { forwardRef, useEffect, useState } from 'react';

import { SIZE } from '@common/components/constants';
import { ArrowDown, ArrowUp } from 'assets/icons';
import PropTypes from 'prop-types';

const Dropdown = forwardRef((props, ref) => {
  const {
    // autoComplete,
    children,
    clazz,
    // defaultValue,
    disabled,
    errorMessage,
    label,
    // onChange,
    onFocus,
    // onBlur,
    // name,
    readOnly,
    // isMemo,
    // placeHolder,
    // style,
    // helperText,
    // isCountCharacter,
    mode,
    value,
    // onClearInput,
    completedMode,
    options,
    // ...otherProps
  } = props;

  const [valueDisplay, setValueDisplay] = useState('');
  const [customClass, setCustomClass] = useState('');
  const [errorTextField, setErrorTextField] = useState(errorMessage);

  useEffect(() => {
    completedMode && setCustomClass('dropdown__completed');
  }, [completedMode]);

  const handleFocusStatus = () => {
    if (readOnly || disabled) {
      setCustomClass('dropdown__completed');
      return;
    }
    onFocus();
    setCustomClass('dropdown__focus');
  };

  const handleOnBlur = () => {
    setCustomClass(valueDisplay ? 'dropdown__completed' : '');
  };

  useEffect(() => {
    let valueForDisplay = '';
    if (value) {
      valueForDisplay = options?.length ? options.find(option => option.value === value)?.label || '' : value;
    }
    setValueDisplay(valueForDisplay);
    setCustomClass(value ? 'dropdown__completed' : '');
  }, [value, options]);

  useEffect(() => {
    setErrorTextField(errorMessage);
  }, [errorMessage]);

  return (
    <div className={clazz}>
      <section
        className={`dropdown__wrapper ${!!valueDisplay ? 'has-value' : ''} ${customClass} ${
          errorTextField && 'dropdown__error'
        } ${disabled && 'disable'} ${mode}`}
        tabIndex={-1} // Make the section focusable
        onBlur={handleOnBlur}
        onClick={handleFocusStatus}
      >
        <div className="dropdown__main">
          <div className={`dropdown__label ${customClass} ${disabled && 'disable'} ${mode}`}>{label}</div>
          <div className="dropdown__value">{valueDisplay}</div>
          {children}
        </div>
        <div className="dropdown__icon">{customClass === 'dropdown__focus' ? <ArrowUp /> : <ArrowDown />}</div>
      </section>
    </div>
  );
});

Dropdown.propTypes = {
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
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  isCountCharacter: PropTypes.bool,
  placeHolder: PropTypes.string,
  style: PropTypes.object,
  mode: PropTypes.oneOf(['normal', 'text']),
  onClearInput: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
};

Dropdown.defaultProps = {
  className: '',
  defaultValue: '',
  disabled: false,
  size: SIZE.SMALL,
  label: '',
  readOnly: false,
  placeHolder: '',
  isCountCharacter: false,
  errorMessage: '',
  helperText: '',
  mode: 'normal',
  options: [],
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onClearInput: () => {},
};

export default Dropdown;
