import { useSelector } from 'react-redux';

import { inquiryCommonCodeRequest } from '@common/redux/commonCode/action';
import { commonCodeReducer } from '@common/redux/commonCode/reducer';
import { commonCodeSaga } from '@common/redux/commonCode/saga';
import { commonCodeInfo, commonCodeLoadState } from '@common/redux/commonCode/selector';
import { CommonCodeFeatureName } from '@common/redux/commonCode/type';

import useReducers from './useReducers';
import useSagas from './useSagas';

const useCommonCode = () => {
  useReducers([{ key: CommonCodeFeatureName, reducer: commonCodeReducer }]);
  useSagas([{ key: CommonCodeFeatureName, saga: commonCodeSaga }]);
  const data = useSelector(commonCodeInfo);
  const isLoading = useSelector(commonCodeLoadState);

  const sendRequest = code => {
    inquiryCommonCodeRequest({ code });
  };

  return { data, sendRequest, isLoading };
};

export default useCommonCode;
