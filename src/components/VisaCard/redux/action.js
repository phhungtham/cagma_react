import { dispatch } from 'shared/redux/store';
import { ActionType } from './type';

export const getCardsRequest = payload => dispatch({ type: ActionType.DEBIT_CARD_REQUEST, payload });
export const getCardsRefresh = payload => dispatch({ type: ActionType.DEBIT_CARD_REFRESH_SUCCESS, payload });
export const setLoading = payload => dispatch({ type: ActionType.DEBIT_CARD_SET_LOADING, payload });
export const handleActivateCard = payload => dispatch({ type: ActionType.ACTIVATE_CARD_REQUEST, payload });
export const resetActivateCardStatus = () => dispatch({ type: ActionType.ACTIVATE_CARD_RESET });
export const getTransactionRequest = payload => dispatch({ type: ActionType.TRANSACTION_REQUEST, payload });
export const selectCard = payload => dispatch({ type: ActionType.DEBIT_CARD_SELECTED, payload });
export const searchTransaction = payload => dispatch({ type: ActionType.SEARCH_TRANSACTION, payload });
export const commonCodeRequest = payload => dispatch({ type: ActionType.COMMON_CODE_LIST_REQUEST, payload });
export const resetTransactions = payload => dispatch({ type: ActionType.RESET_TRANSACTIONS, payload });
export const emptyTransaction = () => dispatch({ type: ActionType.TRANSACTION_EMPTY_LIST });
export const reportCardLost = payload => dispatch({ type: ActionType.REPORT_CARD_LOST_REQUEST, payload });
export const chooseNewCardTemplate = payload => dispatch({ type: ActionType.CHOOSE_NEW_CARD_TEMPLATE, payload });
export const verificationCardData = payload => dispatch({ type: ActionType.CARD_VERIFICATION_DATA, payload });
export const setCardAmount = payload => dispatch({ type: ActionType.CARD_SET_AMOUNT, payload });
export const setCardFocus = payload => dispatch({ type: ActionType.FOCUS_CARD, payload });
export const setIsShowCalendar = payload => dispatch({ type: ActionType.SHOW_CALENDAR, payload });
export const resetRedux = () => dispatch({ type: ActionType.RESET_REDUX });
