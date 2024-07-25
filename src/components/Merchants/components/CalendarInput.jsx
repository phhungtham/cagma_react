import { convertDateTime } from '@common/utils/formater';
import { setIsShowCalendar } from '@components/Merchants/redux/action';
import { showCalendarSelector } from '@components/Merchants/redux/selector';
import { FeatureMerchantName } from '@components/Merchants/redux/type';
import useReducers from '@hooks/useReducers';
import { replaceString } from '@utilities/debitCardUtils';
import { appGlobalReducer } from 'app/redux/reducer';
import { nativeParamsSelector } from 'app/redux/selector';
import { APP_GLOBAL } from 'app/redux/type';
import { CalendarIcon } from 'assets/icons';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { myMerchantReducer } from '../redux/reducer';
import { transactionSelector } from '../redux/selector';
import DatePicker from './DatePicker';

const CalendarInput = ({
  clazz,
  inputType,
  disabled,
  dateRange,
  onDateChange,
  setDateRange,
  isHideCalendar,
  isReset,
  filterDate
}) => {
  useReducers([
    { key: FeatureMerchantName, reducer: myMerchantReducer },
    { key: APP_GLOBAL, reducer: appGlobalReducer }
  ]);

  const handleTimeValue = time => {
    if (time < 10) {
      return `0${time}`;
    }
    return time;
  };

  const getCurrentDate = format => {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = handleTimeValue(currentDate.getMonth() + 1);
    let currentDay = handleTimeValue(currentDate.getDate());

    switch (format) {
      case 'DD.MM.YYYY':
        return `${currentDay}.${currentMonth}.${currentYear}`;
      default:
        break;
    }
  };

  const getLastMonthDate = format => {
    const now = new Date();
    let currentDate = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
    let currentYear = currentDate.getFullYear();
    let currentMonth = handleTimeValue(currentDate.getMonth() + 1);
    let currentDay = handleTimeValue(currentDate.getDate());

    switch (format) {
      case 'DD.MM.YYYY':
        return `${currentDay}.${currentMonth}.${currentYear}`;
      default:
        break;
    }
  };
  const getLastYearDate = format => {
    const now = new Date();
    let currentDate = new Date(now.getTime() - 364 * 24 * 60 * 60 * 1000);
    let currentYear = currentDate.getFullYear();
    let currentMonth = handleTimeValue(currentDate.getMonth() + 1);
    let currentDay = handleTimeValue(currentDate.getDate());

    switch (format) {
      case 'DD.MM.YYYY':
        return `${currentDay}.${currentMonth}.${currentYear}`;
      default:
        break;
    }
  };
  const nativeParams = useSelector(nativeParamsSelector);
  const currentDate = getCurrentDate('DD.MM.YYYY');
  const inputStartRef = useRef(null);
  const inputEndRef = useRef(null);
  const dataTypeRef = useRef(null);

  const isShowCalendar = useSelector(showCalendarSelector);
  const [dateType, setDateType] = useState(null);
  const [datePicked, setDatePicked] = useState({
    type: '',
    value: ''
  });
  const handleToggleCalendar = type => {
    dataTypeRef.current = type;
    if (isShowCalendar) {
      setIsShowCalendar(false);
    } else {
      setDateType(type);
      setIsShowCalendar(true);
    }
  };
  const handleSelectDate = date => {
    let newDateRange = {};
    const today = new Date();
    const dateFormatted = convertDateTime(date);
    let range = 0;
    if (filterDate === 'weekly') {
      range = 6 * 24 * 60 * 60 * 1000;
    } else if (filterDate === 'monthly') {
      range = 29 * 24 * 60 * 60 * 1000;
    } else {
      range = 364 * 24 * 60 * 60 * 1000;
    }
    if (date > today) {
      setIsShowCalendar(false);
      return;
    } else
      switch (dateType) {
        case 'endDate':
          const startDateValue = new Date(date.getTime() - range);
          newDateRange = {
            startDate: startDateValue,
            startDateString: convertDateTime(startDateValue),
            endDate: date,
            endDateString: dateFormatted
          };
          break;
        default:
          let enDateValue = new Date(date.getTime() + range);
          if (enDateValue >= today) {
            enDateValue = today;
          }
          newDateRange = {
            startDate: date,
            startDateString: dateFormatted,
            endDate: enDateValue,
            endDateString: convertDateTime(enDateValue)
          };
          break;
      }
    setDateRange(newDateRange);
    handleToggleCalendar(dateType);
    setIsShowCalendar(false);
  };

  // const handleFocusInput = inputType => {
  //   dataTypeRef.current = inputType;
  //   if (inputType === 'startDate') {
  //     inputStartRef.current.focus();
  //     inputStartRef.current.value = dateRange.startDateString;
  //   } else if (inputType === 'endDate') {
  //     inputEndRef.current.focus();
  //     inputEndRef.current.value = dateRange.endDateString;
  //   }
  // };

  const isInputComplete = () => {
    // if (
    //   (dateRange.startDateString.length === 10 && dateRange.endDateString.length === 10) ||
    //   (currentDate.length === 10 && lastWeekDate.length === 10)
    // )
    //   return true;
    return false;
  };

  const checkValidDate = dateParam => {
    if (!isNaN(dateParam?.getTime())) {
      return dateParam;
    } else {
      return new Date();
    }
  };

  function rearrangeStringInput(inputString) {
    if (inputString.length !== 8) {
      return inputString;
    }

    const part1 = inputString.slice(4);
    const part2 = inputString.slice(0, 4);

    return part1 + part2;
  }

  useEffect(() => {
    let today = new Date();
    let range = 0;
    if (filterDate === 'weekly') {
      range = 6 * 24 * 60 * 60 * 1000;
    } else if (filterDate === 'monthly') {
      range = 29 * 24 * 60 * 60 * 1000;
    } else {
      range = 364 * 24 * 60 * 60 * 1000;
    }
    let startDateValue = new Date(dateRange.endDate.getTime() - range);
    const newDateRange = {
      ...dateRange,
      startDate: startDateValue,
      startDateString: convertDateTime(startDateValue)
    };
    setDateRange(newDateRange);
  }, [filterDate]);

  useEffect(() => {
    if (isHideCalendar) {
      setIsShowCalendar(false);
    }
  }, [isHideCalendar]);

  useEffect(() => {
    const endDay = replaceString(dateRange.endDateString, '.', '');
    const startDay = replaceString(dateRange.startDateString, '.', '');
    if (dateType === 'endDate') {
      setDatePicked({
        type: 'endDate',
        value: endDay
      });
    } else {
      setDatePicked({
        type: 'startDate',
        value: startDay
      });
    }
  }, [isShowCalendar]);

  // console.log(transactions);
  // const defaultStartDate = () => {
  //   if (filterDate === 'weekly') return lastWeekDate;
  //   else if (filterDate === 'monthly') return lastMonthDate;
  //   else if (filterDate === 'yearly') return lastYearDate;
  // };
  return (
    <div className={`calendar__input ${disabled && 'disabled'} ${clazz}`}>
      <section className={`left__content ${isInputComplete() && 'complete'}`}>
        <div
          className={`calendar__label ${!dateRange.startDateString && 'default'}`}
          onClick={() => handleToggleCalendar('startDate')}
        >
          {dateRange.startDateString}
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
          className={`calendar__label ${!dateRange.endDateString && 'default'}`}
          onClick={() => handleToggleCalendar('endDate')}
        >
          {dateRange.endDateString}
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
            maxDate={new Date()}
            onCalendarDateChange={handleSelectDate}
            datePicked={datePicked}
            defaultActiveDate={checkValidDate(dateRange[dateType])}
          />
        </section>
      )}
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
