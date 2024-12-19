import { RequiredLoginCodes } from '@common/constants/error';
import { apiCall } from '@shared/api';

const useApi = () => {
  const requestApi = async (endpoint, payload = {}) => {
    const response = await apiCall(endpoint, 'POST', payload);
    const isSuccess = response?.data?.elHeader?.resSuc;
    let error = '';
    let errorCode = '';
    let data = {};
    let requiredLogin = false;
    if (isSuccess) {
      data = response?.data?.elData || {};
    } else {
      error = response?.data?.elHeader?.resMsg || '';
      errorCode = response?.data?.elHeader?.resCode;
      requiredLogin = RequiredLoginCodes.includes(errorCode);
    }

    return { isSuccess, error, data, errorCode, requiredLogin };
  };

  return { requestApi };
};

export default useApi;
