import { forwardRef, useEffect, useState } from 'react';

import { SIZE, TAG_NAME } from '@common/components/constants';
import useComposeRefs from '@hooks/useComposeRefs';
import { CalendarIcon } from 'assets/icons';
import PropTypes from 'prop-types';

const InputDate = forwardRef((props, ref) => {
  const {
    clazz,
    disabled,
    errorMessage,
    label,
    onFocus,
    name,
    placeHolder,
    style,
    tagName,
    mode,
    value,
    ...otherProps
  } = props;
  const [customClass, setCustomClass] = useState('');
  const [errorTextField, setErrorTextField] = useState(errorMessage);

  const composeRef = useComposeRefs(ref);

  const handleFocusStatus = (focusMode = 'focus') => {
    if (value && focusMode === 'blur') {
      setCustomClass('input__completed');
      return;
    }

    if (focusMode === 'focus') {
      onFocus();
      setCustomClass('input__focus');
    } else {
      setCustomClass('');
    }
  };

  const handleOnBlur = () => {
    handleFocusStatus('blur');
  };

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
          onBlur={handleOnBlur}
          style={style}
          type="text"
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
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  name: PropTypes.string,
  placeHolder: PropTypes.string,
  style: PropTypes.object,
  mode: PropTypes.oneOf(['normal', 'onBackground']),
};

InputDate.defaultProps = {
  disabled: false,
  size: SIZE.SMALL,
  label: '',
  placeHolder: '',
  errorMessage: '',
  mode: 'normal',
  tagName: TAG_NAME.INPUT,
  onFocus: () => {},
};

export default InputDate;
