import { ActionType } from './type';

const initState = {
  isLoading: false,
  cardCount: {},
};

export const cardCountReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.GET_CARD_COUNT_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.GET_CARD_COUNT_REQUEST_SUCCESS:
      return { ...state, cardCount: payload, isLoading: false };
    case ActionType.GET_CARD_COUNT_REQUEST_FAILED:
      return { ...state, cardCount: payload, isLoading: false };
    case ActionType.CLEAN_UP:
      return initState;
    default:
      return state;
  }
};
