import { useState } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import EnterAmountBottom from '@common/components/organisms/bottomSheets/EnterAmountBottom';
import Header from '@common/components/organisms/Header';
import { CurrencyCode } from '@common/constants/currency';
import { ctaLabels, manageLimitLabels as labels, menuLabels } from '@common/constants/labels';
import { formatCurrencyDisplay } from '@utilities/currency';
import { moveBack } from '@utilities/index';

import { transferLimitChangeDetails, TransferLimitStatus } from '../../constants';
import './styles.scss';

const dailyTransferLimitMax = 15000;

const TransferLimitSettingForm = ({ onSubmit, detail, onCancelLimit, translate: t }) => {
  const [newLimit, setNewLimit] = useState();
  const [showEnterAmountBottom, setShowEnterAmountBottom] = useState(false);

  const isValid = !!newLimit;
  const isShowBtnCancel = detail?.status === TransferLimitStatus.REQUEST_CHANGE;

  const handleOpenEnterAmountBottom = () => {
    setShowEnterAmountBottom(true);
  };

  const onChangeAmount = value => {
    setNewLimit(value.amount);
    setShowEnterAmountBottom(false);
  };

  const handleSubmitForm = () => {
    onSubmit(newLimit);
  };

  return (
    <>
      <Header
        title={t(menuLabels.personalSetting)}
        onClick={moveBack}
      />
      <div className="page__form">
        <h1 className="page__title">{t(labels.onlineBankingLimit)}</h1>
        <div className="py-4 mt-3">
          <div className="form__section__title mb-0">
            <span>{t(labels.changeDetail)}</span>
          </div>
          <div className="box__details mt-4">
            {transferLimitChangeDetails.map(({ label, value }) => (
              <div
                className="box__item"
                key={label}
              >
                <span className="box__label">{t(label)}</span>
                <span className={`box__value ${value === 'currentLimitDisplay' ? 'text-primary font-bold' : ''}`}>
                  <span>{detail?.[value]}</span>
                  {value === 'statusDisplay' && isShowBtnCancel && (
                    <Button
                      label="Cancel the limits"
                      variant="outlined__primary"
                      size="sm"
                      className="mt-4"
                      onClick={onCancelLimit}
                    />
                  )}
                </span>
              </div>
            ))}
          </div>
          <section className="mt-4">
            <TextDropdown
              label={t(labels.newDailyLimit)}
              placeholder="$0.00"
              onClick={handleOpenEnterAmountBottom}
              value={newLimit ? `$${formatCurrencyDisplay(newLimit)}` : undefined}
            />
          </section>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label={t(ctaLabels.next)}
          variant="filled__primary"
          className="btn__cta"
          onClick={handleSubmitForm}
          disable={!isValid}
        />
      </div>
      {showEnterAmountBottom && (
        <EnterAmountBottom
          onClose={() => setShowEnterAmountBottom(false)}
          title={t(labels.newDailyLimit)}
          note={`Daily Transfer Limits is ${detail?.limitDisplay}`}
          currency={detail?.currencyCode || CurrencyCode.CAD}
          amount={newLimit}
          max={dailyTransferLimitMax}
          onChangeAmount={onChangeAmount}
        />
      )}
    </>
  );
};

export default TransferLimitSettingForm;
