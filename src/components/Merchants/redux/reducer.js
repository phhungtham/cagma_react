import { EMPTY_OBJ } from 'configs/global/constants';
import { ActionType } from './type';

const InitState = {
  isLoading: true,
  merchant: EMPTY_OBJ,
  merchantSelected: EMPTY_OBJ,
  focusCard: null,
  transactions: EMPTY_OBJ
};

export const myMerchantReducer = (state = InitState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.MERCHANT_REQUEST_SUCCESS:
      return { ...state, isLoading: false, cards: payload.elData };
    case ActionType.MERCHANT_REQUEST_FAILED:
      return { ...state, isLoading: false, cards: payload };
    case ActionType.MERCHANT_SELECTED:
      return { ...state, merchantSelected: payload };
    case ActionType.MERCHANT_REFRESH_SUCCESS:
      return { ...state, isLoading: false, cards: payload };
    case ActionType.MERCHANT_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.MERCHANT_SET_LOADING:
      return { ...state, isLoading: payload };

    case ActionType.COMMON_CODE_LIST_REQUEST_SUCCESS:
      return { ...state, commonCode: payload.elData };

    case ActionType.FOCUS_MERCHANT:
      return { ...state, focusMerchant: payload };
    case ActionType.SALES_ANALYSIS_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.SALES_ANALYSIS_REQUEST_SUCCESS:
      return { ...state, transactions: payload, transactionBase: payload, isLoading: false };
    case ActionType.SALES_ANALYSIS_REQUEST_FAILED:
      return { ...state, transactions: payload, transactionBase: payload, isLoading: false };
    case ActionType.SALES_ANALYSIS_EMPTY_LIST:
      return { ...state, transactions: EMPTY_OBJ, transactionBase: EMPTY_OBJ };
    case ActionType.SHOW_CALENDAR:
      return { ...state, isShowCalendar: payload };

    case ActionType.RESET_REDUX:
      return InitState;

    default:
      return state;
  }
};
