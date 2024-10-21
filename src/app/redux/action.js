import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const setIsNativeRedirect = () => dispatch({ type: ActionType.REDIRECT_REQUEST });
export const setCurrentLanguage = payload => dispatch({ type: ActionType.LANGUAGE_REQUEST, payload: payload });
export const setIsNativeClickBack = payload => dispatch({ type: ActionType.BACK_EVENT, payload: payload });
export const setNativeParams = payload => {
  dispatch({ type: ActionType.NATIVE_PARAMS, payload: payload });
};
export const setAppPath = payload => dispatch({ type: ActionType.APP_PATH, payload: payload });
