import { Method } from 'shared/api';
import workerSaga from '../../../shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { ActionType, ExchangeRateURLs } from './type';

// define sagas that are being used for this page
export function* exchangeRate() {
  yield takeLatest(ActionType.EXCHANGE_RATE_INFO, workerSaga, ExchangeRateURLs.EXCHANGE__RATE, Method.POST, {
    retries: 0,
    pausingTime: 0,
    dataPath: 'elData.list',
  });
}

// combine all saga watchers of this page into the root one
export function* exchangeRateSaga() {
  yield all([exchangeRate()]);
}
