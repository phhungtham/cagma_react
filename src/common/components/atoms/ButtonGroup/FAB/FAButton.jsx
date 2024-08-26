import { useState } from 'react';

import PropTypes from 'prop-types';

import { IconButton } from '../IconButton/IconButton';

export const FAButton = ({ className, label, onClick: faOnClick, variant, children, ...otherProps }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOnclick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section
      onClick={handleOnclick}
      {...otherProps}
    >
      <div className={`fabtn${variant === 'expand' ? '__expand' : ''} ${isExpanded && 'expanded'}`}>
        <span className="icon">
          <IconButton
            className="fabtn__scroll__icon"
            size="w-24"
          />
        </span>
        <span className="text">{label}</span>
      </div>
    </section>
  );
};

FAButton.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['submit', 'button']),
  variant: PropTypes.oneOf(['scroll', 'expand']),
};

FAButton.defaultProps = {
  className: '',
  label: 'Text',
  onClick: () => {
    return;
  },
  variant: 'expand',
};
