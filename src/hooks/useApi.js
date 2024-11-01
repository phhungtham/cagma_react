import { apiCall } from '@shared/api';

const useApi = () => {
  const requestApi = async (endpoint, payload = {}) => {
    const response = await apiCall(endpoint, 'POST', payload);
    const isSuccess = response?.data?.elHeader?.resSuc;
    let error = '';
    let errorCode = '';
    let data = {};
    if (isSuccess) {
      data = response?.data?.elData || {};
    } else {
      error = response?.data?.elHeader?.resMsg || '';
      errorCode = response?.data?.elHeader?.resCode;
    }

    return { isSuccess, error, data, errorCode };
  };

  return { requestApi };
};

export default useApi;
