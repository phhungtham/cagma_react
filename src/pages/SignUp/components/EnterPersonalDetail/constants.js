export const SignUpSelectType = {
  TITLE: 'Title',
  COUNTRY: 'Country',
  PROVINCE: 'Province',
  EMPLOYMENT_STATUS: 'Employment',
  JOB: 'Occupation1',
  SUB_JOB: 'Occupation2',
  NATIONALITY: 'Nationality',
};

export const CommonCodeFieldName = {
  TITLE: 'customerTitleNames',
  JOB: 'jobs',
  SUB_JOB: 'subJobs',
  COUNTRY: 'countries',
  PROVINCE: 'provinces',
  EMPLOYMENT_STATUS: 'employmentStatus',
};

export const SelectTypeMapCommonCodeField = {
  [SignUpSelectType.TITLE]: CommonCodeFieldName.TITLE,
  [SignUpSelectType.COUNTRY]: CommonCodeFieldName.COUNTRY,
  [SignUpSelectType.PROVINCE]: CommonCodeFieldName.PROVINCE,
  [SignUpSelectType.EMPLOYMENT_STATUS]: CommonCodeFieldName.EMPLOYMENT_STATUS,
  [SignUpSelectType.JOB]: CommonCodeFieldName.JOB,
  [SignUpSelectType.NATIONALITY]: CommonCodeFieldName.COUNTRY,
};

export const SignUpSelectBottomMapFields = {
  [SignUpSelectType.TITLE]: 'title',
  [SignUpSelectType.COUNTRY]: 'country',
  [SignUpSelectType.PROVINCE]: 'province',
  [SignUpSelectType.EMPLOYMENT_STATUS]: 'employmentStatus',
  [SignUpSelectType.JOB]: 'occupation1',
  [SignUpSelectType.SUB_JOB]: 'occupation2',
  [SignUpSelectType.NATIONALITY]: 'nationality',
};

export const signUpPersonalMapFields = {
  title: 'cus_ttl_nm',
  firstName: 'cus_fst_nm',
  lastName: 'cus_last_nm',
  middleName: 'cus_middle_nm',
  dob: 'cus_bth_y4mm_dt',
  cellNumber: 'cus_cell_no',
  country: 'house_adr_nat_c',
  postalCode: 'house_zipc',
  aptNumber: 'house_adr_colny_nm', //TODO: Find field to map
  address: 'house_adr1', //TODO: Find field to map
  streetNumber: 'house_adr_houseno_in_ctt',
  streetName: 'house_adr_strt_nm',
  city: 'house_adr_city_nm',
  province: 'house_adr_state_c',
  employmentStatus: 'emplm_s_c',
  occupation1: 'job_t',
  occupation2: 'sub_job_t_v',
  occupation3: 'job_nm',
  emailAddress: 'cus_email',
};

export const dummyData = {
  cus_ttl_nm: 'MX',
  cus_fst_nm: 'first name',
  cus_middle_nm: 'middle name',
  cus_last_nm: 'las name',
  cus_bth_y4mm_dt: '19800101',
  cus_cell_no: '0123456789',
  house_adr_nat_c: 'DZ',
  house_zipc: '111111',
  house_adr_colny_nm: '12345',
  house_adr1: 'address',
  house_adr_houseno_in_ctt: '6789',
  house_adr_strt_nm: 'street name',
  house_adr_city_nm: 'city',
  house_adr_state_c: 'NS',
  emplm_s_c: '4',
  job_t: '8',
  sub_job_t_v: 'S0807',
  job_nm: 'Occupation 3',
  cus_email: 'email@gmail.com',
};
