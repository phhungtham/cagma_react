import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { HideEyeIcon, MoreIcon, ShowEyeIcon } from 'assets/icons';
import { IconButton } from '../../ButtonGroup/IconButton/IconButton';
import { CARD_COLOR } from '@common/ui/constants';
import Switch from '../../Switch';
const AccountCard = ({
  cardQuantity,
  balance,
  currencyUnit,
  icon,
  firstButton,
  secondButton,
  variant,
  accountType,
  balanceStatus,
  noButton,
  graph,
  switchButton,
  pendingNum,
  children
}) => {
  const [isShowBalance, setIsShowBalance] = useState(balanceStatus);
  //only provide firstButton props if want to show 1 button
  const { onClick: firstOnClick, label: firstLabel } = firstButton || {};
  const { onClick: secondOnClick, label: secondLabel } = secondButton || {};
  const { paymentsMade, paymentsTotal } = graph;
  const paymentsPercent = paymentsMade && paymentsTotal ? (paymentsMade / paymentsTotal) * 100 : null;

  const toggleBalance = () => {
    setIsShowBalance(!isShowBalance);
  };

  const renderCardStack = () => {
    if (variant !== 'primary') return;
    let stackRenders = [];
    for (let i = 0; i < cardQuantity - 1; i++) {
      stackRenders.push(<section key={`stack-${i}`} className="account__card__stack" />);
    }
    return stackRenders;
  };

  const renderButton = () => {
    if (noButton) return;
    if (variant === 'primary') {
      return (
        <section className="account__card__button">
          <button onClick={firstOnClick}>{firstLabel}</button>
          <div className="ver__line" />
          <button onClick={secondOnClick}>{secondLabel}</button>
        </section>
      );
    } else {
      return (
        <section className="account__card__button__secondary">
          <button onClick={firstOnClick}>{firstLabel}</button>
        </section>
      );
    }
  };

  const renderCurrency = () => {
    if (switchButton) {
      return (
        <section className={`account__card__content ${isShowBalance ? 'blur' : 'show'}`}>
          <>
            <span className="balance">{balance}</span> &nbsp;
            <span>{currencyUnit}</span>
          </>
          {children}
        </section>
      );
    } else {
      return (
        <section className={`account__card__content ${isShowBalance && 'show'}`}>
          {isShowBalance ? (
            <>
              <span className="balance">{balance}</span> &nbsp;
              <span>{currencyUnit}</span>
            </>
          ) : (
            'Hide balance'
          )}
          {children}
        </section>
      );
    }
  };

  const cardBackground =
    variant !== 'primary' ? CARD_COLOR[accountType] : 'linear-gradient(91.03deg, #3270ea 0%, #5f60f9 100%)';
  return (
    <section className="account__card__wrapper">
      {switchButton && (
        <section className="switch__top">
          <Switch label="Hide Balance" onChange={status => setIsShowBalance(status)} />
        </section>
      )}

      {renderCardStack()}
      <section
        className={`account__card ${noButton && (paymentsPercent ? 'no-button-with-graph' : 'no-button')} ${
          paymentsPercent && !noButton && 'graph'
        }`}
        style={{ background: cardBackground }}
      >
        <section className="account__card__header">
          <div className="account__card__header-info">
            <div className="card__icon">
              <IconButton size="w-20" icon={icon} />
            </div>
            <div className="info">
              <div className="title">Account name</div>
              <div className="card__num">123-456-000111</div>
            </div>
          </div>
          {variant === 'history' || switchButton ? (
            <div className="acocunt__card__action">
              <MoreIcon />
            </div>
          ) : (
            <div className="account__card__header-eye" onClick={toggleBalance}>
              {isShowBalance ? <ShowEyeIcon /> : <HideEyeIcon />}
            </div>
          )}
        </section>
        {renderCurrency()}
        {paymentsPercent && (
          <section className="card__graph">
            <div className="card__graph__label">
              <div className="card__graph__label__left">00 payments made</div>
              <div className="card__graph__label__right">00 payments total</div>
            </div>
            <div
              className="card__graph__progress"
              style={{
                background: `linear-gradient(90deg, #ffffff ${paymentsPercent}%, rgba(34, 36, 40, 0.2) 0%)`
              }}
            />
          </section>
        )}

        {renderButton()}
      </section>
      {pendingNum > 0 && variant === 'history' && (
        <section className="account__card__pending">
          <div className="label">Pending</div>
          <div className="amount">{pendingNum}</div>
        </section>
      )}
    </section>
  );
};

AccountCard.prototype = {
  icon: PropTypes.string,
  afterLoginImage: PropTypes.string,
  balance: PropTypes.string,
  currencyUnit: PropTypes.string,
  cardQuantity: PropTypes.number,
  noButton: PropTypes.bool,
  balanceStatus: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'history']),
  accountType: PropTypes.oneOf(['checking', 'savings', 'loan']),
  switchButton: PropTypes.bool,
  pendingNum: PropTypes.number,
  graphValue: PropTypes.shape({
    paymentsMade: PropTypes.number,
    paymentsTotal: PropTypes.number
  }),
  firstButton: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string
  }),
  secondButton: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string
  })
};

AccountCard.defaultProps = {
  isLogin: true,
  icon: '',
  afterLoginImage: '',
  cardQuantity: 3,
  variant: 'history',
  balance: '1,000,000,000',
  currencyUnit: 'VND',
  accountType: 'savings',
  noButton: false,
  balanceStatus: false,
  switchButton: true,
  pendingNum: null,
  graph: {
    paymentsMade: 20,
    paymentsTotal: 100
  },
  firstButton: {
    onClick: () => {},
    label: 'Button'
  },
  secondButton: {
    onClick: () => {},
    label: 'Button'
  }
};

export default AccountCard;
