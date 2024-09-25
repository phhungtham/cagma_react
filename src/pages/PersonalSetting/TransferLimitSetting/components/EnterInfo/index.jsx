import { useState } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import EnterAmountBottom from '@common/components/organisms/bottomSheets/EnterAmountBottom';
import Header from '@common/components/organisms/Header';
import { CurrencyCode } from '@common/constants/currency';
import { formatCurrencyDisplay } from '@utilities/currency';
import { moveBack } from '@utilities/index';

import { transferLimitChangeDetails } from '../../constants';
import './styles.scss';

const dailyTransferLimitMax = 15000;

const TransferLimitSettingForm = ({ onSubmit, changeDetail, onCancelLimit }) => {
  const [newLimit, setNewLimit] = useState();
  const [showEnterAmountBottom, setShowEnterAmountBottom] = useState(false);

  const isValid = !!newLimit;

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
        title="Personal Setting"
        onClick={moveBack}
      />
      <div className="page__form">
        <h1 className="page__title">Online Banking Transfer Limit</h1>
        <div className="py-4 mt-3">
          <div className="form__section__title">
            <span>Change details</span>
          </div>
          <div className="box__details mt-3">
            {transferLimitChangeDetails.map(({ label, value }) => (
              <div
                className="box__item"
                key={label}
              >
                <span className="box__label">{label}</span>
                <span className={`box__value ${value === 'currentLimit' ? 'text-primary font-bold' : ''}`}>
                  <span>{changeDetail?.[value]}</span>
                  {value === 'status' && (
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
              label="New Daily Transfer Limits"
              placeholder="$0.00"
              onClick={handleOpenEnterAmountBottom}
              value={newLimit ? `$${formatCurrencyDisplay(newLimit)}` : undefined}
            />
          </section>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label="Next"
          variant="filled__primary"
          className="btn__cta"
          onClick={handleSubmitForm}
          disable={!isValid}
        />
      </div>
      {showEnterAmountBottom && (
        <EnterAmountBottom
          onClose={() => setShowEnterAmountBottom(false)}
          title="New Daily Transfer Limits"
          note="Daily Transfer Limits is $15,000.00"
          currency={CurrencyCode.CAD}
          amount={newLimit}
          max={dailyTransferLimitMax}
          onChangeAmount={onChangeAmount}
        />
      )}
    </>
  );
};

export default TransferLimitSettingForm;
