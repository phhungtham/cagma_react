import { EMPTY_OBJ } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import workerSaga from '@shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import { ActionType } from './type';

// define sagas that are being used for this page
export function* inquiryProductInterestRate() {
  yield takeLatest(
    ActionType.INQUIRY_PRODUCT_INTEREST_RATE_REQUEST,
    workerSaga,
    endpoints.inquiryProductInterestRate,
    Method.POST,
    {
      dataPath: '',
      defaultResponse: EMPTY_OBJ,
    }
  );
}

export function* productInterestRateSaga() {
  yield all([inquiryProductInterestRate()]);
}
