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
    const filteredAccounts = (accounts || []).filter(
      account => account.dep_sjt_class === DepositSubjectClass.REGULAR_SAVING && Number(account.acno_jiacno_gbn) === 1
    );
    if (productCode === ProductCode.TFSA_E_SAVINGS) {
      return filteredAccounts.filter(account => account.prdt_c !== ProductCode.RRSP_E_SAVINGS);
    }
    if (productCode === ProductCode.RRSP_E_SAVINGS) {
      return filteredAccounts.filter(account => account.prdt_c !== ProductCode.TFSA_E_SAVINGS);
    }
    if (productCode === ProductCode.TFSA_E_GIC) {
      return filteredAccounts.filter(account => account.prdt_c === ProductCode.TFSA_E_SAVINGS);
    }
    if (productCode === ProductCode.RRSP_E_GIC) {
      return filteredAccounts.filter(account => account.prdt_c === ProductCode.RRSP_E_SAVINGS);
    }
    if (
      [ProductCode.E_POWER_TERM_DEPOSIT, ProductCode.E_GREEN_TERM_DEPOSIT, ProductCode.E_INSTALLMENT_SAVING].includes(
        productCode
      )
    ) {
      return filteredAccounts.filter(account => account.prdt_c === ProductCode.E_SAVING);
    }
    return filteredAccounts;
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
      maturityDate: due_date,
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
      due_date,
    };

    const { data, error, isSuccess } = await requestPreOpenDepositAccount(payload);
    if (isSuccess) {
      const { gibintnbk_aplct_trx_mng_no } = data;
      const response = await requestApi(endpoints.openAccountDeposit, {
        ...payload,
        gibintnbk_aplct_trx_mng_no,
      });
      return response;
    } else {
      return { isSuccess, error };
    }
  };

  const requestPreOpenInstallmentSavingAccount = async payload => {
    const response = await requestApi(endpoints.preOpenAccountInstallmentSaving, payload);
    return response;
  };

  const requestOpenInstallmentSavingAccount = async values => {
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
      maturityDate: due_date,
      paymentDate: et_payt_dd,
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
      due_date,
      et_payt_dd: Number(et_payt_dd),
    };

    const { data, error, isSuccess } = await requestPreOpenInstallmentSavingAccount(payload);
    if (isSuccess) {
      const { gibintnbk_aplct_trx_mng_no, auto_trsf_st_dt } = data;
      const response = await requestApi(endpoints.openAccountInstallmentSaving, {
        ...payload,
        gibintnbk_aplct_trx_mng_no,
        auto_trsf_st_dt,
      });
      return response;
    } else {
      return { isSuccess, error };
    }
  };

  const requestPreOpenBankingAccount = async payload => {
    const response = await requestApi(endpoints.preOpenAccountBanking, payload);
    return response;
  };

  const requestOpenBankingAccount = async values => {
    const {
      accountNo: withdraw_acno,
      amount: trx_amt,
      intendedUseAccount: dep_ac_usag_d,
      y4mm_intrt_d,
      dep_intrt_k,
      intrt_trm_c,
      ntfct_intrt: interestRateValue,
      adt_intrt,
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
      debitCardIssuance: credit_chk,
      apply_intrt,
    } = values || {};
    const payload = {
      prdt_c: productCode,
      trx_amt: Number(trx_amt),
      trx_ccy_c: productCurrencyCode,
      y4mm_intrt_d,
      intrt_trm_c,
      apl_intrt: ntfct_intrt,
      ntfct_intrt: interestRateValue,
      adt_intrt,
      tpd_chk: tpd_chk ? 'Y' : 'N',
      tpd_trx_t: 0,
      tpd_nm,
      tpd_bth_y4mm_dt,
      tpd_adr1,
      tpd_adr2,
      tpd_state_c,
      tpd_adr_zipc,
      tpd_job_nm,
      tpd_cus_relt_ctt,
      withdraw_acno,
      refno: withdraw_acno,
      stmt_ccy_cvs_exrt: 1,
      dep_cvsr_bnkerno: dep_cvsr_bnkerno || null,
      credit_chk: credit_chk ? 'Y' : 'N',
      dep_intrt_k,
      dep_sjt_class,
      dep_ac_usag_d,
      apply_intrt,
    };
    const { data, error, isSuccess } = await requestPreOpenBankingAccount(payload);
    if (isSuccess) {
      const { gibintnbk_aplct_trx_mng_no } = data;
      const response = await requestApi(endpoints.openAccountBanking, {
        ...payload,
        gibintnbk_aplct_trx_mng_no,
      });
      return response;
    } else {
      return { isSuccess, error };
    }
  };

  return {
    getFilteredBasedProductCode,
    requestOpenDepositAccount,
    requestOpenBankingAccount,
    requestOpenInstallmentSavingAccount,
  };
};

export default useOpenAccount;
