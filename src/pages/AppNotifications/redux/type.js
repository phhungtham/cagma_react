export const FeatureAppNotificationName = 'app__notification';

export const ActionType = {
  // Checking Notify..
  GET_CHECKING_NOTIFY_REQUEST: `${FeatureAppNotificationName}/GET_CHECKING_NOTIFY_REQUEST`,
  GET_CHECKING_NOTIFY_REQUEST_SUCCESS: `${FeatureAppNotificationName}/GET_CHECKING_NOTIFY_REQUEST_SUCCESS`,
  GET_CHECKING_NOTIFY_REQUEST_FAILED: `${FeatureAppNotificationName}/GET_CHECKING_NOTIFY_REQUEST_FAILED`,

  // Checking Notify..
  GET_NOTICES_NOTIFY_REQUEST: `${FeatureAppNotificationName}/GET_NOTICES_NOTIFY_REQUEST`,
  GET_NOTICES_NOTIFY_REQUEST_SUCCESS: `${FeatureAppNotificationName}/GET_NOTICES_NOTIFY_REQUEST_SUCCESS`,
  GET_NOTICES_NOTIFY_REQUEST_FAILED: `${FeatureAppNotificationName}/GET_NOTICES_NOTIFY_REQUEST_FAILED`,

  // Benefits Notify..
  GET_BENEFITS_NOTIFY_REQUEST: `${FeatureAppNotificationName}/GET_BENEFITS_NOTIFY_REQUEST`,
  GET_BENEFITS_NOTIFY_REQUEST_SUCCESS: `${FeatureAppNotificationName}/GET_BENEFITS_NOTIFY_REQUEST_SUCCESS`,
  GET_BENEFITS_NOTIFY_REQUEST_FAILED: `${FeatureAppNotificationName}/GET_BENEFITS_NOTIFY_REQUEST_FAILED`,
  GET_BANNER_SEQ: `${FeatureAppNotificationName}/GET_BANNER_SEQ`,
  SET_TAB_INDEX: `${FeatureAppNotificationName}/SET_TAB_INDEX`,
  CLEAN_UP: `${FeatureAppNotificationName}/CLEAN_UP`,
};

export const NotificationTab = {
  TRANSACTIONS: 0,
  YOUR_OFFERS: 1,
  PROMOTIONS: 2,
};

export const AppNotifyURLs = {
  CHECKING_NOTIFY: '/kh/ho/KHHO001.pwkjson',
  NOTICES_NOTIFY: '/kh/ho/KHHO001.pwkjson',
  BENEFIT_NOTIFY: '/kh/ho/KHHO002.pwkjson',
};
