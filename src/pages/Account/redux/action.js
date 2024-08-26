import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const getAccountResquest = payload => dispatch({ type: ActionType.GET_ACCOUNT_REQUEST, payload });
export const createAccountRequest = payload => dispatch({ type: ActionType.CREATE_ACCOUNT_REQUEST, payload });
export const cleanUpAccounts = () => dispatch({ type: ActionType.CLEAN_UP });
