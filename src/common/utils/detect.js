import { ICON_NOTIFY_TYPE } from '@common/components/constants';

export const detectIconNotifyType = type => {
  switch (type) {
    case ICON_NOTIFY_TYPE.DEBIT_NOTICE:
      return 'Debit Notice';
    case ICON_NOTIFY_TYPE.CREDIT_NOTICE:
      return 'Credit Notice';
    case ICON_NOTIFY_TYPE.SHINHAN_KHQR:
      return 'Shinhan KHQR Pay Notice';
    default:
      return 'Default';
  }
};

/**
 * It returns true if the type is 1 (read), and false if the type is 0 (unread)
 * @returns a boolean value.
 */
export const detectNotifyStatus = type => {
  if (type === 0) {
    return false;
  } else if (type === 1) {
    return true;
  }
};
