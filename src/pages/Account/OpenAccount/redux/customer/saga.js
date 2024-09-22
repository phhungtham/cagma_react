import { EMPTY_OBJ } from '@common/constants/common';
import workerSaga from '@shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import { ActionType, CustomerUrls } from './type';

// define sagas that are being used for this page
export function* getCustomer() {
  yield takeLatest(ActionType.GET_CUSTOMER_REQUEST, workerSaga, CustomerUrls.GET_CUSTOMER_INFO, Method.POST, {
    dataPath: '',
    defaultResponse: EMPTY_OBJ,
  });
}

export function* customerSaga() {
  yield all([getCustomer()]);
}
