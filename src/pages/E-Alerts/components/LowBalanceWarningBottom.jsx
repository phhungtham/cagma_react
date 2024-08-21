import BottomSheet from '@common/components/templates/BottomSheet';
import './styles.scss';
import { eAlertLowBalanceWarningOptions, eAlertSettingMethodOptions } from '../constants';
import CheckBox from '@common/components/atoms/Checkbox';
import { useState } from 'react';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import BalanceSettingBottomForm from './BalanceSettingBottomForm';

const LowBalanceWarningBottom = ({onClose, onSubmit}) => {

  return (
    <BottomSheet
      open={true}
      onClose={onClose}
      title="Low balance Warning"
      clazz="money-leaving-account__wrapper"
      type="fit-content"
    >
      <BalanceSettingBottomForm 
        description="Send alert when available balance is less than"
        onConfirm={onSubmit} 
        balanceOptions={eAlertLowBalanceWarningOptions}
      />
    </BottomSheet>
  );
};

export default LowBalanceWarningBottom;