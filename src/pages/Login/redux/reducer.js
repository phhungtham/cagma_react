import { EMPTY_OBJ } from 'configs/global/constants';

import { ActionType } from './type';

const InitState = EMPTY_OBJ;

export const loginReducer = (state = InitState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.LOGIN_REQUEST_SUCCESS:
      return payload;
    case ActionType.LOGIN_REQUEST_FAILED:
      return payload;
    default:
      return state;
  }
};
