import { useEffect, useState } from 'react';

import { PropTypes } from 'prop-types';

import Span from '../Span';

const AnchorTab = props => {
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
    <div className="anchor__tab__wrapper flex-gap-x-8">
      {segments?.map((chip, idx) => (
        <div
          key={idx}
          className={`anchor__tab__item ${type} ${clazz} ${activeChip === chip.value ? 'active__tab' : ''}`}
          onClick={() => handleClickChip(idx, chip)}
        >
          <Span
            clazz={`tabs__label ${type}`}
            text={chip.label}
          />
        </div>
      ))}
    </div>
  );
};

AnchorTab.propTypes = {
  clazz: PropTypes.string,
  type: PropTypes.oneOf(['default']),
  // segments: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     label: PropTypes.string.isRequired,
  //     value: PropTypes.string.isRequired,
  //     handleClick: PropTypes.func
  //   })
  // ),
};
AnchorTab.defaultProps = {
  clazz: '',
  segments: [
    {
      label: 'Label',
      value: 'label',
      handleClick: value => {},
    },
  ],
  defaultActive: '',
};

export default AnchorTab;
