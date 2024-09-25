export const TRANSFER_LIMIT_SETTING_STEP = {
  ENTER_INFORMATION: 'enterInformation',
  COMPLETED: 'completed',
};

export const transferLimitChangeDetails = [
  {
    label: 'Daily Transfer Limits',
    value: 'limit',
  },
  {
    label: 'Current Daily Transfer Limits',
    value: 'currentLimit',
  },
  {
    label: 'Application Date',
    value: 'applicationDate',
  },
  {
    label: 'Last applied Date',
    value: 'lastAppliedDate',
  },
  {
    label: 'Status',
    value: 'status',
  },
];

export const transferLimitMessages = {
  increased: {
    title: 'Are you sure?',
    content:
      'Increased daily transfer limit will not be effective immediately. Upon review of your request, a representative will be in contact with you.',
    valueMessage: 'increased',
    statusSuccess: 'Your limit increase request has been submitted.',
  },
  decreased: {
    title: 'Are you sure?',
    content: 'A manual review is required to deduct and raise again.',
    valueMessage: 'decrease',
    statusSuccess: ' Your limit decrease has been processed.',
  },
  cancel: {
    title: 'Are you sure?',
    content: 'Do you want to delete the adjusted amount?',
    valueMessage: 'cancel',
    statusSuccess: 'Your limit change request has been cancelled.',
  },
};
