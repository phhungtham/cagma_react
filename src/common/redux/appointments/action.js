import { dispatch } from 'shared/redux/store';

import { AppointmentsActionType } from './type';

export const getAppointmentsRequest = payload =>
  dispatch({ type: AppointmentsActionType.GET_APPOINTMENTS_REQUEST, payload });
