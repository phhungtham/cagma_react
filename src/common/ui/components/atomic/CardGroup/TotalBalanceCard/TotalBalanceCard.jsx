import React, { useState } from 'react';
import Switch from '../../Switch';
import PropTypes from 'prop-types';

const TotalBalanceCard = ({ firstValue, secondValue, handleBlurAmount }) => {
  const [isBlur, setIsBlur] = useState(false);
  const onSwitch = status => {
    setIsBlur(status);
    if (handleBlurAmount) {
      handleBlurAmount(status);
    }
  };
  return (
    <div className="total__balance">
      <div className="total__balance__header">
        <Switch label="Hide Balance" onChange={onSwitch} />
      </div>
      <div className="total__balance__body">
        <section className="total__balance__body__left">
          <div className="total__label">TOTAL</div>
          <div className="horizontal__line" />
        </section>
        <section className={`total__balance__body__right ${isBlur && 'blur'}`}>
          <div className="first__line">
            <div className="currency">{firstValue.currency}</div>
            <div className="currency-unit">&nbsp;{firstValue.currencyUnit}</div>
          </div>
          <div className="second__line">
            <div className="currency">{secondValue.currency}</div>
            <div className="currency-unit">&nbsp;{secondValue.currencyUnit}</div>
          </div>
        </section>
      </div>
    </div>
  );
};

TotalBalanceCard.propTypes = {
  firstValue: PropTypes.shape({
    currency: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currencyUnit: PropTypes.string
  }),
  secondValue: PropTypes.shape({
    currency: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currencyUnit: PropTypes.string
  })
};

TotalBalanceCard.defaultProps = {
  firstValue: {
    currency: '523.00',
    currencyUnit: 'USD'
  },
  secondValue: {
    currency: '4.823.00',
    currencyUnit: 'KHR'
  }
};

export default TotalBalanceCard;
