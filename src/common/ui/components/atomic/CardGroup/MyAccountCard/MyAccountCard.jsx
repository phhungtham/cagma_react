import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CardIcon, HideEyeIcon, ShowEyeIcon, ThinArrowIcon } from 'assets/icons';
import { CARD_COLOR } from '@common/ui/constants';
import { Button } from '../../ButtonGroup/Button/Button';
import { IconButton } from '../../ButtonGroup/IconButton/IconButton';

const MyAccountCard = ({
  type,
  showBalance,
  initialShow,
  title,
  subtitle,
  alertMessage,
  cardQuantity,
  noButton,
  header,
  icon
}) => {
  const [isShowCard, setIsShowCard] = useState(header ? initialShow : true);
  const [isShowBalance, setIsShowBalance] = useState(showBalance);

  const customClass = `my__account__body ${isShowCard && (noButton ? 'show-nobutton' : 'show')} ${
    alertMessage && 'alert'
  } ${!header && 'no-header'}`;

  const toggleCard = () => {
    setIsShowCard(!isShowCard);
  };
  const toggleBalance = () => {
    if (!isShowCard) setIsShowCard(true);
    setIsShowBalance(!isShowBalance);
  };
  return (
    <section className="my__account">
      {header && (
        <section
          className={`my__account__header ${isShowCard && 'show'}`}
          style={{ backgroundColor: CARD_COLOR[type] }}
        >
          <div className="type">Checking</div>
          <div className="my__account__header__left">
            <div className="toggle__balance">
              <div className="eye-icon" onClick={toggleBalance}>
                {isShowBalance ? <ShowEyeIcon /> : <HideEyeIcon />}
              </div>
              <div className="title">Hide Balance</div>
              <div className="vertical__line" />
              <div
                className="arrow__icon"
                style={{ transform: `rotate(${isShowCard ? '-90deg' : '90deg'})` }}
                onClick={toggleCard}
              >
                <ThinArrowIcon />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={customClass}>
        <div className="card__info">
          <div className="icon" style={{ backgroundColor: CARD_COLOR[type] }}>
            <IconButton size="w-20" icon={icon} />
          </div>
          <div className="content">
            <div className="title">{title}</div>
            <div className="subtitle">{subtitle}</div>
          </div>
        </div>
        <div className="card__content">
          {isShowBalance ? <div>{cardQuantity}</div> : <div className="hide__balance">View balance</div>}
          {alertMessage && <div className="account__status">{alertMessage}</div>}
        </div>
        {!noButton && <Button className={'my__account__button'} />}
      </section>
    </section>
  );
};

MyAccountCard.prototype = {
  type: PropTypes.oneOf(['checking', 'savings', 'loan']),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  cardQuantity: PropTypes.string,
  alertMessage: PropTypes.string,
  noButton: PropTypes.bool,
  initialShow: PropTypes.bool,
  header: PropTypes.bool,
  icon: PropTypes.string,
  showBalance: PropTypes.bool
};

MyAccountCard.defaultProps = {
  type: 'checking',
  title: 'Account name',
  subtitle: '123-456-000111',
  cardQuantity: '1.000.000.000 VND',
  alertMessage: 'Dormant account',
  noButton: false,
  initialShow: true,
  header: true,
  icon: <CardIcon />,
  showBalance: true
};

export default MyAccountCard;
