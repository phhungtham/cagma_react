import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const getTransactionNotificationList = payload =>
  dispatch({ type: ActionType.GET_TRANSACTIONS_NOTIFY_REQUEST, payload });

export const getOfferNotificationList = payload => dispatch({ type: ActionType.GET_OFFERS_NOTIFY_REQUEST, payload });

export const getPromotionNotificationList = payload =>
  dispatch({ type: ActionType.GET_PROMOTIONS_NOTIFY_REQUEST, payload });

export const setTabIndex = payload => dispatch({ type: ActionType.SET_TAB_INDEX, payload: payload });

export const cleanupAppNotification = () => dispatch({ type: ActionType.CLEAN_UP });
