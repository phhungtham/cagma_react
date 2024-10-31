import { activeCardLabels } from '@common/constants/labels';

export const ACTIVE_CARD_STEP = {
  ENTER_CARD_INFORMATION: 'enterInformation',
  ENTER_ACCOUNT_INFORMATION: 'enterAccountInformation',
  COMPLETED: 'completed',
};

export const activeCardSuccessFields = [
  {
    label: activeCardLabels.cardNo,
    value: 'cardNo',
  },
  {
    label: activeCardLabels.account,
    value: 'accountNumber',
  },
];
