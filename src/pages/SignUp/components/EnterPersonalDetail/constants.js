export const SignUpSelectType = {
  TITLE: 'Title',
  COUNTRY: 'Country',
  PROVINCE: 'Province',
  EMPLOYMENT_STATUS: 'Employment',
  JOB: 'Occupation1',
  SUB_JOB: 'Occupation2',
  NATIONALITY: 'Nationality',
  RESIDENTIAL_STATUS: 'Residential Status',
  PEP_RELATIONSHIP: 'Relationship',
  PEP_POSITION: 'Position',
  PEP_COUNTRY: 'Country',
  PEP_SOURCE: 'Source of Fund',
};

export const CommonCodeFieldName = {
  TITLE: 'customerTitleNames',
  JOB: 'jobs',
  SUB_JOB: 'subJobs',
  COUNTRY: 'countries',
  PROVINCE: 'provinces',
  EMPLOYMENT_STATUS: 'employmentStatus',
  RESIDENTIAL_STATUS: 'residentialStatus',
  RELATIONSHIP: 'pepRelationships',
  POSITION: 'pepPositions',
  PEP_COUNTRY: 'pepCountries',
  PEP_SOURCE: 'pepSources',
};

export const SelectTypeMapCommonCodeField = {
  [SignUpSelectType.TITLE]: CommonCodeFieldName.TITLE,
  [SignUpSelectType.COUNTRY]: CommonCodeFieldName.COUNTRY,
  [SignUpSelectType.PROVINCE]: CommonCodeFieldName.PROVINCE,
  [SignUpSelectType.EMPLOYMENT_STATUS]: CommonCodeFieldName.EMPLOYMENT_STATUS,
  [SignUpSelectType.JOB]: CommonCodeFieldName.JOB,
  [SignUpSelectType.NATIONALITY]: CommonCodeFieldName.COUNTRY,
  [SignUpSelectType.RESIDENTIAL_STATUS]: CommonCodeFieldName.RESIDENTIAL_STATUS,
  [SignUpSelectType.PEP_RELATIONSHIP]: CommonCodeFieldName.RELATIONSHIP,
  [SignUpSelectType.PEP_POSITION]: CommonCodeFieldName.POSITION,
  [SignUpSelectType.PEP_COUNTRY]: CommonCodeFieldName.PEP_COUNTRY,
  [SignUpSelectType.PEP_SOURCE]: CommonCodeFieldName.PEP_SOURCE,
};

export const SignUpSelectBottomMapFields = {
  [SignUpSelectType.TITLE]: 'title',
  [SignUpSelectType.COUNTRY]: 'country',
  [SignUpSelectType.PROVINCE]: 'province',
  [SignUpSelectType.EMPLOYMENT_STATUS]: 'employmentStatus',
  [SignUpSelectType.JOB]: 'occupation1',
  [SignUpSelectType.SUB_JOB]: 'occupation2',
  [SignUpSelectType.NATIONALITY]: 'nationality',
  [SignUpSelectType.RESIDENTIAL_STATUS]: 'residentialStatus',
  [SignUpSelectType.PEP_RELATIONSHIP]: 'pepRelationship',
  [SignUpSelectType.PEP_POSITION]: 'pepPosition',
  [SignUpSelectType.PEP_COUNTRY]: 'pepCountry',
  [SignUpSelectType.PEP_SOURCE]: 'pepSource',
};

export const signUpPersonalMapFields = {
  title: 'cus_ttl_nm',
  firstName: 'cus_fst_nm',
  lastName: 'cus_last_nm',
  middleName: 'cus_middle_nm',
  dob: 'cus_bth_y4mm_dt',
  cellNumber: 'cus_cell_no',
  country: 'cus_rsdc_nat_c',
  postalCode: 'house_zipc',
  aptNumber: 'house_adr_strt_nm',
  streetNumber: 'house_adr_houseno_in_ctt',
  address: 'house_adr1', //TODO: Find field to map, and check house address 2, house address 3
  streetName: 'house_adr_colny_nm',
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

export const pepDeterminationOptions = [
  {
    label: 'Yes',
    value: 'Y',
  },
  {
    label: 'No',
    value: 'N',
  },
];
