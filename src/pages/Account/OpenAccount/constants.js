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
    value: 'cus_snm_nm',
  },
  {
    label: 'Date of Birth',
    value: 'cus_bth_y4mm_dt_display',
  },
  {
    label: 'SIN',
    value: 'lcl_cus_rlnm_no',
  },
  {
    label: 'E-mail Address',
    value: 'cus_email',
  },
  {
    label: 'Phone Number',
    value: 'cus_adr_telno',
  },
  {
    label: 'Cell Number',
    value: 'cus_cell_no',
  },
  {
    label: 'Occupation',
    value: 'job',
  },
];

export const intendedUseOfAccounts = [
  {
    label: 'Salary Receipt',
    value: '10',
  },
  {
    label: 'Daily Transaction',
    value: '101',
  },
  {
    label: 'Personal Savings',
    value: '102',
  },
  {
    label: 'Retirement',
    value: '103',
  },
  {
    label: 'Home Purchase',
    value: '104',
  },
  {
    label: 'Vehicle Purchase',
    value: '105',
  },
  {
    label: 'Vacation/Leisure',
    value: '106',
  },
  {
    label: 'Education',
    value: '107',
  },
  {
    label: 'Remittance',
    value: '108',
  },
  {
    label: 'Business Operating Expenses',
    value: '121',
  },
  {
    label: 'Business Savings',
    value: '122',
  },
  {
    label: 'Payroll Payment',
    value: '123',
  },
  {
    label: 'Payment to Suppliers',
    value: '124',
  },
  {
    label: 'Business Remittance',
    value: '125',
  },
  {
    label: 'Personal Expense',
    value: '20',
  },
  {
    label: 'Household Payment',
    value: '30',
  },
  {
    label: 'Tuition for School',
    value: '40',
  },
  {
    label: 'General Business Expense',
    value: '50',
  },
  {
    label: 'Payroll Expense',
    value: '60',
  },
  {
    label: 'Investment',
    value: '70',
  },
  {
    label: 'Trust',
    value: '80',
  },
  {
    label: 'Others',
    value: '90',
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

export const accountFormMapFields = {
  accountNo: 'acno',
  amount: 'trx_amt',
  intendedUseAccount: 'dep_ac_usag_d',
  debitCardIssuance: 'credit_chk',
  thirdPartyChecked: 'tpd_chk',
  referralCode: 'dep_cvsr_bnkerno',
  thirdPartyName: 'tpd_nm',
  address: 'tpd_adr1',
  city: 'tpd_adr2',
  province: 'tpd_state_c',
  postalCode: 'tpd_adr_zipc',
  occupation: 'tpd_job_nm',
  relationship: 'tpd_cus_relt_ctt',
  dob: 'tpd_bth_y4mm_dt',
  currency: 'trx_ccy_c',
};
