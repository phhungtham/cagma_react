import { PropTypes } from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import BottomSheet from '@common/components/templates/BottomSheet';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';

import { itemHeight, timeTypes } from '@common/constants/selectBottom';

import '../bs_styles.scss';

const SelectTimeBottom = ({ open, onClose, title, onTimeChange, defaultTime }) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const [currentHour, setCurrentHour] = useState(new Date().getHours() % 12 || 12);
  const [currentType, setCurrentType] = useState(new Date().getHours() > 12 ? 'PM' : 'AM');

  const onChangeHour = (month) => {
    setCurrentHour(month);
  };

  const onChangeType = (year) => {
    setCurrentType(year);
  };

  const scrollHourViewRef = useRef(null);
  const scrollTypeViewRef = useRef(null);

  const scrollToHour = (month) => {
    if (scrollHourViewRef.current) {
      scrollHourViewRef.current.scrollTop = itemHeight * month;
    }

    onChangeHour(month);
  };

  const scrollToType = (type) => {
    const newIdx = timeTypes.findIndex((item) => item === type);

    if (scrollTypeViewRef.current && newIdx > -1) {
      scrollTypeViewRef.current.scrollTop = itemHeight * newIdx;
    }

    onChangeType(type);
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

  const handleScrollHourEnd = debounce((month) => {
    scrollToHour(month);
  }, 500);

  const handleScrollTypeEnd = debounce((year) => {
    scrollToType(year);
  }, 500);

  const handleConfirmSelectedTime = () => {
    onTimeChange(`${currentHour + 1} ${currentType}`);
  };

  useEffect(() => {
    if (scrollHourViewRef.current) {
      // init scroll - scroll to current time when component mounted 
      scrollToHour(currentHour);

      // handle to update time when scrolling
      const handleHourScroll = () => {
        const scrollPosition = scrollHourViewRef.current.scrollTop;
        const newHour = Math.round(scrollPosition / itemHeight);
        onChangeHour(newHour);
        handleScrollHourEnd(newHour);
      };

      scrollHourViewRef.current.addEventListener('scroll', handleHourScroll);

      return () => {
        scrollHourViewRef.current.removeEventListener('scroll', handleHourScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (scrollTypeViewRef.current) {
      // init scroll - scroll to current type when component mounted 
      scrollToType(currentType);

      // handle to update type when scrolling
      const handleTypeScroll = () => {
        const scrollPosition = scrollTypeViewRef.current.scrollTop;
        const newType = timeTypes[Math.round(scrollPosition / itemHeight)];
        onChangeType(newType);
        handleScrollTypeEnd(newType);
      };

      scrollTypeViewRef.current.addEventListener('scroll', handleTypeScroll);

      return () => {
        scrollTypeViewRef.current.removeEventListener('scroll', handleTypeScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof defaultTime === 'string') {
      const hour = defaultTime?.split(' ')?.[0];
      const type = defaultTime?.split(' ')?.[1];

      if (timeTypes.includes(type) && Number(hour) > 0 && Number(hour) < 13) {
        setCurrentHour(hour - 1);
        setCurrentType(type);
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
        <div className='select_wrapper'>
          <div ref={scrollHourViewRef} className='select_item_wrapper'>
            {hours.map((item, idx) => (
              <div key={`month - ${item}`}
                className={`select_item ${currentHour === idx ? 'selected' : ''} ${currentHour - idx === 2 ? 'rotateTop' : (idx - currentHour) === 2 ? 'rotateBottom' : ''}`}
                onClick={() => scrollToHour(idx)}>
                {currentHour - idx === 2 && <div className='top_gradient' />}
                {idx - currentHour === 2 && <div className='bot_gradient' />}
                <span>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div ref={scrollTypeViewRef} className='select_item_wrapper'>
            {timeTypes.map((item) => (
              <div key={`year - ${item} `}
                className={`select_item ${currentType === item ? 'selected' : ''}`}
                onClick={() => scrollToType(item)}>
                <span>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="btn_container">
          <Button label="Confirm" variant="filled__primary" className="w_full" onClick={handleConfirmSelectedTime} />
        </div>
      </div>

    </BottomSheet >
  );
};

SelectTimeBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onTimeChange: PropTypes.func,
  defaultTime: PropTypes.string,

};

SelectTimeBottom.defaultProps = {
  open: false,
  onClose: () => { },
  title: 'Select Time',
  onTimeChange: () => { },
};

export default SelectTimeBottom;