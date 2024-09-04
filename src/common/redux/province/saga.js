import { EMPTY_OBJ } from '@configs/global/constants';
import workerSaga from '@shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import { ActionType, ProvinceURLs } from './type';

// define sagas that are being used for this page
export function* getProvinceList() {
  yield takeLatest(ActionType.GET_PROVINCE_LIST_REQUEST, workerSaga, ProvinceURLs.GET_PROVINCE_LIST, Method.POST, {
    dataPath: '',
    defaultResponse: EMPTY_OBJ,
  });
}

export function* provinceSaga() {
  yield all([getProvinceList()]);
}
