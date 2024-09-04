import { useSelector } from 'react-redux';

import { getProvinceCode } from '@common/constants/commonCode';
import { getProvinceListRequest } from '@common/redux/province/action';
import { provinceReducer } from '@common/redux/province/reducer';
import { provinceSaga } from '@common/redux/province/saga';
import { provinceList } from '@common/redux/province/selector';
import { ProvinceFeatureName } from '@common/redux/province/type';

import useReducers from './useReducers';
import useSagas from './useSagas';

const useProvince = () => {
  useReducers([{ key: ProvinceFeatureName, reducer: provinceReducer }]);
  useSagas([{ key: ProvinceFeatureName, saga: provinceSaga }]);
  const data = useSelector(provinceList);

  const requestGetProvinceList = () => {
    getProvinceListRequest({ code: getProvinceCode });
  };

  return { data, requestGetProvinceList };
};

export default useProvince;
