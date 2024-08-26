import React, { useState } from 'react';

import { PropTypes } from 'prop-types';

import Toast from '../Toast';

const Popover = ({ clazz, message, children, iconClose, buttonLabel, lineOfText, mode }) => {
  const [popoverVisibility, setPopoverVisibility] = useState(true);

  const handleClosePopover = () => {
    setPopoverVisibility(false);
  };

  return (
    popoverVisibility && (
      <Toast
        clazz={clazz}
        iconClose={iconClose}
        message={message}
        buttonLabel={buttonLabel}
        lineOfText={lineOfText}
        mode={mode}
        onClose={handleClosePopover}
      >
        {children}
      </Toast>
    )
  );
};

Popover.propTypes = {
  clazz: PropTypes.string,
  message: PropTypes.string,
  iconClose: PropTypes.bool,
  buttonLabel: PropTypes.string,
  lineOfText: PropTypes.oneOf(['single', 'multiple']),
  mode: PropTypes.oneOf(['dark', 'light']),
};

Popover.defaultProps = {
  clazz: '',
  message: '',
  iconClose: true,
  buttonLabel: '',
  lineOfText: 'single',
  mode: 'dark',
};

export default Popover;
