import { ActionType } from './type';

const initState = {
  isLoading: false,
  productInterestRate: {},
};

export const productInterestRateReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.INQUIRY_PRODUCT_INTEREST_RATE_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.INQUIRY_PRODUCT_INTEREST_RATE_REQUEST_SUCCESS:
      return { ...state, productInterestRate: payload, isLoading: false };
    case ActionType.INQUIRY_PRODUCT_INTEREST_RATE_REQUEST_FAILED:
      return { ...state, productInterestRate: payload, isLoading: false };
    case ActionType.CLEAN_UP:
      return initState;
    default:
      return state;
  }
};
