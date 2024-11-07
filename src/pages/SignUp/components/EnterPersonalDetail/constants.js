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
  PEP_COUNTRY: 'PEP/HIO Country',
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
  nationality: 'cus_natnlt_nat_c',
  sin: 'lcl_cus_rlnm_no2',
  housePhoneNo: 'house_telno',
  branchNo: 'new_brno',
  residentialStatus: 'rsdc_dtl_c',
};

export const signUpPepMapFields = {
  pepDetermination: 'pep_hio_yn',
  pepRelationship: 'pep_relt_d',
  pepFirstName: 'pep_fst_nm',
  pepLastName: 'pep_last_nm',
  pepPosition: 'pep_stat_c',
  pepOrganizationName: 'pep_act_org_nm',
  pepCountry: 'pep_act_nat_c',
  pepSource: 'fund_soce_d_c',
};

// export const dummyData = {
//   cus_ttl_nm: 'MX',
//   cus_fst_nm: 'CUS-FST-NM4100002250',
//   cus_middle_nm: null,
//   cus_last_nm: 'CUS-LAST-NM4100002250',
//   cus_bth_y4mm_dt: '19700109',
//   cus_cell_no: 'CUS-CELL-NO4100002250',
//   cus_rsdc_nat_c: 'CA',
//   house_zipc: null,
//   house_adr_strt_nm: null,
//   house_adr_colny_nm: null,
//   house_adr1: null,
//   house_adr_houseno_in_ctt: null,
//   house_adr_city_nm: null,
//   house_adr_state_c: null,
//   emplm_s_c: '2',
//   job_t: '4',
//   sub_job_t_v: 'E0407',
//   job_nm: 'PHARMACISTS2',
//   cus_email: 'jangwon2630@shinhan.com',
//   cus_natnlt_nat_c: 'CA',
//   lcl_cus_rlnm_no2: 'L2158-78887-00109',
//   house_telno: null,
//   new_brno: '8048',
//   rsdc_dtl_c: '01',
// };

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
