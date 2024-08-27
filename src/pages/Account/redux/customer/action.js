import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const getCustomerInfoRequest = payload => dispatch({ type: ActionType.GET_CUSTOMER_REQUEST, payload });
export const cleanUpCustomer = () => dispatch({ type: ActionType.CLEAN_UP });
