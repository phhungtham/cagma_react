import { FeatureName } from './type';

export const listAccount = state => {
  return state[FeatureName]?.listAccount?.elData;
};
export const accountLoadState = state => {
  return state[FeatureName]?.isLoading;
};
export const listAccountChecking = state => {
  return state[FeatureName]?.listAccount?.elData?.acno_list01;
};
export const listAccountSaving = state => {
  return state[FeatureName]?.listAccount?.elData?.acno_list02;
};
export const listAccountLoan = state => {
  return state[FeatureName]?.listAccount?.elData?.acno_list03;
};

export const totalListAccount = state => {
  return state[FeatureName]?.listAccount?.elData?.tot_list00;
};

export const getAccountFailedMsg = state => {
  return state[FeatureName]?.listAccount?.elHeader?.resMsgVo;
};
