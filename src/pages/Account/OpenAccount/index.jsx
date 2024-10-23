import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { addressTypeMapping } from '@common/constants/address';
import { MENU_CODE } from '@common/constants/common';
import { getJobCode, getMaturityOption, getProvinceCode, getSubJobCode } from '@common/constants/commonCode';
import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { routePaths } from '@routes/paths';
import { apiCall } from '@shared/api';
import { commonCodeDataToOptions, convertObjectBaseMappingFields } from '@utilities/convert';
import { formatCurrencyDisplay } from '@utilities/currency';
import { moveNext } from '@utilities/index';
import { nativeParamsSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import CustomerInfoBottom from './components/CustomerInfoBottom';
import DTR from './components/DTR';
import EnterAccountInformation from './components/EnterAccountInformation';
import OpenAccountSuccessful from './components/OpenAccountSuccessful';
import TermAndConditions from './components/TermAndConditions';
import { accountFormMapFields, OPEN_ACCOUNT_STEP, TermUnitCodeDisplay, UnitCodeWithPeriodType } from './constants';
import './style.scss';

const OpenAccount = ({ translate: t }) => {
  const productInfo = useSelector(nativeParamsSelector);

  const [currentStep, setCurrentStep] = useState(OPEN_ACCOUNT_STEP.VIEW_TERMS);
  const [showCustomerInfoBottom, setShowCustomerInfoBottom] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [openAccountSuccessInfo, setOpenAccountSuccessInfo] = useState();
  const [provinceOptions, setProvinceOptions] = useState();
  const [maturityOptions, setMaturityOptions] = useState(); //Using for display Maturity Option on completed screen
  const [customer, setCustomer] = useState();
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const { requestApi } = useApi();

  const {
    prdt_c,
    product_ccy,
    ntfct_intrt,
    lcl_prdt_nm,
    dep_sjt_class,
    prdt_psb_trm_unit_c: termUnitCode,
  } = productInfo || {};

  const onSubmitAgreeTerms = () => {
    setShowCustomerInfoBottom(true);
  };

  const handleCloseAlert = () => {
    setAlert({ isShow: false, title: '', content: '' });
  };

  const handleConfirmCustomerInfo = () => {
    setShowCustomerInfoBottom(false);
    setCurrentStep(OPEN_ACCOUNT_STEP.ENTER_ACCOUNT_INFORMATION);
  };

  const requestGetCommonCode = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, {
      code: [getJobCode, getSubJobCode, getProvinceCode, getMaturityOption].join(';'),
    });
    setShowLoading(false);
    if (isSuccess) {
      const { state_c: provinces, dep_due_rnw_t: maturityOptions } = data;
      const convertedProvince = commonCodeDataToOptions(provinces);
      setProvinceOptions(convertedProvince);
      setMaturityOptions(maturityOptions);
      return data;
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestGetCustomerInfo = async () => {
    setShowLoading(true);
    const { data: customerResponse, error, isSuccess } = await requestApi(endpoints.inquiryUserInformation);
    setShowLoading(false);
    if (isSuccess) {
      const homeAddressType = Number(addressTypeMapping.home);
      const homeAddress = customerResponse?.r_CAME001_1Vo?.find(
        address => Number(address.cus_adr_t) === homeAddressType
      );
      const cus_adr_telno = homeAddress?.cus_adr_telno || '';
      const jobData = await requestGetCommonCode();
      const jobType = customerResponse.job_t;
      const { job_t: jobMapList, sub_job_t: subJobMapList } = jobData || {};
      const jobDisplay = jobMapList.find(item => item.key === jobType)?.value || '';
      const subJobType = customerResponse.sub_job_t_v;
      const subJobDisplay = subJobMapList.find(item => item.key === subJobType)?.value || '';
      setCustomer({
        ...customerResponse,
        cus_adr_telno,
        jobDisplay,
        subJobDisplay,
      });
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestOpenDepositAccount = async payload => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.openAccountDeposit, payload);
    setShowLoading(false);
    if (isSuccess) {
      const {
        prdt_c_display: productName,
        withdraw_acno_display: acNo,
        ntfct_intrt_display,
        trx_amt_display: amount,
        dep_acno_display: depositFrom,
        ctrt_trm_cnt: term,
        trx_ccy_c: currency,
        ctrt_trm_d: termUnitCode,
        due_date_display: maturityDate,
      } = data;
      const maturityOption = (maturityOptions || []).find(option => Number(option.key) === 40)?.value;
      setOpenAccountSuccessInfo({
        productName,
        acNo,
        interestRate: `${ntfct_intrt_display}% APR`,
        amount: `${amount} ${currency}`,
        term: `${term} ${TermUnitCodeDisplay[termUnitCode]}`,
        maturityDate,
        maturityOption,
        depositFrom,
      });
      setCurrentStep(OPEN_ACCOUNT_STEP.COMPLETED);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestPreOpenDepositAccount = async values => {
    setShowLoading(true);
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
      prdt_c,
      withdraw_acno,
      trx_amt,
      trx_ccy_c: product_ccy,
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
    const { data, error, isSuccess } = await requestApi(endpoints.preOpenAccountDeposit, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { gibintnbk_aplct_trx_mng_no, due_date } = data;
      requestOpenDepositAccount({
        ...payload,
        gibintnbk_aplct_trx_mng_no,
        due_date,
      });
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const onSubmitOpenAccountForm = async formValues => {
    setShowLoading(true);
    if (dep_sjt_class === DepositSubjectClass.TERM_DEPOSIT_GIC) {
      return requestPreOpenDepositAccount(formValues);
    }
    const productInterestRateResponse = await apiCall(endpoints.inquiryProductInterestRate, 'POST', {
      prdt_c,
      product_ccy,
    });
    const request = convertObjectBaseMappingFields(formValues, accountFormMapFields);
    const {
      dep_intrt_k,
      intrt_trm_c,
      y4mm_intrt_d,
      ntfct_intrt: interestRateValue,
      adt_intrt,
      apply_intrt,
    } = productInterestRateResponse?.data?.elData || {};
    request.prdt_c = prdt_c;
    request.apl_intrt = ntfct_intrt;
    request.tpd_trx_t = 0;
    request.tpd_chk = request.tpd_chk ? 'Y' : 'N';
    request.credit_chk = request.credit_chk ? 'Y' : 'N';
    request.trx_amt = Number(request.trx_amt);
    request.stmt_ccy_cvs_exrt = 1;
    request.dep_cvsr_bnkerno = request.dep_cvsr_bnkerno || null;
    request.refno = request.acno;
    request.intrt_trm_c = intrt_trm_c;
    request.dep_sjt_class = dep_sjt_class;
    request.dep_intrt_k = dep_intrt_k;
    request.y4mm_intrt_d = y4mm_intrt_d;
    request.ntfct_intrt = interestRateValue;
    request.adt_intrt = adt_intrt;
    request.apply_intrt = apply_intrt;
    delete request.intendedUseAccountDisplay;
    delete request.dob_display;
    const openAccountResponse = await apiCall(endpoints.openAccount, 'POST', request);
    setShowLoading(false);
    const openAccountStatus = openAccountResponse?.data?.elHeader;
    if (openAccountStatus?.resSuc) {
      const { lcl_ac_no_display, dep_acno_display } = openAccountResponse?.data?.elData || {};
      setOpenAccountSuccessInfo({
        productName: lcl_prdt_nm,
        creditChecked: request.credit_chk === '1',
        acNo: lcl_ac_no_display,
        interestRate: `${ntfct_intrt}% APR`,
        amount: `${formatCurrencyDisplay(request.trx_amt)} CAD`,
        depositFrom: dep_acno_display,
      });
      setCurrentStep(OPEN_ACCOUNT_STEP.COMPLETED);
    } else {
      setAlert({
        isShow: true,
        title: 'Sorry!',
        content: openAccountStatus?.resMsgVo?.msgText,
      });
    }
  };

  const handleNavigateChangeProfile = () => {
    moveNext(MENU_CODE.CHANGE_PROFILE, {}, routePaths.changeProfile);
  };

  useEffect(() => {
    if (showCustomerInfoBottom && !customer) {
      requestGetCustomerInfo();
    }
  }, [showCustomerInfoBottom]);

  return (
    <>
      <div className="open-account__wrapper">
        {showLoading && <Spinner />}
        {currentStep === OPEN_ACCOUNT_STEP.VIEW_TERMS && (
          <TermAndConditions
            product={productInfo}
            onSubmit={onSubmitAgreeTerms}
            translate={t}
          />
        )}

        {showCustomerInfoBottom && customer && (
          <CustomerInfoBottom
            customerInfo={customer}
            onClose={() => setShowCustomerInfoBottom(false)}
            onClickConfirm={handleConfirmCustomerInfo}
            onClickChangeProfile={handleNavigateChangeProfile}
          />
        )}
        {currentStep === OPEN_ACCOUNT_STEP.ENTER_ACCOUNT_INFORMATION && (
          <EnterAccountInformation
            onSubmit={onSubmitOpenAccountForm}
            product={productInfo}
            setAlert={setAlert}
            provinces={provinceOptions}
          />
        )}
        {currentStep === OPEN_ACCOUNT_STEP.COMPLETED && (
          <OpenAccountSuccessful
            openAccountInfo={openAccountSuccessInfo}
            productName={lcl_prdt_nm}
            productCode={prdt_c}
          />
        )}
        {currentStep === OPEN_ACCOUNT_STEP.DTR && (
          <DTR
            openAccountInfo={openAccountSuccessInfo}
            productName={lcl_prdt_nm}
            productCode={prdt_c}
          />
        )}
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        textAlign="left"
        onClose={handleCloseAlert}
        firstButton={{
          onClick: handleCloseAlert,
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default withHTMLParseI18n(OpenAccount);
