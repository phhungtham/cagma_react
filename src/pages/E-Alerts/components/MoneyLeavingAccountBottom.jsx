import BottomSheet from '@common/components/templates/BottomSheet';

import { eAlertMoneyBalanceOptions } from '../constants';
import BalanceSettingFormBottom from './BalanceSettingFormBottom';
import './styles.scss';

const MoneyLeavingAccountBottom = ({ onClose, onSubmit, data }) => {
  return (
    <BottomSheet
      open
      onClose={onClose}
      title="Money leaving your account"
      clazz="money-leaving-account__wrapper"
      type="fit-content"
    >
      <BalanceSettingFormBottom
        description="Send alert when amount is greater than"
        balanceOptions={eAlertMoneyBalanceOptions}
        onSubmit={onSubmit}
        data={data}
      />
    </BottomSheet>
  );
};

export default MoneyLeavingAccountBottom;
