import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import isEmpty from '@utilities/isEmpty';
import { nativeRedirectStateSelector } from 'app/redux/selector';
import { $h } from 'navigation/wmatrix_config';

const useLoginInfo = (props = {}) => {
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
    if (process.env.NODE_ENV === 'production') {
      getLoginInfo();
    } else {
      isSendingRef.current = false;
      if (localStorage.getItem('isLogin')) {
        setState(s => ({
          ...s,
          isLoading: false,
          isLogin: true,
          error: '',
          loginInfo: {},
        }));
      }
    }
  }, [getLoginInfo, isNativeRedirect]);

  return {
    loginInfo: state.loginInfo,
    isLoading: state.isLoading,
    error: state.error,
    isLogin: state.isLogin,
  };
};

export default useLoginInfo;
