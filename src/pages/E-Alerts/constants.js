import { eAlertLabels } from '@common/constants/labels';

export const EAlertCustomerMethod = {
  EMAIL: '1',
  APP_PUSH: '2',
};

export const eAlertSettingMethodOptions = [
  {
    label: eAlertLabels.email,
    value: EAlertCustomerMethod.EMAIL,
  },
  {
    label: eAlertLabels.appPush,
    value: EAlertCustomerMethod.APP_PUSH,
  },
];

export const eAlertMoneyBalanceOptions = [
  {
    label: eAlertLabels.zeroCurrency,
    value: 0,
  },
  {
    label: eAlertLabels.oneHundredCurrency,
    value: 100,
  },
  {
    label: eAlertLabels.twoHundredCurrency,
    value: 200,
  },
  {
    label: eAlertLabels.custom,
    value: 'custom',
  },
];

export const eAlertLowBalanceWarningOptions = [
  {
    label: eAlertLabels.oneHundredCurrency,
    value: 100,
  },
  {
    label: eAlertLabels.twoHundredCurrency,
    value: 200,
  },
  //TODO: Missing label for $500
  {
    label: '$500',
    value: 500,
  },
  {
    label: eAlertLabels.custom,
    value: 'custom',
  },
];

export const EAlertType = {
  DEPOSIT: 4,
  WITHDRAWAL: 5,
  BALANCE: 6,
  CUSTOMER_INFO: 7,
  OFFER: 8,
};
