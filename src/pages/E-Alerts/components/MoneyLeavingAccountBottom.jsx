import BottomSheet from '@common/components/templates/BottomSheet';
import './styles.scss';
import { eAlertSettingMethodOptions } from '../constants';
import CheckBox from '@common/components/atoms/Checkbox';
import { useState } from 'react';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import BalanceSettingBottomForm from './BalanceSettingBottomForm';

const MoneyLeavingAccountBottom = ({onClose, onSubmit}) => {
  const [checkedOptions, setCheckedOptions] = useState([]);

  const handleCheckOption = (value, checked) => {
    if(checked) {
      setCheckedOptions([...checkedOptions, value]);
    } else {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    }
  };

  const onClickReset = () => {

  };
  
  const onClickApply = () => {
    onSubmit(checkedOptions);
  };

  return (
    <BottomSheet
      open={true}
      onClose={onClose}
      title="Money leaving your account"
      clazz="money-leaving-account__wrapper"
      type="fit-content"
    >
      <BalanceSettingBottomForm />
    </BottomSheet>
  );
};

export default MoneyLeavingAccountBottom;