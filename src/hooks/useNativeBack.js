import { setIsNativeClickBack } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import { backEventSelector } from 'app/redux/selector';
import { APP_GLOBAL } from 'app/redux/type';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useReducers from './useReducers';

const useNativeBack = callback => {
  useReducers([{ key: APP_GLOBAL, reducer: appGlobalReducer }]);
  const isNativeBack = useSelector(backEventSelector || false);

  useEffect(() => {
    if (isNativeBack) {
      callback();
    }
    return () => setIsNativeClickBack(false);
  }, [isNativeBack]);
};
export default useNativeBack;
