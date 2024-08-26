import { useState } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import BottomSheet from '@common/components/templates/BottomSheet';

import { eAlertSettingMethodOptions } from '../constants';
import './styles.scss';

const CustomerInfoChangeBottom = ({ onClose, onSubmit }) => {
  const [checkedOptions, setCheckedOptions] = useState([]);

  const handleCheckOption = (value, checked) => {
    if (checked) {
      setCheckedOptions([...checkedOptions, value]);
    } else {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    }
  };

  const onClickReset = () => {};

  const onClickApply = () => {
    onSubmit(checkedOptions);
  };

  return (
    <BottomSheet
      open
      onClose={onClose}
      title="Customer information changes"
      clazz="customer-info-change__wrapper"
      type="fit-content"
    >
      <div className="customer-info__content">
        <div className="title">Methods</div>
        <div className="checklist___options">
          {eAlertSettingMethodOptions.map(({ label, value }) => (
            <div
              className="option-item"
              key={value}
            >
              <CheckBox
                size="large"
                label={label}
                onChange={checked => handleCheckOption(value, checked)}
                checked={checkedOptions.includes(value)}
              />
            </div>
          ))}
        </div>
        <div className="btn__ctas">
          <Button
            variant="filled__secondary-blue"
            label="Reset"
            className="flex-3"
            onClick={onClickReset}
          />
          <Button
            variant="filled__primary"
            label="Apply"
            className="flex-7"
            onClick={onClickApply}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default CustomerInfoChangeBottom;
