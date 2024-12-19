import BottomSheet from '@common/components/templates/BottomSheet';
import { eAlertLabels } from '@common/constants/labels';

import { eAlertMoneyBalanceOptions } from '../constants';
import BalanceSettingFormBottom from './BalanceSettingFormBottom';
import './styles.scss';

const MoneyIntoAccountBottom = ({ onClose, onSubmit, data, translate: t }) => {
  return (
    <BottomSheet
      open
      onClose={onClose}
      title={t(eAlertLabels.moneyInto)}
      clazz="money-leaving-account__wrapper"
      type="fit-content"
    >
      <BalanceSettingFormBottom
        description={t(eAlertLabels.sendAlertAmountGreater)}
        balanceOptions={eAlertMoneyBalanceOptions}
        onSubmit={onSubmit}
        data={data}
        translate={t}
        min={0}
      />
    </BottomSheet>
  );
};

export default MoneyIntoAccountBottom;
