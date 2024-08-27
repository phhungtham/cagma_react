import { useEffect, useState } from 'react';

import { ErrorIcon, RefreshIcon } from '@assets/icons';
import KeypadDeleteIcon from '@assets/icons/KeypadDeleteIcon';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import BottomSheet from '@common/components/templates/BottomSheet';
import { CurrencyAmountDefaultBaseCode, CurrencyCode, CurrencyPrefixBaseCode } from '@common/constants/currency';
import { stringNumberToCurrency } from '@utilities/currency';

// const currencyOptions = [
//   {
//     label: 'CAD',
//     value: 'CAD',
//   },
//   {
//     label: 'USD',
//     value: 'USD',
//   },
// ];

const numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete'];

const EnterAmountBottom = ({
  onClose,
  account,
  currencyOptions = [],
  currency = CurrencyCode.CAD,
  alert_msg,
  handleOnClickNextButton,
  amount = '',
  onChangeAmount,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [currentAmount, setCurrentAmount] = useState(amount);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const hasExchangeRate = currencyOptions?.length > 0;

  const handleCloseBottomSheet = () => {
    onClose();
  };

  const onClickRefreshExchangeRate = () => {};

  const onClickConfirm = () => {
    onChangeAmount({
      currency: selectedCurrency,
      amount: currentAmount,
    });
  };

  const handleNumberClick = value => {
    if (value === 'delete') {
      if (currentAmount) {
        let newValue = currentAmount.slice(0, -1);
        if (newValue.includes(',')) {
          const formattedValue = stringNumberToCurrency(newValue);
          setCurrentAmount(formattedValue);
        } else {
          setCurrentAmount(newValue);
        }
      }
    } else if (
      (value === '.' && (currentAmount.includes('.') || currentAmount === '')) ||
      (currentAmount === '0' && value === '0') ||
      //TODO: Prevent input when exceed maxlength
      (!currentAmount.includes('.') && currentAmount.replace(/,/g, '').length > 4 && value !== '.') ||
      (currentAmount.includes('.') && currentAmount.slice(currentAmount.lastIndexOf('.') + 1).length > 1) //Exceed two digit after decimal
    ) {
      return;
    } else {
      let newInput;
      if (currentAmount === '0' && value !== '.') {
        newInput = value;
      } else {
        newInput = currentAmount + value;
      }
      const formattedInput = stringNumberToCurrency(newInput);
      setCurrentAmount(formattedInput);
    }
  };

  useEffect(() => {
    setInvalidAmount(false);
  }, [currentAmount]);

  return (
    <>
      <BottomSheet
        open
        onClose={handleCloseBottomSheet}
        type="fit-content"
        clazz="enter-amount__bottomsheet"
      >
        <div className="form__wrapper">
          <div className="account-name">{account?.dep_ac_alnm_nm}</div>
          <div className="account-number">{account?.lcl_ac_no_display}</div>
          <div className="account-balance mb-8">{`Available Balance $${account?.def_ac_blc_display}`}</div>
          {hasExchangeRate && (
            <div className="currency-selection mb-6">
              {currencyOptions.map(({ label, value }) => (
                <span
                  className={`currency-item ${selectedCurrency === value ? 'selected' : ''}`}
                  onClick={() => setSelectedCurrency(value)}
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          <div className={`amount-value__wrapper ${!!currentAmount ? 'has-value' : ''}`}>
            <span className="amount-unit mr-1">{CurrencyPrefixBaseCode[selectedCurrency]}</span>
            <span className="amount-value">
              {currentAmount ? currentAmount : CurrencyAmountDefaultBaseCode[selectedCurrency]}
            </span>
          </div>
          <div className={`amount-value__error-alert ${invalidAmount ? 'error-msg' : ''}`}>
            <span className="error-icon mr-1">
              <ErrorIcon />
            </span>
            <span>Please input an amount more than 10.00 CAD</span>
          </div>
          {hasExchangeRate && (
            //TODO: Handle Exchange Rate
            <div className="amount-exchange-rate__wrapper">
              <span className="mr-1">Exchange rate</span>
              <div className="exchange-rate__value__block mr-2">
                <span className="exchange-rate__unit">$</span>
                <span className="exchange-rate__value">1.00</span>
                <span className="mx-1">=</span>
                <span className="exchange-rate__unit">US$</span>
                <span className="exchange-rate__value">1,000</span>
              </div>
              <div
                className="refresh-btn"
                onClick={onClickRefreshExchangeRate}
              >
                <RefreshIcon />
              </div>
            </div>
          )}
          <div className="btn-submit__wrapper">
            <Button
              label="Next"
              variant="filled__primary"
              className="btn-submit"
              onClick={onClickConfirm}
              disable={!currentAmount || invalidAmount}
            />
          </div>
        </div>
        <div className="numpad">
          {numberButtons.map(value => (
            <button
              key={value}
              className="btn__keypad"
              onClick={() => handleNumberClick(value)}
            >
              {value === 'delete' ? <KeypadDeleteIcon /> : value}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
};

export default EnterAmountBottom;
