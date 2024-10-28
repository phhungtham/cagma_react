import BottomSheet from '@common/components/templates/BottomSheet';
import { eAlertLabels } from '@common/constants/labels';

import { eAlertLowBalanceWarningOptions } from '../constants';
import BalanceSettingFormBottom from './BalanceSettingFormBottom';
import './styles.scss';

const LowBalanceWarningBottom = ({ onClose, onSubmit, data, translate: t }) => {
  return (
    <BottomSheet
      open
      onClose={onClose}
      title={t(eAlertLabels.lowBalanceWarning)}
      clazz="money-leaving-account__wrapper include-footer"
      type="fit-content"
    >
      <BalanceSettingFormBottom
        description="Send alert when available balance is less than" //TODO: Missing label
        onSubmit={onSubmit}
        balanceOptions={eAlertLowBalanceWarningOptions}
        data={data}
        translate={t}
      />
    </BottomSheet>
  );
};

export default LowBalanceWarningBottom;
