import React, { useEffect, useState } from 'react';
import Span from '../Span';
import { PropTypes } from 'prop-types';

const Chips = props => {
  const { clazz, type, segments, defaultActive } = props;
  const [activeChip, setActiveChip] = useState(defaultActive);
  const handleClickChip = (index, chipItem) => {
    setActiveChip(chipItem.value);
    chipItem.handleClick(chipItem.value);
  };

  useEffect(() => {
    setActiveChip(defaultActive);
  }, [defaultActive]);

  return (
    <div className="chips__wrapper">
      {segments?.map((chip, idx) => (
        <div
          key={idx}
          className={`chips__item ${type} ${clazz} ${idx === 0 && 'first__item'} ${
            segments.length === idx + 1 && 'last__item'
          } ${activeChip === chip.value && type !== 'amount' && 'active__chip'}`}
          onClick={() => handleClickChip(idx, chip)}
        >
          <Span clazz={`chips__label ${type}`} text={chip.label} />
        </div>
      ))}
    </div>
  );
};

Chips.propTypes = {
  clazz: PropTypes.string,
  type: PropTypes.oneOf(['amount', 'small', 'default']),
  // segments: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     label: PropTypes.string.isRequired,
  //     value: PropTypes.string.isRequired,
  //     handleClick: PropTypes.func
  //   })
  // ),
};
Chips.defaultProps = {
  clazz: '',
  type: 'amount',
  segments: [
    {
      label: 'Label',
      value: 'label',
      handleClick: value => {
      }
    }
  ],
  defaultActive: ''
};

export default Chips;
