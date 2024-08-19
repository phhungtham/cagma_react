import { ArrowDown } from '@assets/icons';
import PropTypes from 'prop-types';

const TextDropdown = ({label, value, placeholder, onClick, align, disabled, children}) => {
  const onClickDropdown = () => {
    if(disabled) {
      return;
    }
    onClick();
  };

  return (
    <div className='text-dropdown__wrapper'>
      <div className={`text-dropdown__main align-${align} ${disabled ? 'disabled' : ''}`} onClick={onClickDropdown}>
        <div className='text-dropdown__label'>{label}</div>
        <div className='d-flex items-center gap-2'>
          <div className={`text-dropdown__value ${!!value ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}>{value || placeholder}</div>
          <div className='text-dropdown__select-icon'>
            <ArrowDown />
          </div>
        </div>
      </div>
      {children && <section className='text-dropdown__sub-content'>{children}</section>}
    </div>
  );
};

TextDropdown.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  align: PropTypes.oneOf(['horizontal', 'vertical']),
};

TextDropdown.defaultProps = {
  value: '',
  defaultValue: '',
  disabled: false,
  label: '',
  placeHolder: '',
  errorMessage: '',
  helperText: '',
  align: 'horizontal',
  options: [],
  onChange: () => {},
};

export default TextDropdown;