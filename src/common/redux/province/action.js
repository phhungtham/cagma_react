import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const getProvinceListRequest = payload => dispatch({ type: ActionType.GET_PROVINCE_LIST_REQUEST, payload });
export const cleanUpProvince = () => dispatch({ type: ActionType.CLEAN_UP });
