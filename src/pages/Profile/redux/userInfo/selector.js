import { UserInfoFeatureName } from './type';

export const userInfoSelector = state => {
  return state[UserInfoFeatureName]?.userInfo?.elData;
};

export const userInfoLoadState = state => {
  return state[UserInfoFeatureName]?.isLoading;
};

export const getUserInfoFailedMsg = state => {
  return state[UserInfoFeatureName]?.userInfo?.elHeader?.resMsgVo;
};
