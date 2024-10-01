import { EMPTY_OBJ } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import workerSaga from '../../../shared/redux/sagaworker';
import { ActionType } from './type';

export function* getTransactionNotifyList() {
  yield takeLatest(
    ActionType.GET_TRANSACTIONS_NOTIFY_REQUEST,
    workerSaga,
    endpoints.getTransactionNotify,
    Method.POST,
    {
      dataPath: '',
      defaultResponse: EMPTY_OBJ,
    }
  );
}

export function* getOfferNotifyList() {
  yield takeLatest(ActionType.GET_OFFERS_NOTIFY_REQUEST, workerSaga, endpoints.getOffersNotify, Method.POST, {
    dataPath: '',
    defaultResponse: EMPTY_OBJ,
  });
}

export function* getPromotionNotifyList() {
  yield takeLatest(ActionType.GET_PROMOTIONS_NOTIFY_REQUEST, workerSaga, endpoints.getPromotionNotify, Method.POST, {
    dataPath: '',
    defaultResponse: EMPTY_OBJ,
    isExtendSession: false,
  });
}

export function* appNotificationSaga() {
  yield all([getTransactionNotifyList(), getOfferNotifyList(), getPromotionNotifyList()]);
}
