import { ActionType } from './type';

const initState = {
  isLoading: false,
  exchangeRateInfo: []
};

export const exchangeRateReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.EXCHANGE_RATE_INFO:
      return { ...state, isLoading: true };
    case ActionType.EXCHANGE_RATE_INFO_SUCCESS:
      return { ...state, exchangeRateInfo: payload, isLoading: false };
    case ActionType.CLEAN_UP:
      return initState;
    default:
      return state;
  }
};
