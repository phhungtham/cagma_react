import { EMPTY_OBJ } from '@common/constants/common';

import { ActionType } from './type';

const initState = {
  isNativeRedirect: false,
  currentLanguage: undefined,
  isNativeClickBack: false,
  nativeParams: EMPTY_OBJ,
  appPath: '',
};

export const appGlobalReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.REDIRECT_REQUEST:
      return { ...state, isNativeRedirect: !state.isNativeRedirect };

    case ActionType.LANGUAGE_REQUEST:
      return { ...state, currentLanguage: payload };

    case ActionType.BACK_EVENT:
      return { ...state, isNativeClickBack: payload };

    case ActionType.NATIVE_PARAMS:
      return { ...state, nativeParams: payload };

    case ActionType.APP_PATH:
      return { ...state, appPath: payload };

    default:
      return state;
  }
};
