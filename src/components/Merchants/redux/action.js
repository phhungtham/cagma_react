import { dispatch } from 'shared/redux/store';
import { ActionType } from './type';

export const getMerchantsRequest = payload => dispatch({ type: ActionType.MERCHANT_REQUEST, payload });
export const setLoading = payload => dispatch({ type: ActionType.MERCHANT_SET_LOADING, payload });
export const selectMerchant = payload => dispatch({ type: ActionType.MERCHANT_SELECTED, payload });
export const setMerchantFocus = payload => dispatch({ type: ActionType.FOCUS_MERCHANT, payload });
export const getSalesAnalysis = payload => dispatch({ type: ActionType.SALES_ANALYSIS_REQUEST, payload });
export const setIsShowCalendar = payload => dispatch({ type: ActionType.SHOW_CALENDAR, payload });

