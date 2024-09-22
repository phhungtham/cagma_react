import { EMPTY_OBJ } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import workerSaga from '@shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import { UserInfoActionType } from './type';

export function* getUserInfo() {
  yield takeLatest(
    UserInfoActionType.GET_USER_INFO_REQUEST,
    workerSaga,
    endpoints.inquiryUserInformation,
    Method.POST,
    {
      dataPath: '',
      defaultResponse: EMPTY_OBJ,
    }
  );
}

export function* userInfoSaga() {
  yield all([getUserInfo()]);
}
