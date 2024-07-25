import { EMPTY_OBJ } from 'configs/global/constants';
import { FeatureDebitCardName } from './type';

export const cardsSelector = state => state[FeatureDebitCardName] || EMPTY_OBJ;
export const cardsLoadState = state => state[FeatureDebitCardName]?.isLoading;

export const activateCardCfm = state => state[FeatureDebitCardName]?.activateCardCfm;
export const activateCardFailed = state => state[FeatureDebitCardName]?.activateCardFailed;

export const transactionSelector = state => state[FeatureDebitCardName]?.transactions || EMPTY_OBJ;
export const cardSelectedSelector = state => state[FeatureDebitCardName]?.cardSelected || EMPTY_OBJ;
export const commonCodeListSelector = state => state[FeatureDebitCardName]?.commonCode || EMPTY_OBJ;
export const cardVerificationData = state => state[FeatureDebitCardName]?.cardVerifyData || EMPTY_OBJ;
export const searchLengthSelector = state => state[FeatureDebitCardName]?.searchLength || null;
export const newCardTemplateSelector = state => state[FeatureDebitCardName] || EMPTY_OBJ;
export const cardAmountSelector = state => state[FeatureDebitCardName] || EMPTY_OBJ;

export const cardNumFocus = state => state[FeatureDebitCardName]?.focusCard || null;
export const showCalendarSelector = state => state[FeatureDebitCardName]?.isShowCalendar || false;

export const resetRedux = () => {};
