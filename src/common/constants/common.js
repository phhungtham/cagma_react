export const EMPTY_OBJ = {};
export const EMPTY_ARRAY = [];

export const MENU_CODE = {
  NOTIFICATION: 'CAHO010101',
  OPEN_ACCOUNT: 'CAPR010100',
  CHANGE_PROFILE: 'CAME030100',
  APPOINTMENT_MAIN: 'CAET010000',
  BRANCH_DIRECTORY: 'CAET010209',
  APPOINTMENT_MANAGEMENT: 'CAET010100',
  BOOK_APPOINTMENT: 'CAET010200',
  CARD_MAIN: 'CACA010000',
  ADD_NEW_CARD: 'CACA010100',
  ACTIVE_CARD: 'CACA010101',
  REPORT_LOST_CARD: 'CACA010200',
  REISSUE_CARD: 'CACA010102',
  RELEASE_CARD: 'CACA010201',
  E_ALERT_MANAGEMENT: 'CAME050000',
  E_ALERT_BALANCE: 'CAME050100',
  ACCOUNT_ACTIVITY_BANKING: 'CAIQ010100',
  ACCOUNT_ACTIVITY_INVESTMENT: 'CAIQ010200',
  TRANSFER_LIMIT_SETTING: 'CAME040100',
};

export const SupportContactPhoneNumber = '18557446426';

export const SH_LCL_CORP_C = '511';

export const isProductionEnv = process.env.NODE_ENV === 'production';
export const isDevelopmentEnv = process.env.NODE_ENV === 'development';

export const APP_LANGUAGE = {
  EN: 'en',
  KO: 'ko',
  CA: 'ca',
};

export const EMAIL_VERIFY_IN_SECONDS = 180; //3 minutes
export const EMAIL_VERIFY_RETRY_MAX = 5;

export const delay = (timeout, value) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, timeout);
  });

export const BiometricAuthType = {
  FACE_ID: 'faceId',
  TOUCH_ID: 'touchId',
};
