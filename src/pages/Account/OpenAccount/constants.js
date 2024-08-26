export const termConditionConfig = {
  selectAllLabel: 'I fully understand and agree to all of the below',
  options: [
    {
      label: '[Mandatory] User Agreement',
      value: '1',
    },
    {
      label: '[Mandatory] Product Feature',
      value: '2',
    },
  ],
};

export const OPEN_ACCOUNT_STEP = {
  VIEW_TERMS: 'viewTerms',
  CUSTOMER_INFO: 'customerInfo',
  ENTER_ACCOUNT_INFORMATION: 'enterAccountInformation',
  COMPLETED: 'completed',
};

export const customerInfoFields = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Date of Birth',
    value: 'dob',
  },
  {
    label: 'SIN',
    value: 'sin',
  },
  {
    label: 'E-mail Address',
    value: 'email',
  },
  {
    label: 'Phone Number',
    value: 'phone',
  },
  {
    label: 'Cell Number',
    value: 'cell',
  },
  {
    label: 'Occupation',
    value: 'occupation',
  },
];

export const customerInfo = {
  name: 'CUS-SNM-NM41000002250',
  dob: '01/09/1970',
  sin: '4100002250',
  email: '410000250@TEST.COM',
  phone: 'CUS-ADR-TELN0410002250',
  cell: 'CUS-ADR-TELN0410002250',
  occupation: 'MANAGEMENT',
};

export const intendedUseOfAccounts = [
  {
    label: 'Salary Receipt',
    value: 'SalaryReceipt',
  },
  {
    label: 'Daily Transaction',
    value: 'DailyTransaction',
  },
  {
    label: 'Personal Savings',
    value: 'PersonalSavings',
  },
  {
    label: 'Retirement',
    value: 'Retirement',
  },
  {
    label: 'Home Purchase',
    value: 'HomePurchase',
  },
  {
    label: 'Vehicle Purchase',
    value: 'VehiclePurchase',
  },
  {
    label: 'Vacation/Leisure',
    value: 'VacationLeisure',
  },
  {
    label: 'Education',
    value: 'Education',
  },
  {
    label: 'Remittance',
    value: 'Remittance',
  },
  {
    label: 'Business Operating Expenses',
    value: 'BusinessOperatingExpenses',
  },
];

export const openAccountSuccessFields = [
  {
    label: 'Product name',
    value: 'productName',
  },
  {
    label: 'Account no.',
    value: 'acNo',
  },
  {
    label: 'Interest rate',
    value: 'interestRate',
  },
  {
    label: 'Amount',
    value: 'amount',
  },
  {
    label: 'Deposit from',
    value: 'depositFrom',
  },
];

export const openAccountInfo = {
  productName: 'e-Saving(CAD)',
  acNo: '700 000 123123',
  interestRate: '7.00% APR',
  amount: '1000.00 CAD',
  depositFrom: '700 000 987654',
};
