import { useSelector } from 'react-redux';

import { inquiryProductInterestRateRequest } from '@common/redux/productInterestRate/action';
import { productInterestRateReducer } from '@common/redux/productInterestRate/reducer';
import { productInterestRateSaga } from '@common/redux/productInterestRate/saga';
import { productInterestRateInfo, productInterestRateLoadState } from '@common/redux/productInterestRate/selector';
import { ProductInterestRateFeatureName } from '@common/redux/productInterestRate/type';

import useReducers from './useReducers';
import useSagas from './useSagas';

const useProductInterestRate = () => {
  useReducers([{ key: ProductInterestRateFeatureName, reducer: productInterestRateReducer }]);
  useSagas([{ key: ProductInterestRateFeatureName, saga: productInterestRateSaga }]);
  const data = useSelector(productInterestRateInfo);
  const isLoading = useSelector(productInterestRateLoadState);

  const sendRequest = params => {
    inquiryProductInterestRateRequest(params);
  };

  return { data, sendRequest, isLoading };
};

export default useProductInterestRate;
