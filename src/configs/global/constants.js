export const delay = (timeout, value) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, timeout);
  });

export const EMPTY_OBJ = {};
export const EMPTY_ARRAY = [];

export const ICON_SIZES = {
  'w-12': '12',
  'w-16': '16',
  'w-20': '20',
  'w-24': '24',
  'w-32': '32',
  'w-36': '36',
  'w-40': '40',
  'w-44': '44',
  'w-48': '48',
};

export const AVATAR_SIZES = {
  'w-32': '32',
  'w-40': '40',
  'w-52': '52',
  'w-56': '56',
  'w-80': '80',
};

export const MENU_CODE = {
  NOTIFICATION: 'KHHO202001',
  ACCOUNT: 'KHCD800008',
  EXCHANGE_RATE: 'KHCD800007',
  CHECKING: 'KHIQ300002',
  INSTALLMENT_DEPOSIT: 'KHIQ300003',
  TIME_DEPOSIT: 'KHIQ300004',
  CARDS: 'KHCD800000',
  CARDS_TRANSACTION_HISTORY: 'KHCD800001',
  CARDS_MANAGE_PIN: 'KHCD800003',
  CARDS_ACTIVATE: 'KHCD800006',
  CARDS_ADD_NEW: 'KHCD800010',
  CARDS_NEW_CARD_LIST: 'KHCD800009',
  SHOW_PDF: 'KHCOMM0001',
  MERCHANT_CREATE_NEW: 'KHPA500009',
  MERCHANT_REQUEST_QR: 'KHPA500014',
  MERCHANT_SALES_HISTORY: 'KHPA500011',
  MERCHANT_SALES_ANALYSIS: 'KHPA500013',
  MERCHANT_GET_MORE_INTEREST: 'KHPA500015',
};

export const APP_LANGUAGE = {
  EN: 'en',
  KO: 'ko',
  KM: 'km',
};

export const SH_LCL_CORP_C = '161';

export const CARD_LIMIT_DEF = {
  DEBIT_GOLD: {
    // card code: 0008
    purchase_min: 10,
    purchase_max: 10000,
    withdrawal_min: 10,
    withdrawal_max: 10000,
    ERR_MIN: 'The minimum amount is 10.00 USD',
    ERR_MAX: 'The maximum amount is 10,000.00 USD',
  },
  DEBIT_CLASSIC: {
    // card code: 0006, 0007
    purchase_min: 10,
    purchase_max: 4000,
    withdrawal_min: 10,
    withdrawal_max: 4000,
    ERR_MIN: 'The minimum amount is 10.00 USD',
    ERR_MAX: 'The maximum amount is 4,000.00 USD',
  },
  DEBIT_VIRTUAL: {
    // card code: 0009
    purchase_min: 10,
    purchase_max: 4000,
    ERR_MIN: 'The minimum amount is 10.00 USD',
    ERR_MAX: 'The maximum amount is 4,000.00 USD',
  },
};

export const isProductionEnv = process.env.NODE_ENV === 'production';
export const isDevelopmentEnv = process.env.NODE_ENV === 'development';
