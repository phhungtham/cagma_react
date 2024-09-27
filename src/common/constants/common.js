export const EMPTY_OBJ = {};
export const EMPTY_ARRAY = [];

export const MENU_CODE = {
  OPEN_ACCOUNT: 'CAPR010101',
  CHANGE_PROFILE: 'CAME030100',
  BRANCH_DIRECTORY: '',
  APPOINTMENT_MAIN: 'CAET010000',
  APPOINTMENT_MANAGEMENT: 'CAET010100',
  BOOK_APPOINTMENT: 'CAET010200',
  CARD_MAIN: '',
  ADD_NEW_CARD: 'CACA010100',
  ACTIVE_CARD: 'CACA010101',
  REPORT_LOST_CARD: 'CACA010102',
  REISSUE_CARD: '',
  E_ALERT_BALANCE: '',
};

export const SupportContactPhoneNumber = '18557446426';

export const SH_LCL_CORP_C = '161';

export const isProductionEnv = process.env.NODE_ENV === 'production';
export const isDevelopmentEnv = process.env.NODE_ENV === 'development';

export const APP_LANGUAGE = {
  EN: 'en',
  KO: 'ko',
  CA: 'ca',
};

export const delay = (timeout, value) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, timeout);
  });
