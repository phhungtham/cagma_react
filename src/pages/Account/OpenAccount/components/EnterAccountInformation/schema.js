import * as Yup from 'yup';

export const openAccountSchema = Yup.object().shape({
  accountNo: Yup.string().required('Required field'), //acno
  amount: Yup.string().required('Required field'), // trx_amt
  intendedUseAccount: Yup.string().required('Required field'), //dep_ac_usag_d
  debitCardIssuance: Yup.boolean().nullable(), //credit_chk
  thirdPartyChecked: Yup.string().oneOf(['Y', 'N']).nullable(), //tpd_chk
  thirdPartyName: Yup.string().when('thirdPartyChecked', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }), //tpd_nm
  dob: Yup.string().when('thirdPartyChecked', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }), //DOB tpd_bth_y4mm_dt
  address: Yup.string().when('thirdPartyChecked', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }), //tpd_adr1
  city: Yup.string().when('thirdPartyChecked', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }), //tpd_adr2
  province: Yup.string().when('thirdPartyChecked', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }), //tpd_state_c
  postalCode: Yup.string().when('thirdPartyChecked', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }), //tpd_adr_zipc
  occupation: Yup.string().when('thirdPartyChecked', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }), //tpd_job_nm
  relationship: Yup.string().when('thirdPartyChecked', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }), //tpd_cus_relt_ctt
  referralCode: Yup.string().nullable(), //dep_cvsr_bnkerno
});
