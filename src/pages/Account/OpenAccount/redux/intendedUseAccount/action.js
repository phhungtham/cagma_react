import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const getIntendedUseAccountRequest = payload =>
  dispatch({ type: ActionType.GET_INTENDED_USE_ACCOUNT_REQUEST, payload });
export const cleanUpIntendedUseAccount = () => dispatch({ type: ActionType.CLEAN_UP });
