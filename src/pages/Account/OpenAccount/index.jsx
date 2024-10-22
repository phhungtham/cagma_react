import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { addressTypeMapping } from '@common/constants/address';
import { MENU_CODE } from '@common/constants/common';
import { getJobCode, getSubJobCode } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { routePaths } from '@routes/paths';
import { apiCall } from '@shared/api';
import { convertObjectBaseMappingFields } from '@utilities/convert';
import { formatCurrencyDisplay } from '@utilities/currency';
import { moveNext } from '@utilities/index';
import { nativeParamsSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import CustomerInfoBottom from './components/CustomerInfoBottom';
import DTR from './components/DTR';
import EnterAccountInformation from './components/EnterAccountInformation';
import OpenAccountSuccessful from './components/OpenAccountSuccessful';
import TermAndConditions from './components/TermAndConditions';
import { accountFormMapFields, OPEN_ACCOUNT_STEP } from './constants';
import './style.scss';

const OpenAccount = ({ translate: t }) => {
  const productInfo = useSelector(nativeParamsSelector);

  const [currentStep, setCurrentStep] = useState(OPEN_ACCOUNT_STEP.VIEW_TERMS);
  const [showCustomerInfoBottom, setShowCustomerInfoBottom] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [openAccountSuccessInfo, setOpenAccountSuccessInfo] = useState();
  const [customer, setCustomer] = useState();
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const { requestApi } = useApi();

  const { prdt_c, product_ccy, ntfct_intrt, lcl_prdt_nm, dep_sjt_class } = productInfo || {};

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

  const requestGetJob = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, {
      code: [getJobCode, getSubJobCode].join(';'),
    });
    setShowLoading(false);
    if (isSuccess) {
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
      const jobData = await requestGetJob();
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

  const onSubmitOpenAccountForm = async formValues => {
    setShowLoading(true);
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
