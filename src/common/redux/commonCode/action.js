import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const inquiryCommonCodeRequest = payload => dispatch({ type: ActionType.INQUIRY_COMMON_CODE_REQUEST, payload });
export const cleanUpCommonCode = () => dispatch({ type: ActionType.CLEAN_UP });
