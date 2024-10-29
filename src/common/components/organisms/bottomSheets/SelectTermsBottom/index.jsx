import { useEffect, useRef, useState } from 'react';

import { ErrorIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Chips from '@common/components/atoms/Chips';
import BottomSheet from '@common/components/templates/BottomSheet';
import { SelectTermDurationTypes } from '@common/constants/terms';

const typeWithUnitLabel = {
  [SelectTermDurationTypes.DAY]: 'days',
  [SelectTermDurationTypes.WEEK]: 'weeks',
  [SelectTermDurationTypes.MONTH]: 'months',
  [SelectTermDurationTypes.QUARTER]: 'quarters',
  [SelectTermDurationTypes.YEAR]: 'years',
};

const SelectTermsBottom = ({
  onClose,
  type = SelectTermDurationTypes.MONTH,
  onChange,
  value,
  max,
  min,
  options = [],
  inquiryMaturityDate,
}) => {
  const [termError, setTermError] = useState();
  const [termValue, setTermValue] = useState(value);
  const [maturityDate, setMaturityDate] = useState();
  const inputRef = useRef(null);

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
    onChange({
      termValue: termValue,
      maturityDate: maturityDate?.value,
      maturityDateDisplay: maturityDate?.valueDisplay,
    });
    event.preventDefault();
  };

  const getMaturityDate = async () => {
    const result = await inquiryMaturityDate(termValue);
    if (result) {
      const { maturityDate, maturityDateDisplay } = result;
      setMaturityDate({
        value: maturityDate,
        valueDisplay: maturityDateDisplay,
      });
    } else {
      setMaturityDate('');
    }
    // if (inquiryMaturityDate && termValue) {
    //   const value = await inquiryMaturityDate(termValue);
    //   return value;
    // }
    // return '';
    // const currentDate = dayjs();
    // const maturityDate = currentDate.add(termValue, typeWithUnitLabel[type]);
    // const formattedDate = maturityDate.format(dateFormat);
    // return formattedDate;
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let messageError = '';
    if (termValue) {
      if (max && Number(termValue) > max) {
        messageError = `Please input an amount less than ${max} ${typeWithUnitLabel[type]}`;
      } else if (min && Number(termValue) < min) {
        messageError = `Please input an amount more than ${min} ${typeWithUnitLabel[type]}`;
      }
    }
    if (messageError) {
      setMaturityDate();
    } else {
      getMaturityDate();
    }
    setTermError(messageError);
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
            <span className="select-terms__number">{termValue || `${min || ''}~${max || ''}`}</span>
            <span className="select-terms__unit">{typeWithUnitLabel[type]}</span>
          </div>
          {!!termError && (
            <div className="select-terms__error-alert">
              <span className="error-icon mr-1">
                <ErrorIcon />
              </span>
              <span>{termError}</span>
            </div>
          )}
          <div className="select-terms__options">
            <Chips
              segments={options}
              onChange={onSelectChipTerm}
              value={termValue}
            />
          </div>
          {maturityDate?.valueDisplay && (
            <div className="maturity-date">
              <span>Maturity date</span>
              <span>{maturityDate.valueDisplay}</span>
            </div>
          )}
          <div className="btn-submit__wrapper">
            <Button
              label="Next"
              variant="filled__primary"
              className="btn-submit"
              onClick={onClickConfirm}
              disable={termError || !termValue}
            />
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

export default SelectTermsBottom;
