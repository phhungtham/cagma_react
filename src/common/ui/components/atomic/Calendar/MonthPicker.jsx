import { CalendarArrow } from 'assets/icons';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const MonthPicker = ({ calendarDirection, dateTimeDisplay, recentDatePick, getYearPicked, getMonthPicked, translate }) => {

  const currentDateTime = new Date();
  const currentYear = +currentDateTime.getFullYear();
  const currentMonth = +currentDateTime.getMonth();

  const [yearHighlight, setYearHighlight] = useState(null);
  const [monthHighlight, setMonthHighlight] = useState(null);

  const [years, setYears] = useState({});
  const [months, setMonths] = useState({});

  const [yearDataDisplay, setYearDataDisplay] = useState([]);
  const [monthDataDisplay, setMonthDataDisplay] = useState([]);

  const customClass = `month__picker__${calendarDirection}`;

  const [dateTime, setDateTime] = useState({ yearShowed: currentYear, monthShowed: null });

  const MONTHS_TRANSLATED = [
    translate('lbl_com_3083'),
    translate('lbl_com_3084'),
    translate('lbl_com_3085'),
    translate('lbl_com_3086'),
    translate('lbl_com_3087'),
    translate('lbl_com_3088'),
    translate('lbl_com_3089'),
    translate('lbl_com_3090'),
    translate('lbl_com_3091'),
    translate('lbl_com_3092'),
    translate('lbl_com_3093'),
    translate('lbl_com_3094')
  ];

  const yearRef = useRef(null);
  const yearChildOffsetTops = useRef({});
  const monthRef = useRef(null);
  const monthChildOffsetTops = useRef({});

  const handleChangeYear = (action, year) => {
    let yearShowed = year || dateTime.yearShowed;
    if (action === 'next') {
      yearShowed = yearShowed + 1;
    } else if (action === 'prev') {
      yearShowed = yearShowed - 1;
    }
    setDateTime({ ...dateTime, yearShowed: yearShowed });
  };

  const handlePickMonth = month => {
    setDateTime({ ...dateTime, monthShowed: month });
  };

  const getYearElementOffetTop = () => {
    //get all Year offetTop
    const yearEls = yearRef.current.getElementsByClassName('year');
    const yearOffetTop = yearRef.current.offsetTop;
    let yearObject = {};
    [...yearEls].forEach(el => {
      yearObject[el.innerHTML] = el.offsetTop - yearOffetTop;
    });
    return { elHeight: [...yearEls][0]?.offsetHeight, els: yearObject };
  };

  const getMonthElementOffetTop = () => {
    //get all Month offetTop
    const monthEls = monthRef.current.getElementsByClassName('month');
    const monthOffTop = monthRef.current.offsetTop;
    let monthObject = {};
    [...monthEls].forEach(el => {
      monthObject[MONTHS_TRANSLATED.indexOf(el.innerHTML)] = el.offsetTop - monthOffTop;
    });
    return { elHeight: [...monthEls][0]?.offsetHeight, els: monthObject };
  };

  const handleYearScroll = () => {
    const yearScrollTop = yearRef.current.scrollTop;
    const centerPosition = yearChildOffsetTops.current.elHeight * 2 + yearScrollTop;
    if (years?.els) {
      Object.keys(years?.els).forEach(key => {
        const itemYear = years?.els[key];
        if (itemYear <= centerPosition + 2 && itemYear >= centerPosition - 2 && key !== yearHighlight) {
          setYearHighlight(key);
          // getYearPicked(key);
          setMonthDataDisplay(dateTimeDisplay[key]);
          setMonthHighlight(+dateTimeDisplay[key][0] - 1);
        }
      });
    }
  };
  const handleMonthScroll = () => {
    const monthScrollTop = monthRef.current.scrollTop;
    const centerPosition = monthChildOffsetTops.current.elHeight * 3 + monthScrollTop;
    if (months?.els) {
      Object.keys(months?.els).forEach(key => {
        const itemMonth = months?.els[key];
        if (itemMonth <= centerPosition + 15 && itemMonth >= centerPosition - 15 && key !== monthHighlight) {
          setMonthHighlight(key);
          // getMonthPicked(key);
        }
      });
    }
  };

  const checkYearScroll = itemYear => {
    if (!years?.els) return;
    const checker = yearHighlight === itemYear;
    return `${years?.els && checker && 'picked'}`;
  };

  const checkMonthScroll = itemMonth => {
    if (!months?.els) return;
    const checker = monthHighlight === +itemMonth - 1;
    return `${itemMonth && checker && 'picked'}`;
  };

  const handleGetYear = dateTimes => {
    if (!dateTimes || Object.keys(dateTimes).length < 0) return;
    const resultYears = Object.keys(dateTimes).map(date => {
      return date;
    });
    if (resultYears.join() !== yearDataDisplay.join()) {
      setYearDataDisplay(resultYears);
    }
  };

  const autoScrollYear = (yearsRef, initialYear) => {
    //auto scroll for the first time
    if (!yearsRef) return;
    const yearString = initialYear.slice(3, 7);
    const refPosition = yearsRef?.els[yearString];
    const refHeight = yearsRef?.elHeight;
    const topRef = refPosition - (refHeight + 8) * 2;
    if (dateTimeDisplay[yearString]) {
      setMonthDataDisplay(dateTimeDisplay[yearString]);
    }
    setYearHighlight(yearString);
    yearRef.current.scrollTo(0, topRef > 0 ? topRef : 0);
  };

  const autoScrollMonth = (monthsRef, initialMonth) => {
    if (!monthsRef) return;
    //inital date time from header action
    const monthsString = initialMonth.slice(0, 2);
    const refPosition = monthsRef?.els[+monthsString - 1];
    const refHeight = monthsRef?.elHeight;
    const topRef = refPosition - (refHeight + 16) * 2;
    if (refPosition) {
      monthRef.current.scrollTo(0, topRef > 0 ? topRef : 0);
      setMonthHighlight(monthsString - 1);
    }
  };

  useLayoutEffect(() => {
    if (!recentDatePick) return;
    yearChildOffsetTops.current = getYearElementOffetTop();
    if (yearChildOffsetTops.current) {
      setYears(yearChildOffsetTops.current);
      autoScrollYear(yearChildOffsetTops.current, recentDatePick);
    }
  }, [yearDataDisplay, recentDatePick]);

  useLayoutEffect(() => {
    if (!recentDatePick) return;
    monthChildOffsetTops.current = getMonthElementOffetTop();
    if (monthChildOffsetTops.current) {
      setMonths(monthChildOffsetTops.current);
      autoScrollMonth(monthChildOffsetTops.current, recentDatePick);
    }
  }, [monthDataDisplay, recentDatePick]);

  useEffect(() => {
    handleGetYear(dateTimeDisplay);
  }, [dateTimeDisplay]);

  useEffect(() => {
    getMonthPicked(monthHighlight);
  }, [monthHighlight]);

  useEffect(() => {
    getYearPicked(yearHighlight);
  }, [yearHighlight]);

  const renderHorizonCalendar = () => {
    return (
      <div className={customClass}>
        <section className={`${customClass}__year`}>
          <div className="prev__arrow" onClick={() => handleChangeYear('prev')}>
            <CalendarArrow />
          </div>
          <div className="year__label">{dateTime.yearShowed}</div>
          <div className="next__arrow" onClick={() => handleChangeYear('next')}>
            <CalendarArrow />
          </div>
        </section>
        <section className={`${customClass}__months`}>
          {MONTHS_TRANSLATED.map((month, index) => (
            <div
              key={month}
              className={`month ${
                dateTime.yearShowed === currentYear &&
                currentMonth === index &&
                dateTime.monthShowed !== index &&
                'current__month'
              } ${dateTime.monthShowed === index && 'month__picked'}`}
              onClick={() => handlePickMonth(index)}
            >
              {month}
            </div>
          ))}
        </section>
      </div>
    );
  };

  const renderYearVertical = useMemo(() => {
    return yearDataDisplay.map((item, index) => {
      return (
        <div
          key={index + item}
          onClick={() => handleChangeYear(null, item)}
          className={`year ${checkYearScroll(item)} ${item}`}
        >
          {item}
        </div>
      );
    });
  }, [yearDataDisplay, yearHighlight]);

  const renderMonthVertical = useMemo(() => {
    return monthDataDisplay.map((month, index) => (
      <div
        key={index + month}
        onClick={() => handlePickMonth(index)}
        className={`month ${checkMonthScroll(month)} ${month} ${monthDataDisplay.length === 1 && 'one__month'}`}
      >
        {MONTHS_TRANSLATED[+month - 1]}
      </div>
    ));
  }, [monthDataDisplay, yearHighlight, monthHighlight, yearDataDisplay, dateTimeDisplay, recentDatePick]);

  const renderVerticalCalendar = () => {
    return (
      <div className={customClass}>
        <section className={`${customClass}__months`} ref={monthRef} onScroll={handleMonthScroll}>
          <div className="month -2"></div>
          <div className="month -1"></div>
          {renderMonthVertical}
          <div className="month"></div>
          <div className="month"></div>
        </section>
        <section className="slide__line"></section>
        <section className={`${customClass}__year`} ref={yearRef} onScroll={handleYearScroll}>
          <div className="year"></div>
          <div className="year"></div>
          {renderYearVertical}
          <div className="year"></div>
          <div className="year"></div>
        </section>
      </div>
    );
  };

  return calendarDirection === 'horizon' ? renderHorizonCalendar() : renderVerticalCalendar();
};

MonthPicker.propTypes = {
  calendarDirection: PropTypes.oneOf(['vertical', 'horizon'])
};

MonthPicker.defaultProps = {
  calendarDirection: 'horizon'
};

export default withHTMLParseI18n(MonthPicker);
