import { ActionType } from './type';

const initState = {
  isLoading: false,
  commonCode: {},
};

export const commonCodeReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.INQUIRY_COMMON_CODE_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.INQUIRY_COMMON_CODE_REQUEST_SUCCESS:
      return { ...state, commonCode: payload, isLoading: false };
    case ActionType.INQUIRY_COMMON_CODE_REQUEST_FAILED:
      return { ...state, commonCode: payload, isLoading: false };
    case ActionType.CLEAN_UP:
      return initState;
    default:
      return state;
  }
};
