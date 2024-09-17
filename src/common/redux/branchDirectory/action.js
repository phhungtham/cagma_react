import { dispatch } from 'shared/redux/store';

import { BranchDirectoryActionType } from './type';

export const getBranchDirectoryRequest = payload =>
  dispatch({ type: BranchDirectoryActionType.GET_BRANCH_DIRECTORY_REQUEST, payload });
