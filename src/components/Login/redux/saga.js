import { Method } from 'shared/api';
import workerSaga from '../../../shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { ActionType, LoginURLs } from './type';
import { EMPTY_OBJ } from 'configs/global/constants';

export function* loginRequest() {
  yield takeLatest(ActionType.LOGIN_REQUEST, workerSaga, LoginURLs.LOGIN, Method.POST, {
    retries: 0,
    pausingTime: 1000,
    dataPath: '',
    defaultResponse: EMPTY_OBJ
  });
}

// combine all saga watchers of this page into the root one
export function* loginSaga() {
  yield all([loginRequest()]);
}
