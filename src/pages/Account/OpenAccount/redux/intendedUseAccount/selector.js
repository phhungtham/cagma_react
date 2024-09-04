import { IntendedUseAccountFeatureName } from './type';

export const intendedUseAccountList = state => {
  return state[IntendedUseAccountFeatureName]?.intendedUseAccount?.elData?.dep_ac_usag_d || [];
};

export const intendedUseAccountLoadState = state => {
  return state[IntendedUseAccountFeatureName]?.isLoading;
};

export const inquiryIntendedUseAccountFailedMsg = state => {
  return state[IntendedUseAccountFeatureName]?.intendedUseAccount?.elHeader?.resMsgVo;
};
