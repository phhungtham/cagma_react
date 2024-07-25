import { dispatch } from 'shared/redux/store';
import { ActionType } from './type';

export const getCheckingNotificationList = payload =>
  dispatch({ type: ActionType.GET_CHECKING_NOTIFY_REQUEST, payload });

export const getNoticesNotificationList = payload =>
  dispatch({ type: ActionType.GET_NOTICES_NOTIFY_REQUEST, payload });

export const getBenefitNotificationList = payload =>
  dispatch({ type: ActionType.GET_BENEFITS_NOTIFY_REQUEST, payload });
  
export const setBannerSeqState = payload => dispatch({ type: ActionType.GET_BANNER_SEQ, payload: payload });

export const setTabIndex = payload => dispatch({ type: ActionType.SET_TAB_INDEX, payload: payload });

export const cleanupAppNotification = () => dispatch({ type: ActionType.CLEAN_UP });
