import { dispatch } from 'shared/redux/store';
import { ActionType } from './type';

export const getExchangeRateInfo = payload => dispatch({ type: ActionType.EXCHANGE_RATE_INFO, payload: payload });
