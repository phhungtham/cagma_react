import { DepositSubjectClass } from '@common/constants/deposit';

export const OPEN_ACCOUNT_STEP = {
  VIEW_TERMS: 'viewTerms',
  ENTER_ACCOUNT_INFORMATION: 'enterAccountInformation',
  COMPLETED: 'completed',
  DTR: 'dtr',
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

export const ProductType = {
  [DepositSubjectClass.REGULAR_SAVING]: 'banking',
  [DepositSubjectClass.INSTALLMENT_SAVING]: 'investment',
  [DepositSubjectClass.TERM_DEPOSIT_GIC]: 'investment',
};
