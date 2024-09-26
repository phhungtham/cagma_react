import { apiCall } from '@shared/api';

const useApi = () => {
  const requestApi = async (endpoint, payload = {}) => {
    const response = await apiCall(endpoint, 'POST', payload);
    const isSuccess = response?.data?.elHeader?.resSuc;
    let error = '';
    let data = {};
    if (isSuccess) {
      data = response?.data?.elData || {};
    } else {
      error = response?.data?.elHeader?.resMsg || '';
    }

    return { isSuccess, error, data };
  };

  return { requestApi };
};

export default useApi;
