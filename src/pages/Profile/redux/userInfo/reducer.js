import { UserInfoActionType } from './type';

const initState = {
  isLoading: false,
  userInfo: {},
};

export const userInfoReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case UserInfoActionType.GET_USER_INFO_REQUEST:
      return { ...state, isLoading: true };
    case UserInfoActionType.GET_USER_INFO_REQUEST_SUCCESS:
      return { ...state, userInfo: payload, isLoading: false };
    case UserInfoActionType.GET_USER_INFO_REQUEST_FAILED:
      return { ...state, userInfo: payload, isLoading: false };
    default:
      return state;
  }
};
