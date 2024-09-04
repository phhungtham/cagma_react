import { useSelector } from 'react-redux';

import { getCardCountRequest } from '@common/redux/cardCount/action';
import { cardCountReducer } from '@common/redux/cardCount/reducer';
import { cardCountSaga } from '@common/redux/cardCount/saga';
import { cardCountInfo, cardCountLoadState } from '@common/redux/cardCount/selector';
import { FeatureName } from '@common/redux/cardCount/type';

import useReducers from './useReducers';
import useSagas from './useSagas';

const useCardCount = () => {
  useReducers([{ key: FeatureName, reducer: cardCountReducer }]);
  useSagas([{ key: FeatureName, saga: cardCountSaga }]);
  const data = useSelector(cardCountInfo);
  const isLoading = useSelector(cardCountLoadState);

  const requestGetCardCount = payload => {
    getCardCountRequest(payload);
  };

  return { data, isLoading, requestGetCardCount };
};

export default useCardCount;
