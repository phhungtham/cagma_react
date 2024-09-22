import { EMPTY_OBJ } from '@common/constants/common';

import { FeatureLoginName } from './type';

export const loginSelector = state => state[FeatureLoginName] || EMPTY_OBJ;
export const loginStatusSelector = state => state[FeatureLoginName]?.elHeader?.resSuc;
export const loginStatusMsg = state => state[FeatureLoginName]?.elHeader?.resMsg;
