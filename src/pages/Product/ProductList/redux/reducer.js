import { ActionType } from './type';

const initState = {
  isLoading: false,
  productList: {},
};

export const productReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.GET_PRODUCT_LIST_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.GET_PRODUCT_LIST_REQUEST_SUCCESS:
      return { ...state, productList: payload, isLoading: false };
    case ActionType.GET_PRODUCT_LIST_REQUEST_FAILED:
      return { ...state, productList: payload, isLoading: false };
    case ActionType.CLEAN_UP:
      return initState;
    default:
      return state;
  }
};
