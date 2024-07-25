import { EMPTY_OBJ } from 'configs/global/constants';
import { FeatureMerchantName } from './type';

export const merchantSelector = state => state[FeatureMerchantName] || EMPTY_OBJ;
export const merchantLoadState = state => state[FeatureMerchantName]?.isLoading;
export const merchantSelectedSelector = state => state[FeatureMerchantName]?.merchantSelected || EMPTY_OBJ;
export const merchantAmountSelector = state => state[FeatureMerchantName] || EMPTY_OBJ;
export const merchantNumFocus = state => state[FeatureMerchantName]?.focusMerchant || null;
export const transactionSelector = state => state[FeatureMerchantName]?.transactions || EMPTY_OBJ;
export const showCalendarSelector = state => state[FeatureMerchantName]?.isShowCalendar || false;

export const resetRedux = () => {};
