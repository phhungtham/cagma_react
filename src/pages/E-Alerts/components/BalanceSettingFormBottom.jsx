import { useEffect, useState } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import Input from '@common/components/atoms/Input/Input';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';
import { ctaLabels, eAlertLabels } from '@common/constants/labels';

import { EAlertCustomerMethod, eAlertSettingMethodOptions } from '../constants';

const amountMaxLength = 22;

const BalanceSettingFormBottom = ({
  description,
  balanceOptions,
  data,
  onSubmit,
  translate: t,
  min: amountMinValue,
}) => {
  const [selectedAmountOption, setSelectedAmountOption] = useState();
  const [amount, setAmount] = useState();
  const [checkedOptions, setCheckedOptions] = useState([]);
  const [error, setError] = useState('');

  const onChangeAmountOption = value => {
    if (value === 'custom') {
      setAmount(String(amountMinValue));
    } else {
      setAmount(Number(value));
    }
    setError('');
    setSelectedAmountOption(value);
  };

  const handleChangeAmount = value => {
    if (value?.length > amountMaxLength) {
      return setAmount(amount);
    }
    if (Number(value || 0) < amountMinValue) {
      setError(t(eAlertLabels.itMustBeAtLeast).replace('%1', `$${amountMinValue}`));
    } else {
      setError('');
    }
    setAmount(value);
  };

  const onClickApply = () => {
    let values = {
      emailEnabled: false,
      pushEnabled: false,
      amount: amount,
    };
    if (checkedOptions.includes(EAlertCustomerMethod.EMAIL)) {
      values.emailEnabled = true;
    }
    if (checkedOptions.includes(EAlertCustomerMethod.APP_PUSH)) {
      values.pushEnabled = true;
    }
    onSubmit(values);
  };

  const onClickReset = () => {
    setCheckedOptions([]);
  };

  const onChangeMethod = (value, checked) => {
    if (checked) {
      setCheckedOptions([...checkedOptions, value]);
    } else {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    }
  };

  useEffect(() => {
    if (data) {
      const { emailEnabled, pushEnabled, amount } = data || {};
      let checkedList = [];
      if (emailEnabled) {
        checkedList.push(EAlertCustomerMethod.EMAIL);
      }
      if (pushEnabled) {
        checkedList.push(EAlertCustomerMethod.APP_PUSH);
      }
      setCheckedOptions(checkedList);
      const optionExist = (balanceOptions || []).find(item => Number(item.value) === Number(amount));
      if (optionExist) {
        setSelectedAmountOption(amount);
      } else {
        setSelectedAmountOption('custom');
      }
      setAmount(amount);
    }
  }, [JSON.stringify(data || {})]);

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
              label={t(eAlertLabels.amount)}
              type="number"
              inputMode="numeric"
              onChange={handleChangeAmount}
              value={amount}
              errorMessage={error}
            />
          </div>
        )}
      </div>
      <div className="balance-setting__method mt-6">
        <div className="title">{t(eAlertLabels.methodsTitle)}</div>
        <div className="checklist___options flex-gap-y-12">
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
      <div className="btn__ctas flex-gap-x-8">
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
          disable={!!error}
        />
      </div>
    </div>
  );
};

export default BalanceSettingFormBottom;
