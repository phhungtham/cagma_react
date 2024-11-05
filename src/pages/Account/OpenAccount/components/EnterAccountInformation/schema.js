import { ProductCode } from '@common/constants/product';
import * as Yup from 'yup';

import { requiredTermProductCodes } from '../../constants';

export const openAccountSchema = Yup.object().shape({
  accountNo: Yup.string()
    .required('Required field')
    .when('productCode', {
      is: ProductCode.CHEQUING,
      then: schema => schema.notRequired(),
      otherwise: schema => schema.required(),
    }), //acno
  amount: Yup.string()
    .required('Required field')
    .when('productCode', {
      is: ProductCode.CHEQUING,
      then: schema => schema.notRequired(),
      otherwise: schema => schema.required(),
    }), // trx_amt
  intendedUseAccount: Yup.string()
    .required('Required field')
    .when('productCode', {
      is: ProductCode.CHEQUING,
      then: schema => schema.notRequired(),
      otherwise: schema => schema.required(),
    }), //dep_ac_usag_d
  debitCardIssuance: Yup.boolean().nullable(), //credit_chk
  thirdPartyChecked: Yup.string().oneOf(['Y', 'N']).nullable(), //tpd_chk
  productCode: Yup.string(),
  maturityDate: Yup.string(),
  term: Yup.string().when('productCode', {
    is: productCode => requiredTermProductCodes.includes(productCode),
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  tfsaTerm: Yup.boolean()
    .oneOf([true], 'You must agree')
    .when('productCode', {
      is: ProductCode.TFSA_E_SAVINGS,
      then: schema => schema.required(),
      otherwise: schema => schema.notRequired(),
    }),
  rrspTerm: Yup.boolean()
    .oneOf([true], 'You must agree')
    .when('productCode', {
      is: ProductCode.RRSP_E_SAVINGS,
      then: schema => schema.required(),
      otherwise: schema => schema.notRequired(),
    }),
  taxYear: Yup.string().when('productCode', {
    is: ProductCode.RRSP_E_SAVINGS,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  paymentDate: Yup.string().when('productCode', {
    is: ProductCode.E_INSTALLMENT_SAVING,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
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
