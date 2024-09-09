import { dispatch } from 'shared/redux/store';

import { UserInfoActionType } from './type';

export const getUserInfoRequest = payload => dispatch({ type: UserInfoActionType.GET_USER_INFO_REQUEST, payload });
