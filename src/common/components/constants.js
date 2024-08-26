export const InputTypes = {
  TEXT: 'text',
  PASSWORD: 'password',
  DATETIME: 'datetime',
  DATETIME_LOCAL: 'datetime-local',
  DATE: 'date',
  MONTH: 'month',
  TIME: 'time',
  WEEK: 'week',
  NUMBER: 'number',
  EMAIL: 'email',
  URL: 'url',
  SEARCH: 'search',
  TEL: 'tel',
  COLOR: 'color',
};

export const SIZE = {
  SMALL: 'small',
  LARGE: 'large',
};

export const INPUT_MODE = {
  ON_BACKGROUND: 'onBackground',
  NORMAL: 'normal',
};

export const TAG_NAME = {
  INPUT: 'input',
  TEXT_AREA: 'textarea',
};

export const BOX_INFO_TYPE = {
  INFO: 'info',
  NOTICE: 'notice',
  NEGATIVE: 'negative',
  NEGATIVE_DARK: 'negativeDark',
};

export const CARD_COLOR = {
  checking: '#14AEC6',
  savings: '#2EB086',
  loan: '#7466CE',
};

export const ICON_NOTIFY_TYPE = {
  DEBIT_NOTICE: 'Debit Notice',
  CREDIT_NOTICE: 'Credit Notice',
  SHINHAN_KHQR: 'Shinhan KHQR Pay Notice',
  DEFAULT: 'Default',
};

export const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export const INQUIRIES = { OM: '1M', TM: '3M', SM: '6M', custom: 'Custom' };
export const MONTH_VALUES = { '1M': 1, '3M': 3, '6M': 6 };

export const FAQCategory = [
  'All',
  'Sign up',
  'Login',
  'Internet Banking',
  'Mobile Banking',
  'Security/Authentication',
  'Errors/Bugs',
];

export const placementsMap = {
  top_left: 'top-start',
  top_right: 'top-end',
  top_center: 'top',
  bottom_left: 'bottom-start',
  bottom_right: 'bottom-end',
  bottom_center: 'bottom',
};

export const allowedPlacements = ['bottom', 'bottom-start', 'bottom-end', 'top', 'top-start', 'top-end'];
