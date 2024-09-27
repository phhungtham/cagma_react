import { EMPTY_OBJ } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import workerSaga from '../../../shared/redux/sagaworker';
import { ActionType } from './type';

// define sagas that are being used for this page
export function* getAccounts() {
  yield takeLatest(ActionType.GET_ACCOUNT_LIST_REQUEST, workerSaga, endpoints.getAccountList, Method.POST, {
    dataPath: '',
    defaultResponse: EMPTY_OBJ,
  });
}

export function* accountSaga() {
  yield all([getAccounts()]);
}
