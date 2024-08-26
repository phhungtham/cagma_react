import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const logoutRequest = payload => dispatch({ type: ActionType.LOGOUT_REQUEST });
