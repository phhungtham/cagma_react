import { AppNotificationFeatureName } from './type';

export const tabIdx = state => {
  return state[AppNotificationFeatureName]?.tabIdx;
};
