import { SIZE } from '@common/components/constants';
import { CheckLargeIcon, CheckSmallIcon } from 'assets/icons';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { PropTypes } from 'prop-types';

const CheckBox = ({ clazz, size, label, disabled, hideCheckBox, onChange, checked, translate: t }) => {
  const sizeClassName = size === SIZE.SMALL ? 'checkbox__small' : 'checkbox__large';
  const disabledClassName = disabled ? 'disabled' : '';
  const selectedClassName = checked ? 'selected' : '';

  const handleCheckbox = e => {
    const isSelected = e.target.checked;
    onChange?.(isSelected);
  };
  return (
    <label className={`checkbox ${clazz}`}>
      <input
        type="checkbox"
        className={`checkbox__input ${disabledClassName}`}
        onChange={handleCheckbox}
        disabled={disabled}
        checked={checked}
      />
      {!hideCheckBox && (
        <span className={`checkbox__inner ${selectedClassName} ${disabledClassName} ${sizeClassName}`}>
          {size === SIZE.SMALL ? <CheckSmallIcon /> : <CheckLargeIcon />}
        </span>
      )}

      <span className={`checkbox__label ${sizeClassName} ${disabledClassName}  `}>{label ? `${t(label)}` : ''}</span>
    </label>
  );
};

CheckBox.propTypes = {
  clazz: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large']),
  disabled: PropTypes.bool,
  label: PropTypes.string,
  hideCheckBox: PropTypes.bool,
  onChange: PropTypes.func,
};

CheckBox.defaultProps = {
  clazz: '',
  size: SIZE.LARGE,
  disabled: false,
  label: '',
  hideCheckBox: false,
  onChange: undefined,
};

export default withHTMLParseI18n(CheckBox);
