import { endpoints } from '@common/constants/endpoint';
import { EMPTY_OBJ } from '@configs/global/constants';
import workerSaga from '@shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import { AppointmentsActionType } from './type';

export function* getAppointments() {
  yield takeLatest(
    AppointmentsActionType.GET_APPOINTMENTS_REQUEST,
    workerSaga,
    endpoints.getAppointments,
    Method.POST,
    {
      dataPath: '',
      defaultResponse: EMPTY_OBJ,
    }
  );
}

export function* appointmentsSaga() {
  yield all([getAppointments()]);
}
