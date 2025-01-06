import { useRef } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import ScrollSelect from '@common/components/atoms/ScrollSelect';
import BottomSheet from '@common/components/templates/BottomSheet';
import { months, selectType } from '@common/constants/dateTime';
import { ctaLabels } from '@common/constants/labels';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { PropTypes } from 'prop-types';

import '../bs_styles.scss';

const SelectDateBottom = ({
  open,
  onClose,
  title,
  maxYear,
  minYear,
  onDateChange,
  type,
  defaultDate,
  translate: t,
}) => {
  const selectedMonth = Number(defaultDate?.split('.')?.[0] || '');
  const selectedYear = Number(type === selectType.year ? defaultDate : defaultDate?.split('.')?.[1]);

  const valueRef = useRef({});

  //create year list from min date and max date
  const years = Array.from({ length: Number(maxYear) - Number(minYear) + 1 }, (_, i) => i + Number(minYear));

  const handleConfirmSelectedDate = () => {
    const currentYear = valueRef.current.year;

    if (type === selectType.year) {
      onDateChange(String(currentYear));
    } else {
      const currentMonth = Number(valueRef.current.month);
      onDateChange(`${currentMonth < 10 ? '0' + currentMonth : currentMonth}.${currentYear}`);
    }
  };

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
            <ScrollSelect
              options={months}
              defaultValue={open ? selectedMonth : selectedMonth - 2}
              onChangeValue={value => {
                valueRef.current.month = value;
              }}
            />
          )}

          <ScrollSelect
            options={years}
            defaultValue={open ? selectedYear : selectedYear - 2}
            onChangeValue={value => {
              valueRef.current.year = value;
            }}
          />
        </div>

        <div className="btn_container">
          <Button
            label={t(ctaLabels.confirm)}
            variant="filled__primary"
            className="w-full"
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

export default withHTMLParseI18n(SelectDateBottom);
