import PropTypes from 'prop-types';

const CircleRadio = ({ options, onChange, value: selectedValue, disabled }) => {
  const onClickItem = itemValue => {
    if (disabled) {
      return;
    }
    onChange(itemValue);
  };

  return (
    <div className="circle-radio__wrapper">
      {options.map(({ label, value }) => (
        <div
          className="circle-radio__item"
          onClick={() => onClickItem(value)}
        >
          <input
            className="circle-radio__input"
            type="radio"
            name="radio"
            value={value}
            disabled={disabled}
            checked={value === selectedValue}
          />
          <label className="circle-radio__label">{label}</label>
        </div>
      ))}
    </div>
  );
};

CircleRadio.propTypes = {
  onChange: PropTypes.func,
  size: PropTypes.oneOf(['md', 'sm']),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
};

CircleRadio.defaultProps = {
  onChange: () => {},
  options: [],
  size: 'md',
};

export default CircleRadio;
