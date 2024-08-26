import { ActionType } from './type';

const initState = {
  isLoading: false,
  listAccount: {},
};

export const accountReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.GET_ACCOUNT_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.GET_ACCOUNT_REQUEST_SUCCESS:
      return { ...state, listAccount: payload, isLoading: false };
    case ActionType.GET_ACCOUNT_REQUEST_FAILED:
      return { ...state, listAccount: payload, isLoading: false };
    case ActionType.CLEAN_UP:
      return initState;
    default:
      return state;
  }
};
