import { ActionType } from './type';

const initState = {
  isLoading: false,
  intendedUseAccount: {},
};

export const intendedUseAccountReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.GET_INTENDED_USE_ACCOUNT_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.GET_INTENDED_USE_ACCOUNT_REQUEST_SUCCESS:
      return { ...state, intendedUseAccount: payload, isLoading: false };
    case ActionType.GET_INTENDED_USE_ACCOUNT_REQUEST_FAILED:
      return { ...state, intendedUseAccount: payload, isLoading: false };
    case ActionType.CLEAN_UP:
      return initState;
    default:
      return state;
  }
};
