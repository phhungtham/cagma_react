import { useEffect, useState } from 'react';

import { ErrorIcon, RefreshIcon } from '@assets/icons';
import KeypadDeleteIcon from '@assets/icons/KeypadDeleteIcon';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import BottomSheet from '@common/components/templates/BottomSheet';
import { CurrencyAmountDefaultBaseCode, CurrencyCode, CurrencyPrefixBaseCode } from '@common/constants/currency';
import { commonLabels, ctaLabels, openAccountLabels } from '@common/constants/labels';
import { convertToNumber, formatCurrencyDisplay, stringNumberToCurrency } from '@utilities/currency';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

const numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete'];

const InvalidType = {
  REQUIRED: 'required',
  MIN: 'min',
  MAX: 'max',
};

const EnterAmountBottom = ({
  onClose,
  title,
  subTitle,
  note,
  currencyOptions = [],
  currency = CurrencyCode.CAD,
  amount = '',
  onChangeAmount,
  min,
  max,
  btnText,
  translate: t,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [currentAmount, setCurrentAmount] = useState(stringNumberToCurrency(amount));
  const [invalidAmount, setInvalidAmount] = useState({
    invalid: false,
    type: '',
  });
  const hasExchangeRate = currencyOptions?.length > 0;

  const handleCloseBottomSheet = () => {
    onClose();
  };

  const onClickRefreshExchangeRate = () => {};

  const onClickConfirm = () => {
    let amount = currentAmount;
    const lastChar = currentAmount ? currentAmount.slice(-1) : '';
    if (lastChar === '.') {
      amount = amount.replace('.', '');
    }
    onChangeAmount({
      currency: selectedCurrency,
      amount,
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
      (value === '.' && currentAmount.includes('.')) ||
      (currentAmount === '0' && value === '0') ||
      (!currentAmount.includes('.') && currentAmount.replace(/,/g, '').length > 12 && value !== '.') ||
      (currentAmount.includes('.') && currentAmount.slice(currentAmount.lastIndexOf('.') + 1).length > 1) //Exceed two digit after decimal
    ) {
      return;
    } else {
      let newInput;
      if (currentAmount === '0' && value !== '.') {
        newInput = value;
      } else {
        if (currentAmount === '' && value === '.') {
          newInput = '0.';
        } else {
          newInput = currentAmount + value;
        }
      }
      const formattedInput = stringNumberToCurrency(newInput);
      setCurrentAmount(formattedInput);
    }
  };

  const getInvalidMessage = type => {
    if (type === InvalidType.MIN) {
      return `${t(openAccountLabels.pleaseInputAmountMore).replace('%1', `$${formatCurrencyDisplay(min)}`)}`;
    }
    if (type === InvalidType.MAX) {
      return `${t(commonLabels.youCanSendUpTo).replace('%1', `$${formatCurrencyDisplay(max)}`)}`;
    }
    return '';
  };

  useEffect(() => {
    if (min || max) {
      if (currentAmount) {
        const amountInNumber = convertToNumber(currentAmount);
        if (amountInNumber < min) {
          setInvalidAmount({
            invalid: true,
            type: InvalidType.MIN,
          });
          return;
        }
        if (amountInNumber > max) {
          setInvalidAmount({
            invalid: true,
            type: InvalidType.MAX,
          });
          return;
        }
      }
      setInvalidAmount({
        invalid: false,
        type: '',
      });
    }
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
          {title && <div className="title">{title}</div>}
          {subTitle && <div className="sub-title">{subTitle}</div>}
          {note && <div className="note mb-8">{note}</div>}
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
          {invalidAmount.invalid && (
            <div className="amount-value__error-alert">
              <span className="error-icon mr-1">
                <ErrorIcon />
              </span>
              <span>{getInvalidMessage(invalidAmount.type)}</span>
            </div>
          )}
          {hasExchangeRate && (
            //Just for display. Handle later
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
              label={btnText ? btnText : t(ctaLabels.confirm)}
              variant="filled__primary"
              className="btn-submit"
              onClick={onClickConfirm}
              disable={!currentAmount || invalidAmount.invalid}
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

export default withHTMLParseI18n(EnterAmountBottom);
