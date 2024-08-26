import BottomSheet from '@common/components/templates/BottomSheet';

import { eAlertMoneyBalanceOptions } from '../constants';
import BalanceSettingBottomForm from './BalanceSettingBottomForm';
import './styles.scss';

const MoneyLeavingAccountBottom = ({ onClose, onSubmit }) => {
  return (
    <BottomSheet
      open
      onClose={onClose}
      title="Money leaving your account"
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

export default MoneyLeavingAccountBottom;
