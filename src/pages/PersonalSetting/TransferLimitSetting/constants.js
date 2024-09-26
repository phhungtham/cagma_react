export const TRANSFER_LIMIT_SETTING_STEP = {
  ENTER_INFORMATION: 'enterInformation',
  COMPLETED: 'completed',
};

export const transferLimitChangeDetails = [
  {
    label: 'Daily Transfer Limits',
    value: 'limitDisplay',
  },
  {
    label: 'Current Daily Transfer Limits',
    value: 'currentLimitDisplay',
  },
  {
    label: 'Application Date',
    value: 'applyDate',
  },
  {
    label: 'Last applied Date',
    value: 'lastApplyDate',
  },
  {
    label: 'Status',
    value: 'statusDisplay',
  },
];

export const TransferLimitType = {
  INCREASE: 'increase',
  DECREASE: 'decrease',
  CANCEL: 'cancel',
};

export const transferLimitMessages = {
  [TransferLimitType.INCREASE]: {
    confirmMessage:
      'Increased daily transfer limit will not be effective immediately. Upon review of your request, a representative will be in contact with you.',
    successMessage: '<p>Your limit increase request</p><p>has been submitted.</p>',
  },
  [TransferLimitType.DECREASE]: {
    confirmMessage: 'A manual review is required to deduct and raise again.',
    successMessage: '<p>Your limit decrease</p><p>has been processed.</p>',
  },
  [TransferLimitType.CANCEL]: {
    content: 'Do you want to delete the adjusted amount?',
    statusSuccess: '<p>Your limit change request</p><p>has been cancelled.</p>',
  },
};

export const transferLimitMapResponseFields = {
  limit: 'limit_amt',
  limitDisplay: 'limit_amt_display',
  currentLimit: 'now_limit_amt',
  currentLimitDisplay: 'now_limit_amt_display',
  applyDate: 'limit_chg_req_display',
  lastApplyDate: 'limit_chg_dt_display',
  status: 'limit_chg_agree',
  statusDisplay: 'limit_chg_agree_display',
};
