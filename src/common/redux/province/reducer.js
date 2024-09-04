import { ActionType } from './type';

const initState = {
  isLoading: false,
  province: {},
};

export const provinceReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.GET_PROVINCE_LIST_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.GET_PROVINCE_LIST_REQUEST_SUCCESS:
      return { ...state, province: payload, isLoading: false };
    case ActionType.GET_PROVINCE_LIST_REQUEST_FAILED:
      return { ...state, province: payload, isLoading: false };
    case ActionType.CLEAN_UP:
      return initState;
    default:
      return state;
  }
};
