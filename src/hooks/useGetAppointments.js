import { useSelector } from 'react-redux';

import { getAppointmentsRequest } from '@common/redux/appointments/action';
import { appointmentsReducer } from '@common/redux/appointments/reducer';
import { appointmentsSaga } from '@common/redux/appointments/saga';
import { appointmentList, appointmentsLoadState, getAppointmentsFailedMsg } from '@common/redux/appointments/selector';
import { AppointmentsFeatureName } from '@common/redux/appointments/type';

import useReducers from './useReducers';
import useSagas from './useSagas';

const useGetAppointments = () => {
  useReducers([{ key: AppointmentsFeatureName, reducer: appointmentsReducer }]);
  useSagas([{ key: AppointmentsFeatureName, saga: appointmentsSaga }]);
  const data = useSelector(appointmentList);
  const isLoading = useSelector(appointmentsLoadState);
  const error = useSelector(getAppointmentsFailedMsg);

  const sendRequest = (payload = {}) => {
    getAppointmentsRequest(payload);
  };

  return { data, sendRequest, isLoading, error };
};

export default useGetAppointments;
