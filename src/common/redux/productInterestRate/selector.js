import { ProductInterestRateFeatureName } from './type';

export const productInterestRateInfo = state => {
  return state[ProductInterestRateFeatureName]?.productInterestRate?.elData;
};

export const productInterestRateLoadState = state => {
  return state[ProductInterestRateFeatureName]?.isLoading;
};

export const inquiryProductInterestRateFailedMsg = state => {
  return state[ProductInterestRateFeatureName]?.productInterestRate?.elHeader?.resMsgVo?.msgText;
};
