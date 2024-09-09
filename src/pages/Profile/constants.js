export const SELECT_TYPE = {
  EMPLOYMENT: 'employment',
  OCCUPATION1: 'occupation1',
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
};

export const employmentValuesDisableOccupation = [
  '6', //"Retired"
  '7', //"Student"
  '8', //"House-wife"
  '10', //"Unemployed"
];
