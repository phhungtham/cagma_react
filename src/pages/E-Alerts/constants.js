export const EAlertCustomerMethod = {
  EMAIL: '1',
  APP_PUSH: '2',
};

export const eAlertSettingMethodOptions = [
  {
    label: 'E-Mail',
    value: EAlertCustomerMethod.EMAIL,
  },
  {
    label: 'App Push',
    value: EAlertCustomerMethod.APP_PUSH,
  },
];

export const eAlertMoneyBalanceOptions = [
  {
    label: '$0',
    value: 0,
  },
  {
    label: '$100',
    value: 100,
  },
  {
    label: '$200',
    value: 200,
  },
  {
    label: 'Custom',
    value: 'custom',
  },
];

export const eAlertLowBalanceWarningOptions = [
  {
    label: '$100',
    value: 100,
  },
  {
    label: '$200',
    value: 200,
  },
  {
    label: '$500',
    value: 500,
  },
  {
    label: 'Custom',
    value: 'custom',
  },
];

export const EAlertType = {
  CUSTOMER_INFO: 7,
  OFFER: 8,
};
