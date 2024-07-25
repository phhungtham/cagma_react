import { FeatureAppNotificationName } from './type';

export const checkingList = state => {
  return state[FeatureAppNotificationName]?.listCheckingNotify?.list;
};

export const noticesList = state => {
  return state[FeatureAppNotificationName]?.listNoticesNotify?.list;
};

export const benefitList = state => {
  return state[FeatureAppNotificationName]?.listBenefitNotify?.list;
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
