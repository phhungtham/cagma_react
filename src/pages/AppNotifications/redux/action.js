import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const setTabIndex = payload => dispatch({ type: ActionType.SET_TAB_INDEX, payload: payload });

export const cleanupAppNotification = () => dispatch({ type: ActionType.CLEAN_UP });
