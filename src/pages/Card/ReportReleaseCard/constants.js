import { releaseCardLabels as labels } from '@common/constants/labels';

export const REPORT_RELEASE_CARD_STEP = {
  ENTER_INFORMATION: 'enterInformation',
  COMPLETED: 'completed',
};

export const reportReleaseCardSuccessFields = [
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

export const accidentReportDetailFields = [
  {
    label: labels.reportedDateAccident,
    value: 'date',
  },
  {
    label: labels.accountCode,
    value: 'accountCode',
  },
  {
    label: labels.detailAccident,
    value: 'detail',
  },
];
