import { EMPTY_OBJ } from '@configs/global/constants';
import workerSaga from '@shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import { ActionType, CommonCodeURLs } from './type';

// define sagas that are being used for this page
export function* inquiryCommonCode() {
  yield takeLatest(
    ActionType.INQUIRY_COMMON_CODE_REQUEST,
    workerSaga,
    CommonCodeURLs.INQUIRY_COMMON_CODE,
    Method.POST,
    {
      dataPath: '',
      defaultResponse: EMPTY_OBJ,
    }
  );
}

export function* commonCodeSaga() {
  yield all([inquiryCommonCode()]);
}
