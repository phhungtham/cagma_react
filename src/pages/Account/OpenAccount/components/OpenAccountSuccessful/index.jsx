import completeImg from '@assets/images/complete.png';
import PaymentIcon from '@assets/images/icon-fill-payment-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import { MENU_CODE } from '@common/constants/common';
import { DepositSubjectClass } from '@common/constants/deposit';
import { ProductCode } from '@common/constants/product';
import { moveHome, moveNext } from '@utilities/index';

import { openAccountSuccessFields } from './constants';
import './styles.scss';

const OpenAccountSuccessful = ({ openAccountInfo, productCode, dep_sjt_class }) => {
  const { creditChecked, openedAccountNumber } = openAccountInfo || {};
  const showRRSPButton = productCode === ProductCode.RRSP_E_SAVINGS;

  const onClickViewAccount = () => {
    const accountNumberParam = JSON.stringify({
      lcl_acno: openedAccountNumber,
    });
    let menuCode = '';
    if (dep_sjt_class === DepositSubjectClass.REGULAR_SAVING) {
      menuCode = MENU_CODE.ACCOUNT_ACTIVITY_BANKING;
    } else if ([DepositSubjectClass.INSTALLMENT_SAVING, DepositSubjectClass.TERM_DEPOSIT_GIC].includes(dep_sjt_class)) {
      menuCode = MENU_CODE.ACCOUNT_ACTIVITY_INVESTMENT;
    }
    if (menuCode) {
      moveNext(menuCode, { param: accountNumberParam });
    }
  };

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
            <div className="product-type">{openAccountInfo?.productName}</div>
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
                label="You can Check RRSP Contribution Receipt on the Account activity page"
                icon={<img src={PaymentIcon} />}
                onClick={() => {}} //TODO: Handle navigate to account activity
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
