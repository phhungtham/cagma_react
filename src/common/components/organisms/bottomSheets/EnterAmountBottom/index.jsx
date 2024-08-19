import { ErrorIcon, InfoIcon, RefreshIcon } from '@assets/icons';
import KeypadDeleteIcon from '@assets/icons/KeypadDeleteIcon';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Span from '@common/components/atoms/Span';
import BottomSheet from '@common/components/templates/BottomSheet';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const currencyOptions = [
  {
    label: 'CAD',
    value: 'CAD'
  },
  {
    label: 'USD',
    value: 'USD'
  }
];

const EnterAmountBottom = ({
  onClose,
  accountBalance,
  accountName,
  accountNumber,
  currency,
  alert_msg,
  handleOnClickNextButton,
  amount,
  setInputValue
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  console.log('selectedCurrency :>> ', selectedCurrency);
  
  const handleCloseBottomSheet = () => {
    onClose();
  };

  const onClickRefreshExchangeRate = () => {

  };

  const onClickConfirm = () => {

  };

  const handleNumberClick = value => {
    if (value === 'delete') {
      if (amount === 'delete') {
        setInputValue('');
      } else {
        let newValue = amount.slice(0, -1);
        if (newValue.includes(',')) {
          newValue = newValue.replace(/,/g, '');
          const formattedValue = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          setInputValue(formattedValue);
        } else {
          setInputValue(newValue);
        }
      }
    } else if (
      (value === '.' && (amount.includes('.') || amount === '')) ||
      (amount === '0' && value === '0') ||
      (currency === 'KHR' && amount.replace(/,/g, '').length > 7) ||
      (!amount.includes('.') && currency === 'USD' && amount.replace(/,/g, '').length > 4 && value !== '.') ||
      (amount.includes('.') && currency === 'USD' && amount.slice(amount.lastIndexOf('.') + 1).length > 1)
    ) {
      return;
    } else {
      let newInput;
      // New logic added here
      if (amount === '0' && value !== '.') {
        newInput = value;
      } else {
        newInput = amount + value;
      }
      // New logic ends here
      const formattedInput = newInput.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setInputValue(formattedInput);
    }
  };

  const numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', currency === 'USD' ? '.' : '', '0', 'delete'];

  return (
    <>
      <BottomSheet open={true} onClose={handleCloseBottomSheet} type="fit-content" clazz="enter-amount__bottomsheet">
        <div className="form__wrapper">
          <div className='account-name'>{accountName}</div>
          <div className='account-number'>{accountNumber}</div>
          <div className='account-balance'>{accountBalance}</div>
          <div className='currency-selection mt-8'>
            {currencyOptions.map(({label, value}) => (
              <span className={`currency-item ${selectedCurrency === value ? 'selected' : ''}`} onClick={() => setSelectedCurrency(value)}>{label}</span>
            ))}
          </div>
          <div className='amount-value__wrapper'>
            <span className='amount-unit mr-1'>$</span>
            <span className='amount-value'>{amount ? amount : '0.00'}</span>
          </div>
          <div className='amount-value__error-alert'>
            <span className='error-icon mr-1'><ErrorIcon /></span>
            <span>Please input an amount more than 10.00 CAD</span>
          </div>
          <div className='amount-exchange-rate__wrapper'>
            <span className='mr-1'>Exchange rate</span>
            <div className='exchange-rate__value__block mr-2'>
              <span className='exchange-rate__unit'>$</span>
              <span className='exchange-rate__value'>1.00</span>
              <span className='mx-1'>=</span>
              <span className='exchange-rate__unit'>US$</span>
              <span className='exchange-rate__value'>1,000</span>
            </div>
            <div className='refresh-btn' onClick={onClickRefreshExchangeRate}>
              <RefreshIcon />
            </div>
          </div>
          <div className='btn-submit__wrapper'>
            <Button label="Next" variant="filled__primary" className="btn-submit" onClick={onClickConfirm} />
          </div>
        </div>
        <div className="numpad">
          {numberButtons.map(value => (
            <button key={value} className="btn__keypad" onClick={() => handleNumberClick(value)}>
              {value === 'delete' ? (
                <KeypadDeleteIcon />
              ) : (
                value
              )}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
};

export default EnterAmountBottom;
