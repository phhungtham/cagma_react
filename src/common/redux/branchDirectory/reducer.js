import { BranchDirectoryActionType } from './type';

const initState = {
  isLoading: false,
  branchDirectory: [],
};

export const branchDirectoryReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case BranchDirectoryActionType.GET_BRANCH_DIRECTORY_REQUEST:
      return { ...state, isLoading: true };
    case BranchDirectoryActionType.GET_BRANCH_DIRECTORY_REQUEST_SUCCESS:
      return { ...state, branchDirectory: payload, isLoading: false };
    case BranchDirectoryActionType.GET_BRANCH_DIRECTORY_REQUEST_FAILED:
      return { ...state, branchDirectory: payload, isLoading: false };
    default:
      return state;
  }
};
