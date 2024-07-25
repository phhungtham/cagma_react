import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import Span from '@common/ui/components/atomic/Span';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const EnterAmountBottomSheet = ({
  open = false,
  onClose,
  balance,
  title,
  currency,
  alert_msg,
  handleOnClickNextButton,
  inputValue,
  setInputValue
}) => {
  const handleCloseBottomSheet = () => {
    onClose();
    setInputValue('');
  };

  const handleNumberClick = value => {
    if (value === 'delete') {
      if (inputValue === 'delete') {
        setInputValue('');
      } else {
        let newValue = inputValue.slice(0, -1);
        if (newValue.includes(',')) {
          newValue = newValue.replace(/,/g, '');
          const formattedValue = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          setInputValue(formattedValue);
        } else {
          setInputValue(newValue);
        }
      }
    } else if (
      (value === '.' && (inputValue.includes('.') || inputValue === '')) ||
      (inputValue === '0' && value === '0') ||
      (currency === 'KHR' && inputValue.replace(/,/g, '').length > 7) ||
      (!inputValue.includes('.') && currency === 'USD' && inputValue.replace(/,/g, '').length > 4 && value !== '.') ||
      (inputValue.includes('.') && currency === 'USD' && inputValue.slice(inputValue.lastIndexOf('.') + 1).length > 1)
    ) {
      return;
    } else {
      let newInput;
      // New logic added here
      if (inputValue === '0' && value !== '.') {
        newInput = value;
      } else {
        newInput = inputValue + value;
      }
      // New logic ends here
      const formattedInput = newInput.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setInputValue(formattedInput);
    }
  };

  const numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', currency === 'USD' ? '.' : '', '0', 'delete'];

  return (
    <>
      <BottomSheet open={open} onClose={handleCloseBottomSheet} type="fit-content" clazz="enter__amount__bottomsheet">
        <div className="input__content">
          <Span clazz="account" text={title} />
          <Span clazz="balance" text={balance} />
          <Span clazz="currency" text={currency} />
          <input
            type="text"
            value={inputValue}
            disabled
            placeholder={currency === 'USD' ? '0.00' : '0'}
            className="value"
            onChange={() => {}}
          />
          <Span clazz="alert" text={alert_msg} />
        </div>
        <div className="btn__next__wrapper">
          <button
            className="btn__next"
            disabled={
              !inputValue || inputValue === '0' || inputValue === '0.' || inputValue === '0.0' || inputValue === '0.00'
            }
            onClick={handleOnClickNextButton}
          >
            Next
          </button>
        </div>

        <div className="numpad">
          {numberButtons.map(value => (
            <button key={value} className="btn__keypad" onClick={() => handleNumberClick(value)}>
              {value === 'delete' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="20" viewBox="0 0 27 20" fill="none">
                  <path d="M14 8L19 13" stroke="#B4C4DB" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M14 13L19 8" stroke="#B4C4DB" stroke-width="1.5" stroke-linecap="round" />
                  <path
                    d="M10.0956 1.4766C10.2368 1.33172 10.4305 1.25 10.6328 1.25H25.5C25.9142 1.25 26.25 1.58579 26.25 2V18.5C26.25 18.9142 25.9142 19.25 25.5 19.25H10.6328C10.4305 19.25 10.2368 19.1683 10.0956 19.0234L2.05713 10.7734C1.77336 10.4822 1.77336 10.0178 2.05713 9.7266L10.0956 1.4766Z"
                    stroke="#B4C4DB"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                </svg>
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

export default EnterAmountBottomSheet;
