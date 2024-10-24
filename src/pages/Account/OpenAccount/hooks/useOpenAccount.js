import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import { ProductCode } from '@common/constants/product';
import useApi from '@hooks/useApi';

import { UnitCodeWithPeriodType } from '../constants';

const useOpenAccount = ({ product }) => {
  const {
    prdt_c: productCode,
    product_ccy: productCurrencyCode,
    ntfct_intrt,
    lcl_prdt_nm,
    dep_sjt_class,
    prdt_psb_trm_unit_c: termUnitCode,
  } = product || {};

  const { requestApi } = useApi();

  const getFilteredBasedProductCode = accounts => {
    if (
      [ProductCode.E_SHORT_TERM_GIC, ProductCode.E_LONG_TERM_GIC, ProductCode.E_LONG_MATURITY].includes(productCode)
    ) {
      return (accounts || []).filter(account => account.dep_sjt_class === DepositSubjectClass.REGULAR_SAVING);
    }
    return (accounts || []).filter(account => account.prdt_c === ProductCode.E_SAVING);
  };

  const requestPreOpenDepositAccount = async payload => {
    const response = await requestApi(endpoints.preOpenAccountDeposit, payload);
    return response;
  };

  const requestOpenDepositAccount = async values => {
    const {
      accountNo: withdraw_acno,
      amount: trx_amt,
      intendedUseAccount: dep_ac_usag_d,
      y4mm_intrt_d,
      dep_intrt_k,
      intrt_trm_c,
      ntfct_intrt,
      adt_intrt,
      term: ctrt_trm_cnt,
      thirdPartyChecked: tpd_chk,
      thirdPartyName: tpd_nm,
      dob: tpd_bth_y4mm_dt,
      address: tpd_adr1,
      city: tpd_adr2,
      province: tpd_state_c,
      postalCode: tpd_adr_zipc,
      occupation: tpd_job_nm,
      relationship: tpd_cus_relt_ctt,
      referralCode: dep_cvsr_bnkerno,
    } = values || {};
    const payload = {
      prdt_c: productCode,
      withdraw_acno,
      trx_amt,
      trx_ccy_c: productCurrencyCode,
      dep_ac_usag_d,
      y4mm_intrt_d,
      dep_intrt_k,
      intrt_trm_c,
      ntfct_intrt,
      adt_intrt,
      ctrt_trm_d: UnitCodeWithPeriodType[termUnitCode],
      ctrt_trm_cnt,
      tpd_chk,
      tpd_nm,
      tpd_bth_y4mm_dt,
      tpd_adr1,
      tpd_adr2,
      tpd_state_c,
      tpd_adr_zipc,
      tpd_job_nm,
      tpd_cus_relt_ctt,
      dep_cvsr_bnkerno,
    };

    const { data, error, isSuccess } = await requestPreOpenDepositAccount(payload);
    if (isSuccess) {
      const { gibintnbk_aplct_trx_mng_no, due_date } = data;
      const response = await requestApi(endpoints.openAccountDeposit, {
        ...payload,
        gibintnbk_aplct_trx_mng_no,
        due_date,
      });
      return response;
    } else {
      return { isSuccess, error };
    }
  };

  return { getFilteredBasedProductCode, requestOpenDepositAccount };
};

export default useOpenAccount;
