import { BranchDirectoryFeatureName } from './type';

export const branchDirectoryList = state => {
  return state[BranchDirectoryFeatureName]?.branchDirectory?.elData?.r_CACO006_1Vo;
};

export const branchDirectoryLoadState = state => {
  return state[BranchDirectoryFeatureName]?.isLoading;
};

export const getBranchDirectoryFailedMsg = state => {
  return state[BranchDirectoryFeatureName]?.branchDirectory?.elHeader?.resMsgVo;
};
