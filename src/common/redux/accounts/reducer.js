import { ActionType } from './type';

const initState = {
  isLoading: false,
  accountList: {},
};

export const accountReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.GET_ACCOUNT_LIST_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.GET_ACCOUNT_LIST_REQUEST_SUCCESS:
      return { ...state, accountList: payload, isLoading: false };
    case ActionType.GET_ACCOUNT_LIST_REQUEST_FAILED:
      return { ...state, accountList: payload, isLoading: false };
    case ActionType.CLEAN_UP:
      return initState;
    default:
      return state;
  }
};
