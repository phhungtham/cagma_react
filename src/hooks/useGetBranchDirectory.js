import { useSelector } from 'react-redux';

import { getBranchDirectoryRequest } from '@common/redux/branchDirectory/action';
import { branchDirectoryReducer } from '@common/redux/branchDirectory/reducer';
import { branchDirectorySaga } from '@common/redux/branchDirectory/saga';
import { branchDirectoryList, branchDirectoryLoadState } from '@common/redux/branchDirectory/selector';
import { BranchDirectoryFeatureName } from '@common/redux/branchDirectory/type';

import useReducers from './useReducers';
import useSagas from './useSagas';

const useGetBranchDirectory = () => {
  useReducers([{ key: BranchDirectoryFeatureName, reducer: branchDirectoryReducer }]);
  useSagas([{ key: BranchDirectoryFeatureName, saga: branchDirectorySaga }]);
  const data = useSelector(branchDirectoryList);
  const isLoading = useSelector(branchDirectoryLoadState);

  const sendRequest = () => {
    getBranchDirectoryRequest();
  };

  return { data, sendRequest, isLoading };
};

export default useGetBranchDirectory;
