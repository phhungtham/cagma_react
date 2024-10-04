import BottomSheet from '@common/components/templates/BottomSheet';

import { eAlertLowBalanceWarningOptions } from '../constants';
import BalanceSettingFormBottom from './BalanceSettingFormBottom';
import './styles.scss';

const LowBalanceWarningBottom = ({ onClose, onSubmit, data }) => {
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
        onSubmit={onSubmit}
        balanceOptions={eAlertLowBalanceWarningOptions}
        data={data}
      />
    </BottomSheet>
  );
};

export default LowBalanceWarningBottom;
