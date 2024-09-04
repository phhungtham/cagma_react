import { ProvinceFeatureName } from './type';

export const provinceList = state => {
  return state[ProvinceFeatureName]?.province?.elData?.state_c || [];
};

export const provinceLoadState = state => {
  return state[ProvinceFeatureName]?.isLoading;
};

export const getProvinceFailedMsg = state => {
  return state[ProvinceFeatureName]?.province?.elHeader?.resMsgVo;
};
