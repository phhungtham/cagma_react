import { CommonCodeFeatureName } from './type';

export const commonCodeInfo = state => {
  return state[CommonCodeFeatureName]?.commonCode?.elData;
};

export const commonCodeLoadState = state => {
  return state[CommonCodeFeatureName]?.isLoading;
};

export const inquiryCommonCodeFailedMsg = state => {
  return state[CommonCodeFeatureName]?.commonCode?.elHeader?.resMsgVo;
};
