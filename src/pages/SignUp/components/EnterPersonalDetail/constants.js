import { signUpEnterPersonalLabels as labels } from '@common/constants/labels';

export const SignUpSelectType = {
  TITLE: labels.title,
  NATION: 'Nation',
  COUNTRY: labels.country,
  PROVINCE: labels.province,
  EMPLOYMENT_STATUS: labels.employmentStatus,
  JOB: labels.occupation1,
  SUB_JOB: labels.occupation2,
  NATIONALITY: labels.nationality,
  RESIDENTIAL_STATUS: labels.residentialStatus,
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
  [SignUpSelectType.NATION]: CommonCodeFieldName.COUNTRY,
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
  [SignUpSelectType.NATION]: 'nation',
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
  nation: 'bth_nat_c',
  firstName: 'cus_fst_nm',
  lastName: 'cus_last_nm',
  middleName: 'cus_middle_nm',
  dob: 'cus_bth_y4mm_dt',
  cellNumber: 'cus_cell_no',
  country: 'cus_rsdc_nat_c',
  postalCode: 'house_zipc',
  aptNumber: 'house_adr_strt_nm',
  streetNumber: 'house_adr_houseno_in_ctt',
  address: 'house_adr1',
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
