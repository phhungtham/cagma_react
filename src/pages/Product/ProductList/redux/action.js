import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const getProductListRequest = payload => dispatch({ type: ActionType.GET_PRODUCT_LIST_REQUEST, payload });
export const cleanUpProducts = () => dispatch({ type: ActionType.CLEAN_UP });
