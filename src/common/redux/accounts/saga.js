import { EMPTY_OBJ } from '@configs/global/constants';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import workerSaga from '../../../shared/redux/sagaworker';
import { AccountURLs, ActionType } from './type';

// define sagas that are being used for this page
export function* getAccounts() {
  yield takeLatest(ActionType.GET_ACCOUNT_LIST_REQUEST, workerSaga, AccountURLs.GET_ACCOUNTS, Method.POST, {
    dataPath: '',
    defaultResponse: EMPTY_OBJ,
  });
}

export function* accountSaga() {
  yield all([getAccounts()]);
}
