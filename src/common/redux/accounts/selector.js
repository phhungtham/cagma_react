import { FeatureName } from './type';

export const accountList = state => {
  return state[FeatureName]?.accountList?.elData?.cus_acno_list;
};

export const accountLoadState = state => {
  return state[FeatureName]?.isLoading;
};

export const getAccountFailedMsg = state => {
  return state[FeatureName]?.accountList?.elHeader?.resMsgVo;
};
