import BottomSheet from '@common/components/templates/BottomSheet';

import { eAlertLowBalanceWarningOptions } from '../constants';
import BalanceSettingFormBottom from './BalanceSettingFormBottom';
import './styles.scss';

const LowBalanceWarningBottom = ({ onClose, onSubmit }) => {
  return (
    <BottomSheet
      open
      onClose={onClose}
      title="Low balance Warning"
      clazz="money-leaving-account__wrapper"
      type="fit-content"
    >
      <BalanceSettingFormBottom
        description="Send alert when available balance is less than"
        onConfirm={onSubmit}
        balanceOptions={eAlertLowBalanceWarningOptions}
      />
    </BottomSheet>
  );
};

export default LowBalanceWarningBottom;
