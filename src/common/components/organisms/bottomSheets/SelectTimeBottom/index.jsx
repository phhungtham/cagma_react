import { useRef } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import ScrollSelect from '@common/components/molecules/ScrollSelect';
import BottomSheet from '@common/components/templates/BottomSheet';
import { timeTypes } from '@common/constants/selectBottom';
import { PropTypes } from 'prop-types';

import '../bs_styles.scss';

const SelectTimeBottom = ({ open, onClose, title, onTimeChange, defaultTime }) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const valueRef = useRef({});

  const selectedHour = Number(defaultTime?.split(' ')?.[0] || '');
  const selectedType = Number(defaultTime?.split(' ')?.[1] || 'PM');

  const handleConfirmSelectedTime = () => {
    onTimeChange(`${valueRef.current.hour} ${valueRef.current.type}`);
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
          <ScrollSelect
            options={hours}
            defaultValue={open ? selectedHour : selectedHour - 2}
            onChangeValue={value => {
              valueRef.current.hour = value;
            }}
          />

          <ScrollSelect
            options={timeTypes}
            defaultValue={selectedType}
            onChangeValue={value => {
              valueRef.current.type = value;
            }}
          />
        </div>

        <div className="btn_container">
          <Button
            label="Confirm"
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
  title: PropTypes.string,
  onTimeChange: PropTypes.func,
  defaultTime: PropTypes.string,
};

SelectTimeBottom.defaultProps = {
  open: false,
  onClose: () => {},
  title: 'Select Time',
  onTimeChange: () => {},
};

export default SelectTimeBottom;
