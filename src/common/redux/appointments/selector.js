import { AppointmentsFeatureName } from './type';

export const appointmentList = state => {
  return state[AppointmentsFeatureName]?.appointments?.elData;
};

export const appointmentsLoadState = state => {
  return state[AppointmentsFeatureName]?.isLoading;
};

export const getAppointmentsFailedMsg = state => {
  return state[AppointmentsFeatureName]?.appointments?.elHeader?.resMsg;
};
