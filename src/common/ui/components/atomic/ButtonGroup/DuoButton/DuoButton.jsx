import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button/Button';

export const DuoButton = ({ className, ratio, firstButton, secondButton, duoDirection, children, ...otherProps }) => {
  const customHorizontalClass = [`btn__duo__${ratio}`, className].join(' ');
  const customVerticalClass = ['btn__duo__vertical', className].join(' ');

  const isVertical = duoDirection === 'vertical';

  const customClass = isVertical ? customVerticalClass : customHorizontalClass;
  const {
    onClick: firstOnClick,
    label: firstLabel,
    disable: firstDisable,
    className: firstClassName
  } = firstButton || {};
  const {
    onClick: secondOnClick,
    label: secondLabel,
    disable: secondDisable,
    className: secondClassName
  } = secondButton || {};
  return (
    <section className={customClass} {...otherProps}>
      {firstButton && (
        <Button
          className={`btn__duo__first ${firstClassName}`}
          disable={firstDisable}
          onClick={firstOnClick}
          variant={isVertical ? 'filled__primary' : 'outlined__primary'}
          label={firstLabel}
        />
      )}
      {secondButton && (
        <Button
          className={`btn__duo__second ${secondClassName}`}
          disable={secondDisable}
          onClick={secondOnClick}
          variant={!isVertical ? 'filled__primary' : 'text__gray'}
          label={secondLabel}
        />
      )}
    </section>
  );
};

DuoButton.propTypes = {
  className: PropTypes.string,
  //oto is one-to-one ratio, ott is one-to-two ratio
  ratio: PropTypes.oneOf(['oto', 'ott']),
  duoDirection: PropTypes.oneOf(['horizontal', 'vertical']),
  firstButton: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    disable: PropTypes.bool,
    className: PropTypes.string
  }),
  secondButton: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    disable: PropTypes.bool,
    className: PropTypes.string
  }),
  type: PropTypes.oneOf(['submit', 'button'])
};

DuoButton.defaultProps = {
  className: '',
  ratio: 'oto',
  duoDirection: 'horizontal',
  firstButton: null,
  secondButton: null
};
