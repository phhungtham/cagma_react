import { PropTypes } from 'prop-types';

import Span from '../Span';

const Chips = props => {
  const { type, segments, value: selectedValue, onChange } = props;

  const handleClickChip = chipValue => {
    onChange(chipValue);
  };

  return (
    <div className="chips__wrapper flex-gap-x-9">
      {segments?.map(({ label, value }) => (
        <div
          key={value}
          className={`chips__item ${type} ${selectedValue === value ? 'active__chip' : ''}`}
          onClick={() => handleClickChip(value)}
        >
          <Span
            clazz={`chips__label ${type}`}
            text={label}
          />
        </div>
      ))}
    </div>
  );
};

Chips.propTypes = {
  clazz: PropTypes.string,
  type: PropTypes.oneOf(['amount', 'small', 'default']),
  onChange: PropTypes.func,
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
};
Chips.defaultProps = {
  clazz: '',
  type: 'amount',
  segments: [
    {
      label: 'Label',
      value: 'label',
    },
  ],
  onChange: () => {},
};

export default Chips;
