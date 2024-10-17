import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import PropTypes from 'prop-types';

const BoxRadio = ({ options, onChange, value: selectedValue, size, disabled, translate: t }) => {
  const onClickItem = itemValue => {
    if (disabled) {
      return;
    }
    onChange(itemValue);
  };

  return (
    <div className={`box-radio__wrapper ${size === 'md' ? 'medium' : 'small'}`}>
      {options.map(({ label, value }) => (
        <div
          className={`box-radio__item ${value === selectedValue ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => onClickItem(value)}
          key={value}
        >
          <span className="box-radio__label">{t(label)}</span>
        </div>
      ))}
    </div>
  );
};

BoxRadio.propTypes = {
  onChange: PropTypes.func,
  size: PropTypes.oneOf(['md', 'sm']),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
};

BoxRadio.defaultProps = {
  onChange: () => {},
  options: [],
  size: 'md',
};

export default withHTMLParseI18n(BoxRadio);
