import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import isEmpty from '@utilities/isEmpty';
import { setLoginState } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import { nativeRedirectStateSelector } from 'app/redux/selector';
import { APP_GLOBAL } from 'app/redux/type';
import { $h } from 'navigation/wmatrix_config';

import useReducers from './useReducers';

const useLoginInfo = (props = {}) => {
  useReducers([{ key: APP_GLOBAL, reducer: appGlobalReducer }]);
  const { isSend = false } = props;
  const isSendingRef = useRef(false);
  const isNativeRedirect = useSelector(nativeRedirectStateSelector);

  const [state, setState] = useState({
    isLogin: null,
    isLoading: true,
    error: null,
    loginInfo: {},
  });

  const getLoginInfo = useCallback(() => {
    const onSuccessGetLoginInfo = res => {
      if (isEmpty(res)) {
        onFailGetLoginInfo(res);
        return;
      }
      isSendingRef.current = false;
      setState(s => ({
        ...s,
        isLoading: false,
        isLogin: true,
        error: null,
        loginInfo: res,
      }));
      setLoginState(true);
    };

    const onFailGetLoginInfo = res => {
      isSendingRef.current = false;
      setState(s => ({
        ...s,
        isLoading: false,
        isLogin: false,
        error: res,
        loginInfo: {},
      }));
      setLoginState(false);
    };

    if (isSendingRef.current === false) {
      isSendingRef.current = true;
      setState(s => ({
        ...s,
        error: null,
      }));

      $h.exec(
        userInfo => {
          if (userInfo.msg === 'fail') {
            onFailGetLoginInfo({});
          } else {
            onSuccessGetLoginInfo(userInfo.data || {});
          }
        },
        'GMCommon',
        'getLoginInfo',
        []
      );
    }
  }, []);

  useEffect(() => {
    if (isSend === true && process.env.NODE_ENV === 'production') {
      getLoginInfo();
    }
  }, [getLoginInfo, isSend, isNativeRedirect]);

  return {
    loginInfo: state.loginInfo,
    isLoading: state.isLoading,
    error: state.error,
    isLogin: state.isLogin,
  };
};

export default useLoginInfo;
