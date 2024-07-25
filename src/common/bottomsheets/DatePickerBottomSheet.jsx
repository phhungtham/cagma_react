import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import MonthPicker from '@common/ui/components/atomic/Calendar/MonthPicker';
import { convertDateToMMYYYY } from '@utilities/dateTimeUtils';
import { backEventSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const DatePickerBottomSheet = ({ open, onClose, recentDatePick, yearList, applyDatePicked, translate }) => {
  const [dateTimeDisplay, setDateTimeDisplay] = useState({});
  const yearPicked = useRef(null);
  const monthPicked = useRef(null);
  const isNativeBack = useSelector(backEventSelector || false);

  const handleGetYearAndMonth = () => {
    let customData = {};
    Object.keys(yearList).forEach((year, index) => {
      const yearString = `${year}`.slice(0, 4);
      const monthString = `${year}`.slice(4, 6);
      if (customData[yearString] === undefined) {
        customData[yearString] = [];
      }
      customData[yearString].push(monthString);
    });
    if (Object.keys(customData).length === 0) {
      const currentDate = new Date();
      const currentYearString = currentDate.getFullYear();
      const currentMonthString = currentDate.getMonth() + 1;
      customData[currentYearString] = [`${currentMonthString}`];
    }
    setDateTimeDisplay(customData);
  };

  const setYearPicked = year => {
    yearPicked.current = year;
  };
  const setMonthPicked = month => {
    monthPicked.current = +month + 1;
  };

  useEffect(() => {
    handleGetYearAndMonth();
  }, [yearList]);

  return (
    <section className="month__picker__bottomsheet">
      <BottomSheet open={open} onClose={onClose} type="fit-content" title={translate('lbl_com_3082')}>
        <MonthPicker
          recentDatePick={convertDateToMMYYYY(recentDatePick)}
          calendarDirection="vertical"
          dateTimeDisplay={dateTimeDisplay}
          getYearPicked={setYearPicked}
          getMonthPicked={setMonthPicked}
        />
        <section className="month__picker__bottomsheet__button">
          <Button
            onClick={() => applyDatePicked(monthPicked.current, yearPicked.current)}
            label={translate('lbl_cta_3009')}
            className="bottomsheet__button"
          />
        </section>
      </BottomSheet>
    </section>
  );
};

export default withHTMLParseI18n(DatePickerBottomSheet);
