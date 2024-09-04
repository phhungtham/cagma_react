import { FeatureName } from './type';

export const cardCountInfo = state => {
  return state[FeatureName]?.cardCount?.elData;
};

export const cardCountLoadState = state => {
  return state[FeatureName]?.isLoading;
};

export const getCardCountFailedMsg = state => {
  return state[FeatureName]?.cardCount?.elHeader?.resMsgVo;
};
