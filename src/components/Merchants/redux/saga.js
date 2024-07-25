import { Method } from 'shared/api';
import workerSaga from '../../../shared/redux/sagaworker';
import { all, putResolve, takeLatest } from 'redux-saga/effects';
import { ActionType, merchantsURLs } from './type';

export function* getMerchantRequest() {
  yield takeLatest(ActionType.MERCHANT_REQUEST, workerSaga, merchantsURLs.GET_MERCHANT, Method.POST, {});
}

export function* getSalesAnalysis() {
  yield takeLatest(ActionType.SALES_ANALYSIS_REQUEST,workerSaga,merchantsURLs.GET_SALES_ANALYSIS,Method.POST,{});
}

// combine all saga watchers of this page into the root one
export function* merchantSaga() {
  yield all([getMerchantRequest(), getSalesAnalysis()]);
}
