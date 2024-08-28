import { FeatureName } from './type';

export const productList = state => {
  return state[FeatureName]?.productList?.elData?.list;
};

export const productLoadState = state => {
  return state[FeatureName]?.isLoading;
};

export const getProductFailedMsg = state => {
  return state[FeatureName]?.productList?.elHeader?.resMsgVo;
};
