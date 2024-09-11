export const SELECT_TYPE = {
  EMPLOYMENT: 'employment',
  OCCUPATION1: 'occupation1',
  OCCUPATION2: 'occupation2',
  ADDRESS_TYPE: 'addressType',
  COUNTRY: 'country',
  PROVINCE: 'province',
};

export const initSelectBottom = {
  isShow: false,
  type: '',
  options: [],
  title: '',
};

export const selectBottomTypeMapField = {
  [SELECT_TYPE.EMPLOYMENT]: 'employment',
  [SELECT_TYPE.OCCUPATION1]: 'occupation1',
  [SELECT_TYPE.OCCUPATION2]: 'occupation2',
  [SELECT_TYPE.ADDRESS_TYPE]: 'addressType',
  [SELECT_TYPE.COUNTRY]: 'country',
  [SELECT_TYPE.PROVINCE]: 'province',
};

export const profileFormMapFields = {
  name: 'cus_snm_nm',
  dob: 'cus_bth_y4mm_dt',
  dobDisplay: 'cus_bth_y4mm_dt_display',
  sin: 'lcl_cus_rlnm_no',
  email: 'cus_email',
  callNumber: 'cus_cell_no',
  employment: 'emplm_s_c',
  occupation1: 'job_t',
  occupation2: 'sub_job_t_v',
  occupation3: 'job_nm',
  phoneNumber: 'cus_adr_telno',
  faxNumber: 'cus_faxno',
};

export const employmentValuesDisableOccupation = [
  '6', //"Retired"
  '7', //"Student"
  '8', //"House-wife"
  '10', //"Unemployed"
];

export const EMAIL_VERIFY_IN_SECONDS = 180;
export const EMAIL_VERIFY_RETRY_MAX = 5;
