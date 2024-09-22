import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Spinner from '@common/components/atoms/Spinner';
import Alert from '@common/components/molecules/Alert';
import Header from '@common/components/organisms/Header';
import { MENU_CODE } from '@common/constants/common';
import { getJobCode, getSubJobCode } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import useCommonCode from '@hooks/useCommonCode';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { routePaths } from '@routes/paths';
import { apiCall } from '@shared/api';
import { convertObjectBaseMappingFields } from '@utilities/convert';
import { formatCurrencyDisplay } from '@utilities/currency';
import { moveBack, moveNext } from '@utilities/index';
import { nativeParamsSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import CustomerInfoBottom from './components/CustomerInfoBottom';
import EnterAccountInformation from './components/EnterAccountInformation';
import OpenAccountSuccessful from './components/OpenAccountSuccessful';
import TermAndConditions from './components/TermAndConditions';
import { accountFormMapFields, OPEN_ACCOUNT_STEP } from './constants';
import { getCustomerInfoRequest } from './redux/customer/action';
import { customerReducer } from './redux/customer/reducer';
import { customerSaga } from './redux/customer/saga';
import { customerInfo, getCustomerFailedMsg } from './redux/customer/selector';
import { CustomerFeatureName } from './redux/customer/type';
import './style.scss';

const OpenAccount = ({ translation }) => {
  useReducers([{ key: CustomerFeatureName, reducer: customerReducer }]);
  useSagas([{ key: CustomerFeatureName, saga: customerSaga }]);
  const productInfo = useSelector(nativeParamsSelector);

  const customer = useSelector(customerInfo);
  const getCustomerFailedMessage = useSelector(getCustomerFailedMsg);

  const { sendRequest: requestGetJob, data: jobData } = useCommonCode();

  const [currentStep, setCurrentStep] = useState(OPEN_ACCOUNT_STEP.VIEW_TERMS);
  const [showCustomerInfoBottom, setShowCustomerInfoBottom] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [isLoadingOpenAccount, setIsLoadingOpenAccount] = useState(false);
  const [openAccountSuccessInfo, setOpenAccountSuccessInfo] = useState();
  const [showAlert, setShowAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });

  const { prdt_c, product_ccy, ntfct_intrt, lcl_prdt_nm, dep_sjt_class } = productInfo || {};

  //Get phone number of home address
  const homeAddress = customer?.r_CAME001_1Vo?.find(address => address.cus_adr_t === 11);
  const cus_adr_telno = homeAddress?.cus_adr_telno || '';

  const onSubmitAgreeTerms = () => {
    setShowCustomerInfoBottom(true);
  };

  const handleConfirmCustomerInfo = () => {
    setShowCustomerInfoBottom(false);
    setCurrentStep(OPEN_ACCOUNT_STEP.ENTER_ACCOUNT_INFORMATION);
  };

  const onSubmitOpenAccountForm = async formValues => {
    setIsLoadingOpenAccount(true);
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
    setIsLoadingOpenAccount(false);
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
      setShowAlert({
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
      setIsLoadingCustomer(true);
      getCustomerInfoRequest();
    }
  }, [showCustomerInfoBottom]);

  useEffect(() => {
    if (jobData) {
      const jobType = customer.job_t;
      const jobMapList = jobData.job_t || [];
      customer.job_display = jobMapList.find(item => item.key === jobType)?.value || '';
      const subJobType = customer.sub_job_t_v;
      const subJobMapList = jobData.sub_job_t || [];
      customer.sub_job_display = subJobMapList.find(item => item.key === subJobType)?.value || '';
      setIsLoadingCustomer(false);
    }
  }, [jobData]);

  useEffect(() => {
    if (customer && !jobData) {
      requestGetJob(`${getJobCode};${getSubJobCode}`);
    }
  }, [customer]);

  useEffect(() => {
    if (getCustomerFailedMessage) {
      setIsLoadingCustomer(false);
      setShowAlert({
        isShow: true,
        title: 'Sorry!',
        content: getCustomerFailedMessage,
      });
    }
  }, [getCustomerFailedMessage]);

  return (
    <>
      <div className="open-account__wrapper">
        {(isLoadingCustomer || isLoadingOpenAccount) && <Spinner />}
        <Header
          title="Open Account"
          onClick={moveBack}
        />
        {currentStep === OPEN_ACCOUNT_STEP.VIEW_TERMS && (
          <TermAndConditions
            product={productInfo}
            onSubmit={onSubmitAgreeTerms}
          />
        )}

        {showCustomerInfoBottom && !isLoadingCustomer && (
          <CustomerInfoBottom
            customerInfo={{ ...customer, cus_adr_telno }}
            onClose={() => setShowCustomerInfoBottom(false)}
            onClickConfirm={handleConfirmCustomerInfo}
            onClickChangeProfile={handleNavigateChangeProfile}
          />
        )}
        {currentStep === OPEN_ACCOUNT_STEP.ENTER_ACCOUNT_INFORMATION && (
          <EnterAccountInformation
            onSubmit={onSubmitOpenAccountForm}
            interestRate={ntfct_intrt}
            productName={lcl_prdt_nm}
          />
        )}
        {currentStep === OPEN_ACCOUNT_STEP.COMPLETED && (
          <OpenAccountSuccessful openAccountInfo={openAccountSuccessInfo} />
        )}
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={showAlert.isShow}
        title={showAlert.title}
        subtitle={showAlert.content}
        textAlign="left"
        firstButton={{
          onClick: () => setShowAlert({ isShow: false, title: '', content: '' }),
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default withHTMLParseI18n(OpenAccount);
