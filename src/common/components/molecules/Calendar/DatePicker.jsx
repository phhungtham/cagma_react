import React, { useLayoutEffect, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import { CalendarArrow, CalendarDoubleArrow } from 'assets/icons';
import PropTypes from 'prop-types';
import { convertDateTime } from '@common/utils/formater';
import { useState } from 'react';

import { replaceString } from '@utilities/debitCardUtils';

const DatePicker = ({ minDate, maxDate, onCalendarDateChange, datePicked, defaultActiveDate = new Date() }) => {
  const [valueClicked, setValueClicked] = useState('');
  const navigatetionIcon = {
    nextLabel: <CalendarArrow />,
    next2Label: <CalendarDoubleArrow />,
    prevLabel: <CalendarArrow />,
    prev2Label: <CalendarDoubleArrow />
  };

  const navigatetionProperties = {
    calendarType: 'US',
    showNeighboringMonth: false,
    locale: 'en'
  };

  const calendarRef = useRef(null);

  const handleDateTime = date => {
    const monthPicker = (date.getMonth() + 1).toString();
    const monthLabel = monthPicker < 10 ? '0' + monthPicker : monthPicker;
    const yearLabel = date.getFullYear();
    const dateLabel = date.getDay() + 1;
    return { yearLabel, monthLabel, dateLabel };
  };

  const renderNavigationLabel = ({ date, label, locale, view }) => {
    const { yearLabel, monthLabel, dateLabel } = handleDateTime(date);
    return renderDateTime(yearLabel, monthLabel);
  };

  const handleUpdateNavigationLabel = date => {
    const { yearLabel, monthLabel } = handleDateTime(date);
    const navigationEl = document.getElementsByClassName('navigation__label')[0];
    const labelEl = navigationEl.getElementsByTagName('span');
    //set year value
    labelEl[0].innerHTML = yearLabel;
    //set month value
    labelEl[1].innerHTML = monthLabel;
    handleStyledCalendar();
  };

  const renderDateTime = (year, month) => {
    return (
      <div className="navigation__label">
        <span>{year}</span>
        <span>{month}</span>
      </div>
    );
  };

  const customClassName = ({ date }) => {
    const dateList = replaceString(convertDateTime(date), '.', '');
    if (dateList === datePicked.value) {
      return 'picked';
    }
    if (date.getDay() === 6) {
      return 'react-calendar-weeken-sat';
    }
  };

  const handleStyledCalendar = () => {
    if (!calendarRef.current) return;
    const dateEl = calendarRef.current.getElementsByClassName(
      'react-calendar__tile react-calendar__month-view__days__day'
    )[0];
    const firtElementMarginLeft = dateEl.style.marginLeft;
    if (!firtElementMarginLeft.includes('7px')) {
      // calendarRef.current.style.setProperty('marginLeft', `calc(${firtElementMarginLeft} + 224px)`);
      dateEl.style.marginLeft = `calc(${firtElementMarginLeft} + 7px)`;
      return;
    }
  };

  useLayoutEffect(() => {
    const navigationEl = document.getElementsByClassName('react-calendar__navigation__label')[0];
    const elClone = navigationEl.cloneNode(true);
    navigationEl.parentNode.replaceChild(elClone, navigationEl);
    handleStyledCalendar();
  }, []);

  return (
    <section ref={calendarRef}>
      <Calendar
        {...navigatetionIcon}
        {...navigatetionProperties}
        defaultActiveStartDate={defaultActiveDate}
        navigationLabel={renderNavigationLabel}
        onActiveStartDateChange={({ action, activeStartDate, value, view }) =>
          handleUpdateNavigationLabel(activeStartDate)
        }
        onChange={(value, event) => onCalendarDateChange(value)}
        tileClassName={customClassName}
      />
    </section>
  );
};

DatePicker.propTypes = {
  getValue: PropTypes.any,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  defaultActiveDate: PropTypes.any,
  onCalendarDateChange: PropTypes.func
};

DatePicker.defaultProps = {
  minDate: '',
  maxDate: '',
  defaultActiveDate: null,
  onActiveStartDateChange: () => {}
};

export default DatePicker;
