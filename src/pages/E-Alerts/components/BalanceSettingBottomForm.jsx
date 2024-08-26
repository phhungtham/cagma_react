import { useState } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import Input from '@common/components/atoms/Input/Input';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';

import { eAlertSettingMethodOptions } from '../constants';

const BalanceSettingBottomForm = ({ description, balanceOptions }) => {
  const [selectedAmountOption, setSelectedAmountOption] = useState();
  const [checkedOptions, setCheckedOptions] = useState([]);

  const onChangeAmountOption = value => {
    setSelectedAmountOption(value);
  };

  const onClickApply = () => {
    //TODO: Get form value
  };

  const onClickReset = () => {};

  const onChangeMethod = (value, checked) => {
    if (checked) {
      setCheckedOptions([...checkedOptions, value]);
    } else {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    }
  };

  return (
    <div className="balance-setting__content">
      <div className="balance-setting__main">
        <div className="setting-desc">{description}</div>
        <div className="money-options mt-2">
          <BoxRadio
            options={balanceOptions}
            onChange={onChangeAmountOption}
            value={selectedAmountOption}
          />
        </div>
        {selectedAmountOption === 'custom' && (
          <div className="mt-3">
            <Input
              label="Amount"
              type="number"
            />
          </div>
        )}
      </div>
      <div className="balance-setting__method mt-6">
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
                onChange={checked => onChangeMethod(value, checked)}
                checked={checkedOptions?.includes(value)}
              />
            </div>
          ))}
        </div>
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
  );
};

export default BalanceSettingBottomForm;
