import { Method } from 'shared/api';
import workerSaga from '../../../shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { AppNotifyURLs, ActionType } from './type';
import { EMPTY_OBJ } from '@configs/global/constants';

export function* getCheckingNotifyList() {
  yield takeLatest(ActionType.GET_CHECKING_NOTIFY_REQUEST, workerSaga, AppNotifyURLs.CHECKING_NOTIFY, Method.POST, {
    dataPath: '',
    defaultResponse: EMPTY_OBJ
  });
}

export function* getNoticesNotifyList() {
  yield takeLatest(ActionType.GET_NOTICES_NOTIFY_REQUEST, workerSaga, AppNotifyURLs.NOTICES_NOTIFY, Method.POST, {
    dataPath: '',
    defaultResponse: EMPTY_OBJ
  });
}

export function* getBenefitNotifyList() {
  yield takeLatest(ActionType.GET_BENEFITS_NOTIFY_REQUEST, workerSaga, AppNotifyURLs.BENEFIT_NOTIFY, Method.POST, {
    dataPath: '',
    defaultResponse: EMPTY_OBJ,
    isExtendSession: false
  });
}

export function* appNotificationSaga() {
  yield all([getCheckingNotifyList(), getNoticesNotifyList(), getBenefitNotifyList()]);
}
