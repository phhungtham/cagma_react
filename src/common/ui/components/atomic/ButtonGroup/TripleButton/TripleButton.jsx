import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button/Button';

export const TripleButton = ({ className, firstButton, secondButton, thirdButton, type, ...otherProps }) => {
  const customClass = ['btn__triple__contain', className].join(' ');

  const { onClick: firstOnClick, label: firstLabel, disable: firstDisable } = firstButton;
  const { onClick: secondOnClick, label: secondLabel, disable: secondDisable } = secondButton;
  const { onClick: thirdOnClick, label: thirdLabel, disable: thirdDisable } = thirdButton;

  return (
    <section className={customClass}>
      <Button onClick={firstOnClick} label={firstLabel} disable={firstDisable} className="btn__triple" />
      <Button onClick={secondOnClick} label={secondLabel} disable={secondDisable} className="btn__triple" />
      <Button onClick={thirdOnClick} label={thirdLabel} disable={thirdDisable} className="btn__triple" />
    </section>
  );
};

TripleButton.propTypes = {
  className: PropTypes.string,
  firstButton: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    disable: PropTypes.bool
  }),
  secondButton: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    disable: PropTypes.bool
  }),
  thirdButton: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    disable: PropTypes.bool
  }),
};

TripleButton.defaultProps = {
  className: '',
  firstButton: {
    onClick: undefined,
    label: 'Button',
    disable: false
  },
  secondButton: {
    onClick: undefined,
    label: 'Button',
    disable: false
  },
  thirdButton: {
    onClick: undefined,
    label: 'Button',
    disable: false
  }
};
