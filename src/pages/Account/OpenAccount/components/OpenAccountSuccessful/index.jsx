import completeImg from '@assets/images/complete.png';
import PaymentIcon from '@assets/images/icon-fill-payment-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import { MENU_CODE } from '@common/constants/common';
import { DepositSubjectClass } from '@common/constants/deposit';
import { openAccountLabels as labels } from '@common/constants/labels';
import { ProductCode } from '@common/constants/product';
import { routePaths } from '@routes/paths';
import { moveHome, moveNext } from '@utilities/index';

import { openAccountSuccessFields } from './constants';
import './styles.scss';

const OpenAccountSuccessful = ({ openAccountInfo, productCode, dep_sjt_class, translate: t }) => {
  const { creditChecked, openedAccountNumber } = openAccountInfo || {};

  const showRRSPButton = productCode === ProductCode.RRSP_E_SAVINGS;
  const isChequingCreditChecked = productCode === ProductCode.CHEQUING && creditChecked;

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
      moveNext(menuCode, { lcl_acno: openedAccountNumber });
    }
  };

  const handleNavigateAccountActivity = () => {
    moveNext(MENU_CODE.ACCOUNT_ACTIVITY_BANKING);
  };

  const handleClickConfirm = () => {
    if (isChequingCreditChecked) {
      moveNext(MENU_CODE.ADD_NEW_CARD, {}, routePaths.addNewCard);
    } else {
      moveHome();
    }
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
            {/* //TODO: Check case %1 in english and 1음 in korean. Can't replace */}
            <div className="complete-message">{t(labels.youHaveSuccessfully).replace('%1', '')}</div>
            <div className="product-type">{openAccountInfo?.productName}</div>
            {!!creditChecked && (
              <div className="note">
                {isChequingCreditChecked ? 'Issue your card from the Get new card' : t(labels.debitCardWillBe)}
              </div>
            )}
          </div>
        </div>
        <div className="divider__item__black" />
        <div className="open-account__info">
          {(openAccountSuccessFields[productCode] || []).map(({ label, value }) => (
            <div
              className="account-item"
              key={value}
            >
              <span className="account-label">{t(label)}</span>
              <span className="account-value">
                <span>{openAccountInfo?.[value]}</span>
              </span>
            </div>
          ))}
        </div>
        {showRRSPButton && (
          <>
            <div className="divider__item__solid" />
            <div className="flex-center rrsp-button mt-8">
              <IconButton
                size="lg"
                type="circle"
                label="You can Check RRSP Contribution Receipt on the Account activity page"
                icon={<img src={PaymentIcon} />}
                onClick={handleNavigateAccountActivity}
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
          label={isChequingCreditChecked ? 'Get new card' : 'Home'}
          className="btn__cta"
          onClick={handleClickConfirm}
        />
      </div>
    </>
  );
};

export default OpenAccountSuccessful;
