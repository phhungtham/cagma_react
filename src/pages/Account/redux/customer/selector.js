import { FeatureName } from './type';

export const customerInfo = state => {
  return state[FeatureName]?.customer?.elData;
};

export const customerLoadState = state => {
  return state[FeatureName]?.isLoading;
};

export const getCustomerFailedMsg = state => {
  return state[FeatureName]?.customer?.elHeader?.resMsgVo;
};
