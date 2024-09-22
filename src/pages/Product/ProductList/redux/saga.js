import { EMPTY_OBJ } from '@common/constants/common';
import workerSaga from '@shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import { ActionType, ProductURLs } from './type';

// define sagas that are being used for this page
export function* getProducts() {
  yield takeLatest(ActionType.GET_PRODUCT_LIST_REQUEST, workerSaga, ProductURLs.GET_PRODUCTS, Method.POST, {
    dataPath: '',
    defaultResponse: EMPTY_OBJ,
  });
}

export function* productSaga() {
  yield all([getProducts()]);
}
