import { FeatureAppNotificationName } from './type';

export const transactionList = state => {
  return state[FeatureAppNotificationName]?.listTransactionNotify?.list;
};

export const offerList = state => {
  return state[FeatureAppNotificationName]?.listOfferNotify?.list;
};

export const promotionList = state => {
  return state[FeatureAppNotificationName]?.listpromotionNotify?.list;
};

export const listCheckingLoadMoreCnt = state => {
  return state[FeatureAppNotificationName]?.listCheckingCount;
};

export const listNoticesLoadMoreCnt = state => {
  return state[FeatureAppNotificationName]?.listNoticesCount;
};

export const checkingLoadState = state => {
  return state[FeatureAppNotificationName]?.loadCheckingState;
};

export const noticesLoadState = state => {
  return state[FeatureAppNotificationName]?.loadNoticesState;
};

export const benefitsLoadState = state => {
  return state[FeatureAppNotificationName]?.loadBenefitState;
};

export const checkingLoadFailed = state => {
  return state[FeatureAppNotificationName]?.loadCheckingListFailed;
};

export const noticesLoadFailed = state => {
  return state[FeatureAppNotificationName]?.loadNoticesListFailed;
};

export const benefitsLoadFailed = state => {
  return state[FeatureAppNotificationName]?.loadBenefitListFailed;
};

export const bannerSeqState = state => {
  return state[FeatureAppNotificationName]?.loadBannerSeq;
};

export const tabIdx = state => {
  return state[FeatureAppNotificationName]?.tabIdx;
};
