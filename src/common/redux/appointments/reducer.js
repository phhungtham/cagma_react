import { AppointmentsActionType } from './type';

const initState = {
  isLoading: false,
  appointments: [],
};

export const appointmentsReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case AppointmentsActionType.GET_APPOINTMENTS_REQUEST:
      return { ...state, isLoading: true };
    case AppointmentsActionType.GET_APPOINTMENTS_REQUEST_SUCCESS:
      return { ...state, appointments: payload, isLoading: false };
    case AppointmentsActionType.GET_APPOINTMENTS_REQUEST_FAILED:
      return { ...state, appointments: payload, isLoading: false };
    default:
      return state;
  }
};
