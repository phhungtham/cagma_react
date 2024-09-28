import completeImg from '@assets/images/complete.png';
import PaymentIcon from '@assets/images/icon-fill-payment-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import { ProductCode } from '@common/constants/product';
import { moveHome } from '@utilities/index';

import { openAccountSuccessFields } from './constants';
import './styles.scss';

const OpenAccountSuccessful = ({ openAccountInfo, productName, productCode }) => {
  const { creditChecked } = openAccountInfo || {};
  const showRRSPButton = productCode === ProductCode.RRSP_E_SAVINGS;
  const onClickViewAccount = () => {};

  const onClickNavigateHome = () => {
    moveHome();
  };

  return (
    <>
      <div className="open-account-successful__wrapper">
        <div className="open-account__header">
          <div className="open-account__img">
            <img
              src={completeImg}
              alt="Complete"
            />
          </div>
          <div className="open-account__title">
            <div className="complete-message">You’ve successfully opened</div>
            <div className="product-type">{productName}</div>
            {!!creditChecked && <div className="note">Debit card will be sent to the stored customer address.</div>}
          </div>
        </div>
        <div className="divider__item__black" />
        <div className="open-account__info">
          {(openAccountSuccessFields[productCode] || []).map(({ label, value }) => (
            <div
              className="account-item"
              key={value}
            >
              <span className="account-label">{label}</span>
              <span className="account-value">
                <span>{openAccountInfo?.[value]}</span>
              </span>
            </div>
          ))}
        </div>
        {showRRSPButton && (
          <>
            <div className="divider__item__solid" />
            <div className="flex-center mt-8">
              <IconButton
                size="lg"
                type="circle"
                label="RRSP Contribution Receipt"
                icon={<img src={PaymentIcon} />}
                onClick={() => {}}
              />
            </div>
          </>
        )}
      </div>
      <div className="footer__fixed">
        <Button
          variant="filled__secondary-blue"
          label="View Account"
          className="btn__cta"
          onClick={onClickViewAccount}
        />
        <Button
          variant="filled__primary"
          label="Home"
          className="btn__cta"
          onClick={onClickNavigateHome}
        />
      </div>
    </>
  );
};

export default OpenAccountSuccessful;
