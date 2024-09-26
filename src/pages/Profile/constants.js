export const SELECT_TYPE = {
  EMPLOYMENT: 'employment',
  OCCUPATION1: 'occupation1',
  OCCUPATION2: 'occupation2',
  ADDRESS_TYPE: 'addressType',
  COUNTRY: 'country',
  PROVINCE: 'province',
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
  addressType: 'cus_adr_t',
  postalCode: 'cus_adr_zipc',
  country: 'adr_nat_c',
  province: 'state_c',
  streetName: 'adr_colny_nm',
  aptNumber: 'adr_strt_nm',
  streetNumber: 'adr_houseno_in_ctt',
  address1: 'cus_adr1',
  address2: 'cus_adr2',
  address3: 'cus_adr3',
  city: 'cus_adr2',
};

export const employmentValuesDisableOccupation = [
  '6', //"Retired"
  '7', //"Student"
  '8', //"House-wife"
  '10', //"Unemployed"
];

export const EMAIL_VERIFY_IN_SECONDS = 180; //3 minutes
export const EMAIL_VERIFY_RETRY_MAX = 5;

export const ProfileChangeType = {
  CONTACT_ADDRESS: '2',
  ADDRESS: '4',
  CONTACT: '5',
};

export const fieldsToCheckContactInfo = [
  'callNumber',
  'employment',
  'occupation1',
  'occupation2',
  'occupation3',
  'email',
];

export const fieldsToCheckAddress = [
  'phoneNumber',
  'country',
  'faxNumber',
  'postalCode',
  'aptNumber',
  'streetNumber',
  'streetName',
  'addressLine1',
  'city',
  'province',
];
