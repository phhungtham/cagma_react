import BottomSheet from '@common/components/templates/BottomSheet';
import './styles.scss';
import { eAlertMoneyBalanceOptions, eAlertSettingMethodOptions } from '../constants';
import CheckBox from '@common/components/atoms/Checkbox';
import { useState } from 'react';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import BalanceSettingBottomForm from './BalanceSettingBottomForm';

const MoneyIntoAccountBottom = ({onClose, onSubmit}) => {

  return (
    <BottomSheet
      open={true}
      onClose={onClose}
      title="Money into your account"
      clazz="money-leaving-account__wrapper"
      type="fit-content"
    >
      <BalanceSettingBottomForm 
        description="Send alert when amount is greater than"
        balanceOptions={eAlertMoneyBalanceOptions}
        onConfirm={onSubmit} 
      />
    </BottomSheet>
  );
};

export default MoneyIntoAccountBottom;