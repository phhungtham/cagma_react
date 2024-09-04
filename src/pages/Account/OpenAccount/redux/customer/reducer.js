import { ActionType } from './type';

const initState = {
  isLoading: false,
  customer: {},
};

export const customerReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.GET_CUSTOMER_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.GET_CUSTOMER_REQUEST_SUCCESS:
      return { ...state, customer: payload, isLoading: false };
    case ActionType.GET_CUSTOMER_REQUEST_FAILED:
      return { ...state, customer: payload, isLoading: false };
    case ActionType.CLEAN_UP:
      return initState;
    default:
      return state;
  }
};
