import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const getAccountListRequest = payload => dispatch({ type: ActionType.GET_ACCOUNT_LIST_REQUEST, payload });
export const cleanUpAccounts = () => dispatch({ type: ActionType.CLEAN_UP });
