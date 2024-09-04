import { dispatch } from 'shared/redux/store';

import { ActionType } from './type';

export const inquiryProductInterestRateRequest = payload =>
  dispatch({ type: ActionType.INQUIRY_PRODUCT_INTEREST_RATE_REQUEST, payload });
