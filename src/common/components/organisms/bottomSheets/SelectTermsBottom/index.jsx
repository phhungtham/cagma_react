import { useEffect, useRef, useState } from 'react';

import { ErrorIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Chips from '@common/components/atoms/Chips';
import BottomSheet from '@common/components/templates/BottomSheet';
import { dateFormat } from '@common/constants/dateTime';
import { SelectTermDurationTypes } from '@common/constants/terms';
import dayjs from 'dayjs';

const typeWithUnitLabel = {
  [SelectTermDurationTypes.MONTH]: 'months',
  [SelectTermDurationTypes.DATE]: 'days',
};

const SelectTermsBottom = ({
  onClose,
  type = SelectTermDurationTypes.MONTH,
  onChange,
  value,
  max = 60,
  min = 1,
  options = [],
}) => {
  const [isInvalidValue, setIsInvalidValue] = useState(false);
  const [termValue, setTermValue] = useState(value);
  const inputRef = useRef(null);
  // const options = type === SelectTermDurationTypes.MONTH ? selectTermsByMonthOptions : selectTermsByDateOptions;

  const handleCloseBottomSheet = () => {
    onClose();
  };

  const onChangeTerm = event => {
    const value = event.target.value;
    const numericString = value.replace(/\D/g, '');
    setTermValue(numericString);
  };

  const onSelectChipTerm = chipValue => {
    setTermValue(chipValue);
  };

  const onBlurInput = () => {
    inputRef.current?.focus();
  };

  const onClickConfirm = event => {
    onChange(termValue);
    event.preventDefault();
  };

  const getMaturityDate = () => {
    const currentDate = dayjs();
    const addType = type === SelectTermDurationTypes.MONTH ? 'month' : 'day';
    const maturityDate = currentDate.add(termValue, addType);
    const formattedDate = maturityDate.format(dateFormat);
    return formattedDate;
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const isInvalid = termValue && Number(termValue) > max;
    setIsInvalidValue(isInvalid);
  }, [termValue]);

  return (
    <>
      <BottomSheet
        open
        onClose={handleCloseBottomSheet}
        title="Select Terms"
        type="fit-content"
        clazz="select-terms__bottomsheet"
      >
        <div className="form__wrapper">
          <input
            ref={inputRef}
            onChange={onChangeTerm}
            className="select-terms__input-hidden"
            type="number"
            onBlur={onBlurInput}
            maxLength={3}
          />
          <div className={`select-terms__value ${termValue ? 'has-value' : ''}`}>
            <span className="select-terms__number">{termValue || `${min}~${max}`}</span>
            <span className="select-terms__unit">{typeWithUnitLabel[type]}</span>
          </div>
          {isInvalidValue && (
            <div className="select-terms__error-alert">
              <span className="error-icon mr-1">
                <ErrorIcon />
              </span>
              <span>
                Please enter less than {max} {typeWithUnitLabel[type]}
              </span>
            </div>
          )}
          <div className="select-terms__options">
            <Chips
              segments={options}
              onChange={onSelectChipTerm}
              value={termValue}
            />
          </div>
          {termValue && (
            <div className="maturity-date">
              <span>Maturity date</span>
              <span>{getMaturityDate()}</span>
            </div>
          )}
          <div className="btn-submit__wrapper">
            <Button
              label="Next"
              variant="filled__primary"
              className="btn-submit"
              onClick={onClickConfirm}
              disable={isInvalidValue || !termValue}
            />
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

export default SelectTermsBottom;
