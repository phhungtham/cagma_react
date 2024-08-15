import { Method } from 'shared/api';
import workerSaga from '../../../shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { ActionType, LogoutURLs } from './type';
import { EMPTY_OBJ } from 'configs/global/constants';

export function* logoutRequest() {
  yield takeLatest(ActionType.LOGOUT_REQUEST, workerSaga, LogoutURLs.LOGOUT, Method.POST, {
    retries: 0,
    pausingTime: 0,
    dataPath: '',
    defaultResponse: EMPTY_OBJ
  });
}

// combine all saga watchers of this page into the root one
export function* logoutSaga() {
  yield all([logoutRequest()]);
}
