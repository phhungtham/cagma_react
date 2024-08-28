import * as Yup from 'yup';

export const openAccountSchema = Yup.object().shape({
  // lcl_ac_no: Yup.string().required('Required field'),
  trx_amt: Yup.string().required('Required field'), // Amount
  dep_ac_usag_d: Yup.string().required('Required field'), //Intended use of account
  tpd_chk: Yup.boolean(), //Third party determination
  tpd_nm: Yup.string(), //Name
  tpd_bth_y4mm_dt: Yup.string(), //DOB
  tpd_adr1: Yup.string(), //Address
  tpd_adr2: Yup.string(), //City
  tpd_state_c: Yup.string(), //Province
  tpd_adr_zipc: Yup.string(), //Postal code
  tpd_job_nm: Yup.string(), //Occupation
  tpd_cus_relt_ctt: Yup.string(), //Relationship to Applicant(S)
});
