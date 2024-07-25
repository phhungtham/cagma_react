import { FeatureExchangeRateName } from './type';

export const exchangeRateInfo = state => {
  return state[FeatureExchangeRateName]?.exchangeRateInfo;
};
export const exchangeRateLoadState = state => {
  return state[FeatureExchangeRateName]?.isLoading;
};
