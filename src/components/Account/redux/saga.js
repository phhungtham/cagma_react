import { Method } from 'shared/api';
import workerSaga from '../../../shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { AccountURLs, ActionType } from './type';
import { EMPTY_OBJ } from '@configs/global/constants';

// define sagas that are being used for this page
export function* getAccounts() {
  yield takeLatest(ActionType.GET_ACCOUNT_REQUEST, workerSaga, AccountURLs.GET_ACCOUNTS, Method.POST, {
    dataPath: '',
    defaultResponse: EMPTY_OBJ
  });
}

export function* createAccount() {
  yield takeLatest(ActionType.CREATE_ACCOUNT_REQUEST, workerSaga, AccountURLs.CREATE_ACCOUNTS, Method.POST, {});
}

// combine all saga watchers of this page into the root one
export function* accountSaga() {
  yield all([getAccounts(), createAccount()]);
}
