import { useEffect, useState } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import BottomSheet from '@common/components/templates/BottomSheet';
import { ctaLabels, eAlertLabels as labels } from '@common/constants/labels';

import { EAlertCustomerMethod, eAlertSettingMethodOptions } from '../constants';
import './styles.scss';

const CustomerInfoChangeBottom = ({ onClose, onSubmit, setting, translate: t }) => {
  const [checkedOptions, setCheckedOptions] = useState([]);

  const handleCheckOption = (value, checked) => {
    if (checked) {
      setCheckedOptions([...checkedOptions, value]);
    } else {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    }
  };

  const onClickReset = () => {
    setCheckedOptions([]);
  };

  const onClickApply = () => {
    let values = {
      customerEmailEnabled: false,
      customerAppPushEnabled: false,
    };
    if (checkedOptions.includes(EAlertCustomerMethod.EMAIL)) {
      values.customerEmailEnabled = true;
    }
    if (checkedOptions.includes(EAlertCustomerMethod.APP_PUSH)) {
      values.customerAppPushEnabled = true;
    }
    onSubmit(values);
  };

  const initValues = () => {
    const { customerEmailEnabled, customerAppPushEnabled } = setting || {};
    let checkedList = [];
    if (customerEmailEnabled) {
      checkedList.push(EAlertCustomerMethod.EMAIL);
    }
    if (customerAppPushEnabled) {
      checkedList.push(EAlertCustomerMethod.APP_PUSH);
    }
    setCheckedOptions(checkedList);
  };

  useEffect(() => {
    initValues();
  }, [setting]);

  return (
    <BottomSheet
      open
      onClose={onClose}
      title={t(labels.customerInfoChange)}
      clazz="customer-info-change__wrapper"
      type="fit-content"
    >
      <div className="customer-info__content">
        <div className="title">{t(labels.methods)}</div>
        <div className="checklist___options">
          {eAlertSettingMethodOptions.map(({ label, value }) => (
            <div
              className="option-item"
              key={value}
            >
              <CheckBox
                size="large"
                label={t(label)}
                onChange={checked => handleCheckOption(value, checked)}
                checked={checkedOptions.includes(value)}
              />
            </div>
          ))}
        </div>
        <div className="btn__ctas">
          <Button
            variant="filled__secondary-blue"
            label={t(ctaLabels.reset)}
            className="flex-3"
            onClick={onClickReset}
          />
          <Button
            variant="filled__primary"
            label={t(ctaLabels.apply)}
            className="flex-7"
            onClick={onClickApply}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default CustomerInfoChangeBottom;
