import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { addressTypeMapping } from '@common/constants/address';
import { MENU_CODE } from '@common/constants/common';
import {
  getJobCode,
  getMaturityOption,
  getProvinceCode,
  getSubJobCode,
  getTermOptions,
} from '@common/constants/commonCode';
import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import { routePaths } from '@routes/paths';
import { commonCodeDataToOptions } from '@utilities/convert';
import { moveNext } from '@utilities/index';
import { nativeParamsSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import CustomerInfoBottom from './components/CustomerInfoBottom';
import DTR from './components/DTR';
import EnterAccountInformation from './components/EnterAccountInformation';
import OpenAccountSuccessful from './components/OpenAccountSuccessful';
import TermAndConditions from './components/TermAndConditions';
import {
  ignoreCheckDTRProductCodes,
  OPEN_ACCOUNT_STEP,
  TermOptionsWithProductCode,
  TermUnitCodeDisplay,
} from './constants';
import useOpenAccount from './hooks/useOpenAccount';
import './style.scss';

const OpenAccount = ({ translate: t }) => {
  const productInfo = useSelector(nativeParamsSelector);

  const [currentStep, setCurrentStep] = useState();
  const [DTRInfo, setDTRInfo] = useState();
  const [showCustomerInfoBottom, setShowCustomerInfoBottom] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [openAccountSuccessInfo, setOpenAccountSuccessInfo] = useState();
  const [provinceOptions, setProvinceOptions] = useState();
  const [maturityOptions, setMaturityOptions] = useState(); //Using for display Maturity Option on completed screen
  const [termOptions, setTermOptions] = useState([]); //Using for display Maturity Option on completed screen
  const [customer, setCustomer] = useState();
  const {
    requestOpenDepositAccount: openDepositAccount,
    requestOpenBankingAccount: openBankingAccount,
    requestOpenInstallmentSavingAccount: openInstallmentSavingAccount,
  } = useOpenAccount({
    product: productInfo,
  });
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const { requestApi } = useApi();

  const {
    prdt_c: productCode,
    product_ccy: productCurrencyCode,
    ntfct_intrt,
    prdt_c_display,
    dep_sjt_class,
    prdt_psb_trm_unit_c: termUnitCode,
  } = productInfo || {};

  const handleNavigateViewTerm = () => {
    setCurrentStep(OPEN_ACCOUNT_STEP.VIEW_TERMS);
  };

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

  const defineTermOptions = termResponseOptions => {
    let options = [];
    if (termResponseOptions) {
      options = termResponseOptions.map(item => {
        return {
          label: item.key,
          value: item.key.replace(/\D/g, ''),
        };
      });
    } else {
      options = TermOptionsWithProductCode[productCode];
    }
    setTermOptions(options);
  };

  const requestGetCommonCode = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, {
      code: [getJobCode, getSubJobCode, getProvinceCode, getMaturityOption, `${getTermOptions}_${productCode}`].join(
        ';'
      ),
    });
    setShowLoading(false);
    if (isSuccess) {
      const termOptionsKey = `${getTermOptions}_${productCode}`;
      const {
        [getProvinceCode]: provinces,
        [getMaturityOption]: maturityOptions,
        [termOptionsKey]: termResponseOptions,
      } = data;

      const convertedProvince = commonCodeDataToOptions(provinces);
      setProvinceOptions(convertedProvince);
      setMaturityOptions(maturityOptions);
      defineTermOptions(termResponseOptions);
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

  const requestOpenDepositAccount = async values => {
    setShowLoading(true);
    const { data, error, isSuccess } = await openDepositAccount(values);
    setShowLoading(false);
    if (isSuccess) {
      const {
        prdt_c_display: productName,
        withdraw_acno_display: depositFrom,
        ntfct_intrt_display,
        trx_amt_display: amount,
        dep_acno_display: acNo,
        dep_acno: openedAccountNumber,
        ctrt_trm_cnt: term,
        trx_ccy_c: currency,
        ctrt_trm_d: termUnitCode,
        due_date_display: maturityDate,
      } = data;
      const maturityOption = (maturityOptions || []).find(option => Number(option.key) === 40)?.value;
      setOpenAccountSuccessInfo({
        productName,
        acNo,
        openedAccountNumber,
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

  const requestOpenInstallmentSavingAccount = async values => {
    setShowLoading(true);
    const { data, error, isSuccess } = await openInstallmentSavingAccount(values);
    setShowLoading(false);
    if (isSuccess) {
      const {
        prdt_c_display: productName,
        withdraw_acno_display: depositFrom,
        ntfct_intrt_display,
        trx_amt_display: amount,
        trx_ccy_c: currency,
        dep_acno_display: acNo,
        dep_acno: openedAccountNumber,
        ctrt_trm_cnt: term,
        ctrt_trm_d: termUnitCode,
        due_date_display: maturityDate,
        et_payt_dd: paymentEachSession,
      } = data;
      const maturityOption = (maturityOptions || []).find(option => Number(option.key) === 40)?.value;
      setOpenAccountSuccessInfo({
        productName,
        acNo,
        openedAccountNumber,
        interestRate: `${ntfct_intrt_display}% APR`,
        amount: `${amount} ${currency}`,
        term: `${term} ${TermUnitCodeDisplay[termUnitCode]}`,
        maturityDate,
        maturityOption,
        depositFrom,
        paymentEachSession,
      });
      setCurrentStep(OPEN_ACCOUNT_STEP.COMPLETED);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestOpenBankingAccount = async values => {
    setShowLoading(true);
    const { data, error, isSuccess } = await openBankingAccount(values);
    setShowLoading(false);
    if (isSuccess) {
      const {
        prdt_c_display: productName,
        withdraw_acno_display: depositFrom,
        ntfct_intrt_display,
        dep_acno_display: acNo,
        dep_acno: openedAccountNumber,
        trx_amt_display: amount,
        trx_ccy_c: currency,
      } = data;
      setOpenAccountSuccessInfo({
        creditChecked: values.debitCardIssuance,
        productName,
        acNo,
        openedAccountNumber,
        interestRate: `${ntfct_intrt_display}% APR`,
        amount: `${amount} ${currency}`,
        depositFrom,
        numberTransactions: 'Unlimited',
      });
      setCurrentStep(OPEN_ACCOUNT_STEP.COMPLETED);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const onSubmitOpenAccountForm = async formValues => {
    if (dep_sjt_class === DepositSubjectClass.TERM_DEPOSIT_GIC) {
      return requestOpenDepositAccount(formValues);
    } else if (dep_sjt_class === DepositSubjectClass.REGULAR_SAVING) {
      return requestOpenBankingAccount(formValues);
    } else if (dep_sjt_class === DepositSubjectClass.INSTALLMENT_SAVING) {
      return requestOpenInstallmentSavingAccount(formValues);
    }
  };

  const handleNavigateChangeProfile = () => {
    moveNext(MENU_CODE.CHANGE_PROFILE, {}, routePaths.changeProfile);
  };

  const checkUserRegisterDTR = async () => {
    if (ignoreCheckDTRProductCodes.includes(productCode)) {
      return setCurrentStep(OPEN_ACCOUNT_STEP.VIEW_TERMS);
    }
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getDTRInformation);
    setShowLoading(false);
    if (isSuccess) {
      const { dtr_yn } = data;
      setDTRInfo(data);
      if (dtr_yn === 'Y') {
        setCurrentStep(OPEN_ACCOUNT_STEP.VIEW_TERMS);
      } else {
        setCurrentStep(OPEN_ACCOUNT_STEP.DTR);
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  useEffect(() => {
    if (showCustomerInfoBottom && !customer) {
      requestGetCustomerInfo();
    }
  }, [showCustomerInfoBottom]);

  useEffect(() => {
    if (productCode) {
      checkUserRegisterDTR();
    }
  }, [productCode]);

  return (
    <>
      <div className="open-account__wrapper">
        {showLoading && <Spinner />}
        {currentStep === OPEN_ACCOUNT_STEP.DTR && (
          <DTR
            openAccountInfo={openAccountSuccessInfo}
            productName={prdt_c_display}
            productCode={productCode}
            setAlert={setAlert}
            DTRInfo={DTRInfo}
            onConfirm={handleNavigateViewTerm}
            translate={t}
          />
        )}
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
            translate={t}
          />
        )}
        {currentStep === OPEN_ACCOUNT_STEP.ENTER_ACCOUNT_INFORMATION && (
          <EnterAccountInformation
            onSubmit={onSubmitOpenAccountForm}
            product={productInfo}
            setAlert={setAlert}
            provinces={provinceOptions}
            termOptions={termOptions}
            translate={t}
          />
        )}
        {currentStep === OPEN_ACCOUNT_STEP.COMPLETED && (
          <OpenAccountSuccessful
            openAccountInfo={openAccountSuccessInfo}
            productCode={productCode}
            dep_sjt_class={dep_sjt_class}
            translate={t}
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
          label: t(ctaLabels.confirm),
        }}
      />
    </>
  );
};

export default withHTMLParseI18n(OpenAccount);
