import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import BottomSheet from '@common/components/templates/BottomSheet';
import { itemHeight, months, selectType } from '@common/constants/selectBottom';
import { PropTypes } from 'prop-types';

import '../bs_styles.scss';

const SelectDateBottom = ({ open, onClose, title, maxYear, minYear, onDateChange, type, defaultDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const onChangeMonth = month => {
    setCurrentMonth(month);
  };

  const onChangeYear = year => {
    setCurrentYear(year);
  };

  const scrollMonthViewRef = useRef(null);
  const scrollYearViewRef = useRef(null);

  //create year list from min date and max date
  const years = Array.from({ length: Number(maxYear) - Number(minYear) + 1 }, (_, i) => i + Number(minYear));

  const scrollToMonth = month => {
    if (scrollMonthViewRef.current) {
      scrollMonthViewRef.current.scrollTop = itemHeight * month;
    }

    onChangeMonth(month);
  };

  const scrollToYear = year => {
    if (scrollYearViewRef.current) {
      scrollYearViewRef.current.scrollTop = itemHeight * (year - minYear);
    }

    onChangeYear(year);
  };

  // func to debounce behavior scroll back to correct offset after user scroll
  const debounce = (func, delay) => {
    let timeout;

    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleScrollMonthEnd = debounce(month => {
    scrollToMonth(month);
  }, 500);

  const handleScrollYearEnd = debounce(year => {
    scrollToYear(year);
  }, 500);

  const handleConfirmSelectedDate = () => {
    if (type === selectType.monthYear) {
      onDateChange(`${currentMonth + 1 < 10 ? `0${currentMonth + 1}` : currentMonth + 1}.${currentYear}`);
    } else {
      onDateChange(String(currentYear));
    }
  };

  useEffect(() => {
    if (scrollMonthViewRef.current) {
      // init scroll - scroll to current month when component mounted
      scrollToMonth(currentMonth);

      // handle to update month when scrolling
      const handleScroll = () => {
        const scrollPosition = scrollMonthViewRef.current.scrollTop;
        const newMonth = Math.round(scrollPosition / itemHeight);
        onChangeMonth(newMonth);
        handleScrollMonthEnd(newMonth);
      };

      scrollMonthViewRef.current.addEventListener('scroll', handleScroll);

      return () => {
        scrollMonthViewRef.current.removeEventListener('scroll', handleScroll);
      };
    }
  }, [type]);

  useEffect(() => {
    if (scrollYearViewRef.current) {
      // init scroll - scroll to current year when component mounted
      scrollToYear(currentYear);

      // handle to update year when scrolling
      const handleYearScroll = () => {
        const scrollPosition = scrollYearViewRef.current.scrollTop;
        const newYear = Number(minYear) + Math.round(scrollPosition / itemHeight);
        onChangeYear(newYear);
        handleScrollYearEnd(newYear);
      };

      scrollYearViewRef.current.addEventListener('scroll', handleYearScroll);

      return () => {
        scrollYearViewRef.current.removeEventListener('scroll', handleYearScroll);
      };
    }
  }, [type]);

  // handle set and scroll to the default date
  useEffect(() => {
    if (type === selectType.year) {
      if (Number(defaultDate) >= minYear && Number(defaultDate) <= maxYear) {
        scrollToYear(Number(defaultDate));
      }
    } else {
      if (typeof defaultDate === 'string') {
        const month = Number(defaultDate?.split('.')?.[0]);
        const year = Number(defaultDate?.split('.')?.[1]);

        if (year >= minYear && year <= maxYear && month > 0 && month < 13) {
          scrollToYear(year);
          scrollToMonth(month - 1);
        }
      }
    }
  }, []);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      clazz="bottom__dropdown__wrapper"
      type="fit-content"
    >
      <div>
        <div className="select_wrapper">
          {type !== selectType.year && (
            <div
              ref={scrollMonthViewRef}
              className="select_item_wrapper"
            >
              {months.map((item, idx) => (
                <div
                  key={`month - ${item}`}
                  className={`select_item ${currentMonth === idx ? 'selected' : ''} ${
                    currentMonth - idx === 2 ? 'rotateTop' : idx - currentMonth === 2 ? 'rotateBottom' : ''
                  }`}
                  onClick={() => scrollToMonth(idx)}
                >
                  {currentMonth - idx === 2 && <div className="top_gradient" />}
                  {idx - currentMonth === 2 && <div className="bot_gradient" />}
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
          <div
            ref={scrollYearViewRef}
            className="select_item_wrapper"
          >
            {years.map(item => (
              <div
                key={`year - ${item} `}
                className={`select_item ${currentYear === item ? 'selected' : ''} ${
                  currentYear - item === 2 ? 'rotateTop' : item - currentYear === 2 ? 'rotateBottom' : ''
                } `}
                onClick={() => scrollToYear(item)}
              >
                {currentYear - item === 2 && <div className="top_gradient" />}
                {item - currentYear === 2 && <div className="bot_gradient" />}
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="btn_container">
          <Button
            label="Confirm"
            variant="filled__primary"
            className="w_full"
            onClick={handleConfirmSelectedDate}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

SelectDateBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  maxYear: PropTypes.string.isRequired,
  minYear: PropTypes.string.isRequired,
  onDateChange: PropTypes.func,
  type: PropTypes.string,
  defaultDate: PropTypes.string,
};

SelectDateBottom.defaultProps = {
  open: false,
  onClose: () => {},
  title: 'Select Date',
  onDateChange: () => {},
  maxYear: '2040',
  minYear: '2000',
  type: selectType.monthYear,
};

export default SelectDateBottom;
