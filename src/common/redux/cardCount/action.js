import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const getCardCountRequest = payload => dispatch({ type: ActionType.GET_CARD_COUNT_REQUEST, payload });
export const cleanUpCardCount = () => dispatch({ type: ActionType.CLEAN_UP });
