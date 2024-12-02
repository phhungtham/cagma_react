import { useEffect, useState } from 'react';

import { ArrowIcon } from 'assets/icons';
import PropTypes from 'prop-types';

const Accordion = ({
  clazz,
  title,
  viewDetail,
  label,
  titleIcon,
  caption,
  panelData,
  isExpand,
  button,
  onClick,
  time,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleExpand = e => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(isExpand);
  }, [isExpand]);

  return (
    <div
      className={`${clazz} accordion__wrapper`}
      onClick={onClick}
    >
      <div className="accordion__item">
        <div
          className="accordion__item__content"
          onClick={handleToggleExpand}
        >
          <div className="accordion__item__main">
            {label && <div className="accordion__label">{label}</div>}
            <div className="accordion__title">{title}</div>
            {caption && <div className="accordion__caption">{caption}</div>}
            {time && <div className="accordion__time">{time}</div>}
          </div>
          <div className="accordion__arrow">
            <div className={`accordion__icon ${isOpen ? 'open' : 'close'}`}>
              <ArrowIcon direction={'down'} />
            </div>
          </div>
        </div>
      </div>
      <div className={`accordion__panel ${isOpen ? 'open' : 'close'}`}>{children}</div>
    </div>
  );
};

Accordion.propTypes = {
  clazz: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  titleIcon: PropTypes.object,
  caption: PropTypes.string,
  isExpand: PropTypes.bool,
};
Accordion.defaultProps = {
  clazz: '',
  title: '',
  label: '',
  caption: '',
  titleIcon: {
    name: '',
    position: '',
  },
  isExpand: false,
};
export default Accordion;
