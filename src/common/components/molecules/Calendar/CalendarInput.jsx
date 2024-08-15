import { convertDateTime } from '@common/utils/formater';
// import { setIsShowCalendar } from '@components/VisaCard/redux/action';
// import { debitCardReducer } from '@components/VisaCard/redux/reducer';
// import { showCalendarSelector } from '@components/VisaCard/redux/selector';
// import { FeatureDebitCardName } from '@components/VisaCard/redux/type';
import useReducers from '@hooks/useReducers';
import { addDateWithMonth, getCurrentDate } from '@utilities/dateTimeUtils';
import { replaceString } from '@utilities/debitCardUtils';
import { CalendarIcon } from 'assets/icons';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from './DatePicker';

const CalendarInput = ({ clazz, inputType, disabled, onDateChange, isHideCalendar, isReset }) => {
  // useReducers([{ key: FeatureDebitCardName, reducer: debitCardReducer }]);
  const defaultDateRange = {
    startDateString: '',
    startDate: new Date(),
    endDateString: '',
    endDate: new Date()
  };
  // const isShowCalendar = useSelector(showCalendarSelector);
  const isShowCalendar = true;
  const [dateType, setDateType] = useState(null);
  const [datePicked, setDatePicked] = useState({
    type: '',
    value: ''
  });
  const [dateRange, setDateRange] = useState(defaultDateRange);
  const currentDate = getCurrentDate('DD.MM.YYYY');
  const lastSixMonthDate = addDateWithMonth(6, '.', 'DDMMYYYY');
  const inputStartRef = useRef(null);
  const inputEndRef = useRef(null);
  const dataTypeRef = useRef(null);
  const handleToggleCalendar = type => {
    dataTypeRef.current = type;
    if (isShowCalendar) {
      // setIsShowCalendar(false);
    } else {
      setDateType(type);
      // setIsShowCalendar(true);
    }
    // if (inputType === 'keyboard') handleFocusInput(type);
  };
  const handleSelectDate = date => {
    const dateFormatted = convertDateTime(date);
    if (dateType === 'startDate') {
      setDateRange({ ...dateRange, startDate: date, startDateString: dateFormatted });
    } else if (dateType === 'endDate') {
      setDateRange({ ...dateRange, endDate: date, endDateString: dateFormatted });
    }
    handleToggleCalendar(dateType);
    // setIsShowCalendar(false);
  };

  const handleFocusInput = inputType => {
    dataTypeRef.current = inputType;
    if (inputType === 'startDate') {
      inputStartRef.current.focus();
      inputStartRef.current.value = dateRange.startDateString;
    } else if (inputType === 'endDate') {
      inputEndRef.current.focus();
      inputEndRef.current.value = dateRange.endDateString;
    }
  };

  const handleChangeInput = e => {
    if (!dataTypeRef.current) return;
    const inputText = e.target.value;
    const inputSlice = (start, end) => {
      return inputText.slice(start, end);
    };
    if (inputText.length > 8) {
      if (dataTypeRef.current === 'startDate') {
        inputStartRef.current.value = inputSlice(0, 8);
      } else if (dataTypeRef.current === 'endDate') {
        inputEndRef.current.value = inputSlice(0, 8);
      }
    } else {
      const dateString = inputSlice(0, 2) ? inputSlice(0, 2) : '';
      const monthString = inputSlice(2, 4) ? `.${inputSlice(2, 4)}` : '';
      const yearString = inputSlice(4, 8) ? `.${inputSlice(4, 8)}` : '';

      const monthF = inputSlice(2, 4) ? `${inputSlice(2, 4)}` : '';
      const dateF = inputSlice(0, 2) ? `.${inputSlice(0, 2)}` : '';
      const yearF = inputSlice(4, 8) ? `.${inputSlice(4, 8)}` : '';

      const dateValue = dateString + monthString + yearString;
      const dateFormat = monthF + dateF + yearF;
      if (dataTypeRef.current === 'startDate') {
        setDateRange({ ...dateRange, startDate: new Date(dateFormat), startDateString: dateValue });
      } else if (dataTypeRef.current === 'endDate') {
        setDateRange({ ...dateRange, endDate: new Date(dateFormat), endDateString: dateValue });
      }
    }
  };

  const isInputComplete = () => {
    if (
      (dateRange.startDateString.length === 10 && dateRange.endDateString.length === 10) ||
      (currentDate.length === 10 && lastSixMonthDate.length === 10)
    )
      return true;
    return false;
  };

  const checkValidDate = dateParam => {
    if (!isNaN(dateParam?.getTime())) {
      return dateParam;
    } else {
      return new Date();
    }
  };

  useEffect(() => {
    onDateChange(dateRange);
  }, [dateRange]);

  useEffect(() => {
    if (isHideCalendar) {
      // setIsShowCalendar(false);
    }
  }, [isHideCalendar]);

  useEffect(() => {
    if (isReset) {
      setDateRange(defaultDateRange);
    }
  }, [isReset]);

  useEffect(() => {
    if (!dataTypeRef) return;
    if (dataTypeRef.current === 'startDate') {
      const startDay = replaceString(dateRange.startDateString, '.', '') || replaceString(lastSixMonthDate,'.', '');
      setDatePicked({
        type: 'startDate',
        value: startDay
      });
    }
    if (dataTypeRef.current === 'endDate') {
      const endDay = replaceString(dateRange.endDateString,'.', '');
      setDatePicked({
        type: 'endDate',
        value: endDay
      });
    }
  }, [dateRange, isShowCalendar, dataTypeRef]);

  return (
    <div className={`calendar__input ${disabled && 'disabled'} ${clazz}`}>
      <section className={`left__content ${isInputComplete() && 'complete'}`}>
        <div
          className={`calendar__label ${!dateRange.startDateString && !lastSixMonthDate && 'default'}`}
          onClick={() => handleFocusInput('startDate')}
        >
          {dateRange.startDateString || lastSixMonthDate}
        </div>
        {!disabled && (
          <div className="calendar__icon calendar__icon__left" onClick={() => handleToggleCalendar('startDate')}>
            <CalendarIcon />
          </div>
        )}
      </section>
      ~
      <section className={`right__content ${isInputComplete() && 'complete'}`}>
        <div
          className={`calendar__label ${!dateRange.endDateString && !currentDate && 'default'}`}
          onClick={() => handleFocusInput('endDate')}
        >
          {dateRange.endDateString || currentDate}
        </div>
        {!disabled && (
          <div className="calendar__icon calendar__icon__right" onClick={() => handleToggleCalendar('endDate')}>
            <CalendarIcon />
          </div>
        )}
      </section>
      {isShowCalendar && inputType === 'calendar' && (
        <section className="date__picker">
          <DatePicker
            onCalendarDateChange={handleSelectDate}
            datePicked={datePicked}
            defaultActiveDate={checkValidDate(dateRange[dateType])}
          />
        </section>
      )}
      <section className="visible__input">
        <input
          disabled={disabled}
          type="number"
          inputMode="numeric"
          maxLength={10}
          ref={inputStartRef}
          onChange={handleChangeInput}
        />
        <input
          disabled={disabled}
          type="number"
          inputMode="numeric"
          maxLength={10}
          ref={inputEndRef}
          onChange={handleChangeInput}
        />
      </section>
    </div>
  );
};

CalendarInput.propTypes = {
  inputType: PropTypes.oneOf(['calendar', 'keyboard']),
  disabled: PropTypes.bool
};

CalendarInput.defaultProps = {
  inputType: 'keyboard',
  disabled: false
};

export default CalendarInput;
