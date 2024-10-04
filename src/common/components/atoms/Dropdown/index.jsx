import { forwardRef, useEffect, useState } from 'react';

import { SIZE } from '@common/components/constants';
import { ArrowDown, ArrowUp } from 'assets/icons';
import PropTypes from 'prop-types';

const Dropdown = forwardRef((props, ref) => {
  const { children, clazz, disabled, errorMessage, label, onFocus, readOnly, value, completedMode, options } = props;

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
        } ${disabled && 'disable'}`}
        tabIndex={-1} // Make the section focusable
        onBlur={handleOnBlur}
        onClick={handleFocusStatus}
      >
        <div className="dropdown__main">
          <div className={`dropdown__label ${customClass} ${disabled && 'disable'}`}>{label}</div>
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
  label: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  name: PropTypes.string,
  readOnly: PropTypes.bool,
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
  errorMessage: '',
  options: [],
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
};

export default Dropdown;
