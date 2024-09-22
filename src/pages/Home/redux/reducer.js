import { EMPTY_OBJ } from '@common/constants/common';

import { ActionType } from './type';

const InitState = EMPTY_OBJ;

export const logoutReducer = (state = InitState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.LOGOUT_REQUEST_SUCCESS:
      return payload;
    default:
      return state;
  }
};
