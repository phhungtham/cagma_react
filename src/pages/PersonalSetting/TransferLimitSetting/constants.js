import { manageLimitLabels as labels } from '@common/constants/labels';

export const TRANSFER_LIMIT_SETTING_STEP = {
  ENTER_INFORMATION: 'enterInformation',
  COMPLETED: 'completed',
};

export const transferLimitChangeDetails = [
  {
    label: labels.dailyLimit,
    value: 'limitDisplay',
  },
  {
    label: labels.currentDailyLimit,
    value: 'currentLimitDisplay',
  },
  {
    label: labels.applicationDate,
    value: 'applyDate',
  },
  {
    label: labels.lastApplyDate,
    value: 'lastApplyDate',
  },
  {
    label: labels.status,
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
    confirmMessage: labels.reviewRequest,
    successMessage: labels.increaseRequestSubmit,
  },
  [TransferLimitType.DECREASE]: {
    confirmMessage: labels.manualReview,
    successMessage: labels.decreaseProcess,
  },
  [TransferLimitType.CANCEL]: {
    confirmMessage: labels.deleteConfirm,
    successMessage: labels.requestCancel,
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
  currencyCode: 'ccy_c',
};

export const TransferLimitStatus = {
  REQUEST_CHANGE: '1',
  COMPLETED: '2',
  CANCELED: '3',
};
