import { EMPTY_OBJ } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import workerSaga from '@shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import { BranchDirectoryActionType } from './type';

export function* getBranchDirectory() {
  yield takeLatest(
    BranchDirectoryActionType.GET_BRANCH_DIRECTORY_REQUEST,
    workerSaga,
    endpoints.getBranchDirectory,
    Method.POST,
    {
      dataPath: '',
      defaultResponse: EMPTY_OBJ,
    }
  );
}

export function* branchDirectorySaga() {
  yield all([getBranchDirectory()]);
}
