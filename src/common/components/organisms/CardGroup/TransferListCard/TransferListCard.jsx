import { useState } from 'react';

import { HideAccountIcon, QRIcon, SettingIcon, ShareIcon, StarIcon } from '@assets/icons';
import Currency from '@common/components/atoms/Currency';
import Span from '@common/components/atoms/Span';
import OptionMenu from '@common/components/molecules/OptionMenu/OptionMenu';
import { VerticalDotsIcon } from 'assets/icons';
import PropTypes from 'prop-types';

const TransferListCard = ({
  icon,
  accountName,
  accountNumber,
  currency,
  currencyUnit,
  onUnhideAccount,
  openPopupManageAccount,
  isShowBalance,
}) => {
  const options = [
    {
      title: 'My QR',
      icon: QRIcon,
      function: () => handleQRClick(),
    },
    {
      title: 'Share Account',
      icon: ShareIcon,
      function: () => handleShareClick(),
    },
    {
      title: 'Manage Account',
      icon: SettingIcon,
      function: () => handleManageAccountClick(),
    },
    {
      title: 'Set as Primary',
      icon: StarIcon,
      function: () => handleStarClick(),
    },
    {
      title: 'Hide Account',
      icon: HideAccountIcon,
      function: () => handleHideAccountClick(),
    },
  ];

  const [showOption, setShowOption] = useState(false);

  const handleQRClick = () => {};
  const handleShareClick = () => {};
  const handleManageAccountClick = () => {
    // showPopup manage account
    openPopupManageAccount(accountName);
  };
  const handleStarClick = () => {
    // make primary account
  };
  const handleHideAccountClick = () => {};

  return (
    <div className="transfer__card__wrraper">
      <div className={`transfer__card ${!currency && !currencyUnit && 'short'}`}>
        <section className="transfer__card__header">
          <section className="transfer__card__header__left">
            <div className="icon">{icon}</div>
            <div className="info">
              <div className="account__name">{accountName}</div>
              <div className="card__id">{accountNumber}</div>
            </div>
          </section>
          {onUnhideAccount ? (
            <Span
              clazz="unhide__account"
              text="Unhide"
              onClick={onUnhideAccount}
            />
          ) : (
            <section
              className="transfer__card__header__right"
              onClick={() => setShowOption(!showOption)}
            >
              <VerticalDotsIcon />
              {showOption && <OptionMenu listOption={options} />}
            </section>
          )}
        </section>
        <section className="transfer__card__content">
          <Currency
            clazz={isShowBalance ? 'blur' : ''}
            amount={currency}
            unit={currencyUnit}
          />
        </section>
      </div>
    </div>
  );
};
TransferListCard.prototype = {
  currency: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currencyUnit: PropTypes.string,
};

TransferListCard.defaultProps = {
  currency: '4,823.00',
  currencyUnit: 'USD',
};

export default TransferListCard;
