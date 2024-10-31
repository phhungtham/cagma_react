import { AppNotificationFeatureName } from './type';

export const transactionList = state => {
  return state[AppNotificationFeatureName]?.listTransactionNotify?.list;
};

export const offerList = state => {
  return state[AppNotificationFeatureName]?.listOfferNotify?.list;
};

export const listTransactionLoadMoreCnt = state => {
  return state[AppNotificationFeatureName]?.listTransactionCount;
};

export const listOfferLoadMoreCnt = state => {
  return state[AppNotificationFeatureName]?.listOfferCount;
};

export const transactionLoadState = state => {
  return state[AppNotificationFeatureName]?.loadTransactionState;
};

export const offerLoadState = state => {
  return state[AppNotificationFeatureName]?.loadOfferState;
};

export const transactionLoadFailed = state => {
  return state[AppNotificationFeatureName]?.loadTransactionListFailed;
};

export const offerLoadFailed = state => {
  return state[AppNotificationFeatureName]?.loadOfferListFailed;
};

export const tabIdx = state => {
  return state[AppNotificationFeatureName]?.tabIdx;
};
