import { EMPTY_OBJ } from 'configs/global/constants';
import { ActionType } from './type';

const InitState = {
  isLoading: true,
  cards: EMPTY_OBJ,
  activateCardCfm: EMPTY_OBJ,
  activateCardFailed: EMPTY_OBJ,
  transactions: EMPTY_OBJ,
  transactionBase: EMPTY_OBJ,
  manageCardPin: EMPTY_OBJ,
  cardSelected: EMPTY_OBJ,
  commonCode: EMPTY_OBJ,
  searchLength: null,
  manageLimit: EMPTY_OBJ,
  newCardTemplate: EMPTY_OBJ,
  cardVerifyData: EMPTY_OBJ,
  cardAmount: EMPTY_OBJ,
  focusCard: null,
  isShowCalendar: false
};

export const debitCardReducer = (state = InitState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.DEBIT_CARD_REQUEST_SUCCESS:
      return { ...state, isLoading: false, cards: payload.elData };
    case ActionType.DEBIT_CARD_REQUEST_FAILED:
      return { ...state, isLoading: false, cards: payload };
    case ActionType.DEBIT_CARD_SELECTED:
      return { ...state, cardSelected: payload };
    case ActionType.DEBIT_CARD_REFRESH_SUCCESS:
      return { ...state, isLoading: false, cards: payload };
    case ActionType.DEBIT_CARD_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.DEBIT_CARD_SET_LOADING:
      return { ...state, isLoading: payload };

    case ActionType.ACTIVATE_CARD_REQUEST_SUCCESS:
      return { ...state, activateCardCfm: payload.elData };
    case ActionType.ACTIVATE_CARD_REQUEST_FAILED:
      return { ...state, activateCardFailed: payload.elHeader };
    case ActionType.ACTIVATE_CARD_RESET:
      return { ...state, activateCardCfm: EMPTY_OBJ, activateCardFailed: { ...state.activateCardFailed, resMsg: '' } };

    case ActionType.TRANSACTION_REQUEST:
      return { ...state, isLoading: true };
    case ActionType.TRANSACTION_REQUEST_SUCCESS:
      return { ...state, transactions: payload, transactionBase: payload, isLoading: false };
    case ActionType.TRANSACTION_REQUEST_FAILED:
      return { ...state, transactions: payload, transactionBase: payload, isLoading: false };
    case ActionType.TRANSACTION_EMPTY_LIST:
      return { ...state, transactions: EMPTY_OBJ, transactionBase: EMPTY_OBJ };

    case ActionType.MANAGE_CARD_PIN_REQUEST_SUCCESS:
      return { ...state, manageCardPin: payload.elData };
    case ActionType.MANAGE_CARD_PIN_REQUEST_FAILED:
      return { ...state, manageCardPin: payload };

    case ActionType.COMMON_CODE_LIST_REQUEST_SUCCESS:
      return { ...state, commonCode: payload.elData };

    case ActionType.SEARCH_TRANSACTION:
      if (!payload) return state;
      const transList = [...state.transactionBase.elData.list];
      const transactionFiltered = transList.filter(trans =>
        trans?.card_trx_mcht_nm.toLocaleLowerCase().includes(payload.toLocaleLowerCase())
      );
      return {
        ...state,
        searchLength: transactionFiltered.length,
        transactions: {
          ...state.transactions,
          elData: {
            ...state.transactions.elData,
            list: [...transactionFiltered],
            list_cnt: transactionFiltered.length
          }
        }
      };

    case ActionType.RESET_TRANSACTIONS:
      return { ...state, searchLength: null, transactions: { ...state.transactionBase } };
    case ActionType.CHOOSE_NEW_CARD_TEMPLATE:
      return { ...state, newCardTemplate: payload };
    case ActionType.CARD_VERIFICATION_DATA:
      return { ...state, cardVerifyData: payload };
    case ActionType.CARD_SET_AMOUNT:
      return { ...state, cardAmount: payload };
    case ActionType.FOCUS_CARD:
      return { ...state, focusCard: payload };
    case ActionType.SHOW_CALENDAR:
      return { ...state, isShowCalendar: payload };

    case ActionType.RESET_REDUX:
      return InitState;

    default:
      return state;
  }
};
