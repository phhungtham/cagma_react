import { forwardRef, useEffect, useState } from 'react';

import { INPUT_MODE, InputTypes, SIZE } from '@common/components/constants';
import useComposeRefs from '@hooks/useComposeRefs';
import { ClearIcon, ClearIconDark, SearchIcon } from 'assets/icons';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import PropTypes from 'prop-types';

import Span from '../Span';

const InputSearch = forwardRef((props, ref) => {
  const {
    translate,
    // autoComplete,
    // children,
    // className,
    defaultValue,
    onChange,
    maxLength,
    minLength,
    name,
    placeHolder,
    style,
    type,
    onClear,
    onCancel,
    size,
    mode,
    value,
    onFocusSearchInput,
    onKeyUp,
    hasCancelButton,
    ...otherProps
  } = props;

  const [inputValues, setInputValues] = useState(defaultValue);
  const [isShowClearBtn, setIsShowClearBtn] = useState(false);
  const [isShowCancelBtn, setIsShowCancelBtn] = useState(false);

  const composeRef = useComposeRefs(ref);

  const handleInputChange = e => {
    onChange(e);
    const values = e.target.value;
    setInputValues(values);
    setIsShowClearBtn(true);
  };

  const handleOnBlur = () => {
    setIsShowClearBtn(false);
    if (!inputValues) {
      setIsShowCancelBtn(false);
    }
  };

  const handleFocus = () => {
    setIsShowClearBtn(true);
    setIsShowCancelBtn(true);
    onFocusSearchInput && onFocusSearchInput(true);
  };

  const handleClearInputText = () => {
    setInputValues('');
    composeRef.current.value = '';
    onClear && onClear();
  };

  const handleCancelInput = () => {
    handleClearInputText();
    onFocusSearchInput && onFocusSearchInput(false);
    onCancel && onCancel();
    onClear && onClear();
    setIsShowCancelBtn(false);
  };

  const checkOncancel = () => {
    if (hasCancelButton) {
      return;
    }
    return onCancel && isShowCancelBtn;
  };

  useEffect(() => {
    setInputValues(value);
  }, [value]);

  const handleSubmit = () => {};
  return (
    <div className={`input__search__wrapper ${checkOncancel() ? 'has-cancel' : ''}`}>
      <section
        className={`input__search ${checkOncancel() && 'has-cancel'} ${size} ${mode}`}
        onBlur={handleOnBlur}
      >
        <div className={`input__search__icon ${mode}`}>
          <SearchIcon />
        </div>
        <input
          autoComplete="false"
          name={name}
          ref={composeRef}
          maxlength={maxLength}
          minlength={minLength}
          placeholder={placeHolder}
          defaultValue={defaultValue}
          onChange={handleInputChange}
          onBlur={handleOnBlur}
          onFocus={handleFocus}
          onKeyUp={onKeyUp}
          onSubmit={handleSubmit}
          style={style}
          value={maxLength && type === 'number' ? inputValues.slice(0, maxLength) : inputValues}
          type={type}
          {...otherProps}
        />
        {inputValues && isShowClearBtn && (
          <div
            onMouseDown={handleClearInputText}
            onClick={handleClearInputText}
            className="input__search__clear"
          >
            {mode === INPUT_MODE.ON_BACKGROUND ? <ClearIconDark /> : <ClearIcon />}
          </div>
        )}
      </section>
      {hasCancelButton ? (
        <Span
          clazz={`input__search__cancel ${mode}`}
          text={translate('lbl_com_3032')}
          onClick={handleCancelInput}
        />
      ) : (
        checkOncancel() && (
          <Span
            clazz={`input__search__cancel ${mode}`}
            text={translate('lbl_com_3032')}
            onClick={handleCancelInput}
          />
        )
      )}
    </div>
  );
});
InputSearch.propTypes = {
  children: PropTypes.node,
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  name: PropTypes.string,
  placeHolder: PropTypes.string,
  onFocusSearchInput: PropTypes.func,
  style: PropTypes.object,
  type: PropTypes.oneOf(Object.values(InputTypes)),
  size: PropTypes.oneOf(Object.values(SIZE)),
  mode: PropTypes.oneOf(Object.values(INPUT_MODE)),
  hasCancelButton: PropTypes.bool,
};

InputSearch.defaultProps = {
  className: '',
  defaultValue: '',
  size: SIZE.SMALL,
  mode: INPUT_MODE.NORMAL,
  type: 'text',
  onChange: () => {},
  hasCancelButton: false,
};

export default withHTMLParseI18n(InputSearch);
