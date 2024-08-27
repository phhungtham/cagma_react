import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const submitLoginRequest = payload => dispatch({ type: ActionType.LOGIN_REQUEST, payload });
