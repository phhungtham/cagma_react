import { EMPTY_OBJ } from '@configs/global/constants';
import workerSaga from '@shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import { ActionType, IntendedUseAccountURLs } from './type';

// define sagas that are being used for this page
export function* inquiryIntendedUseAccount() {
  yield takeLatest(
    ActionType.GET_INTENDED_USE_ACCOUNT_REQUEST,
    workerSaga,
    IntendedUseAccountURLs.GET_INTENDED_USE_ACCOUNT,
    Method.POST,
    {
      dataPath: '',
      defaultResponse: EMPTY_OBJ,
    }
  );
}

export function* intendedUseAccountSaga() {
  yield all([inquiryIntendedUseAccount()]);
}
