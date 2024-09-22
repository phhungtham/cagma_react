import { EMPTY_OBJ } from '@common/constants/common';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import workerSaga from '../../../shared/redux/sagaworker';
import { ActionType, LogoutURLs } from './type';

export function* logoutRequest() {
  yield takeLatest(ActionType.LOGOUT_REQUEST, workerSaga, LogoutURLs.LOGOUT, Method.POST, {
    retries: 0,
    pausingTime: 0,
    dataPath: '',
    defaultResponse: EMPTY_OBJ,
  });
}

// combine all saga watchers of this page into the root one
export function* logoutSaga() {
  yield all([logoutRequest()]);
}
