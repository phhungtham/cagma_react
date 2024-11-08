import { reportLostCardLabels as labels } from '@common/constants/labels';

export const REPORT_LOST_CARD_STEP = {
  ENTER_INFORMATION: 'enterInformation',
  COMPLETED: 'completed',
};

export const reportLostCardSuccessFields = [
  {
    label: labels.cardNumber,
    value: 'cardNumber',
  },
  {
    label: labels.accountNo,
    value: 'accountNo',
  },
  {
    label: labels.issueDate,
    value: 'issueDate',
  },
  {
    label: labels.status,
    value: 'status',
  },
];

export const ReportLostCardType = {
  UNKNOWN_CARD_NO: '0',
  KNOW_CARD_NO: '1',
};
