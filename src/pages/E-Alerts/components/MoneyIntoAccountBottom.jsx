import BottomSheet from '@common/components/templates/BottomSheet';

import { eAlertMoneyBalanceOptions } from '../constants';
import BalanceSettingFormBottom from './BalanceSettingFormBottom';
import './styles.scss';

const MoneyIntoAccountBottom = ({ onClose, onSubmit }) => {
  return (
    <BottomSheet
      open
      onClose={onClose}
      title="Money into your account"
      clazz="money-leaving-account__wrapper"
      type="fit-content"
    >
      <BalanceSettingFormBottom
        description="Send alert when amount is greater than"
        balanceOptions={eAlertMoneyBalanceOptions}
        onConfirm={onSubmit}
      />
    </BottomSheet>
  );
};

export default MoneyIntoAccountBottom;
