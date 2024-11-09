import { useRef } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import ScrollSelect from '@common/components/atoms/ScrollSelect';
import BottomSheet from '@common/components/templates/BottomSheet';
import { hoursShortOptions, timeTypes } from '@common/constants/dateTime';
import { commonLabels, ctaLabels } from '@common/constants/labels';
import { appendZeroToTime } from '@utilities/dateTimeUtils';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { PropTypes } from 'prop-types';

import '../bs_styles.scss';

const SelectTimeBottom = ({
  open,
  onClose,
  onTimeChange,
  defaultTime,
  hourOptions = hoursShortOptions,
  minuteOptions = timeTypes,
  translate: t,
}) => {
  const valueRef = useRef({});

  const selectedHour = Number(defaultTime?.split(' ')?.[0] || hourOptions[0]);
  const selectedMinute = Number(defaultTime?.split(' ')?.[1] || minuteOptions[0]);

  const handleConfirmSelectedTime = () => {
    const formattedHour = appendZeroToTime(valueRef.current.hour);
    onTimeChange(`${formattedHour} ${valueRef.current.minute}`);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t(commonLabels.selectTime)}
      clazz="bottom__dropdown__wrapper"
      type="fit-content"
    >
      <div>
        <div className="select_wrapper">
          <ScrollSelect
            options={hourOptions}
            defaultValue={open ? selectedHour : selectedHour - 2}
            onChangeValue={value => {
              valueRef.current.hour = value;
            }}
          />

          <ScrollSelect
            options={minuteOptions}
            defaultValue={selectedMinute}
            onChangeValue={value => {
              valueRef.current.minute = value;
            }}
          />
        </div>

        <div className="btn_container">
          <Button
            label={t(ctaLabels.confirm)}
            variant="filled__primary"
            className="w-full"
            onClick={handleConfirmSelectedTime}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

SelectTimeBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onTimeChange: PropTypes.func,
  defaultTime: PropTypes.string,
  hourOptions: PropTypes.array,
  minuteOptions: PropTypes.array,
};

SelectTimeBottom.defaultProps = {
  open: false,
  onClose: () => {},
  onTimeChange: () => {},
  hourOptions: [],
  minuteOptions: [],
};

export default withHTMLParseI18n(SelectTimeBottom);
