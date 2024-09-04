import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Spinner from '@common/components/atoms/Spinner';
import Alert from '@common/components/molecules/Alert';
import { getJobCode, getSubJobCode } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import { MENU_CODE } from '@configs/global/constants';
import useCommonCode from '@hooks/useCommonCode';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { routePaths } from '@routes/paths';
import { apiCall } from '@shared/api';
import { convertObjectBaseMappingFields } from '@utilities/convert';
import { moveNext } from '@utilities/index';
import { nativeParamsSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import CustomerInfoBottom from './components/CustomerInfoBottom';
import EnterAccountInformation from './components/EnterAccountInformation';
import OpenAccountSuccessful from './components/OpenAccountSuccessful';
import TermAndConditions from './components/TermAndConditions';
import { accountFormMapFields, OPEN_ACCOUNT_STEP, openAccountInfo } from './constants';
import { getCustomerInfoRequest } from './redux/customer/action';
import { customerReducer } from './redux/customer/reducer';
import { customerSaga } from './redux/customer/saga';
import { customerInfo } from './redux/customer/selector';
import { CustomerFeatureName } from './redux/customer/type';

//TODO: Call API Success
//TODO: View Term PDF File
//TODO: Get response from API for show Complete screen
const OpenAccount = ({ translation }) => {
  useReducers([{ key: CustomerFeatureName, reducer: customerReducer }]);
  useSagas([{ key: CustomerFeatureName, saga: customerSaga }]);
  const productInfo = useSelector(nativeParamsSelector);

  console.log('productInfo :>> ', productInfo);
  const customer = useSelector(customerInfo);

  const { sendRequest: requestGetJob, data: jobData, isLoading: isLoadingGetJob } = useCommonCode();

  const [currentStep, setCurrentStep] = useState(OPEN_ACCOUNT_STEP.VIEW_TERMS);
  const [showCustomerInfoBottom, setShowCustomerInfoBottom] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [isLoadingOpenAccount, setIsLoadingOpenAccount] = useState(false);
  const [showAlert, setShowAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });

  const {
    prdt_c,
    product_ccy,
    ntfct_intrt,
    dep_sjt_class,
    prdt_st_trm_unit_cnt,
    prdt_close_trm_unit_cnt,
    prdt_psb_trm_unit_c,
    lcl_prdt_nm,
  } = productInfo;

  //Get phone number of home address
  const homeAddress = customer?.r_CAME001_1Vo?.find(address => address.cus_adr_t === 11);
  const cus_adr_telno = homeAddress?.cus_adr_telno || '';

  const onSubmitAgreeTerms = () => {
    setIsLoadingCustomer(true);
    setShowCustomerInfoBottom(true);
  };

  const handleConfirmCustomerInfo = () => {
    setShowCustomerInfoBottom(false);
    setCurrentStep(OPEN_ACCOUNT_STEP.ENTER_ACCOUNT_INFORMATION);
  };

  const onSubmitOpenAccountForm = async formValues => {
    setIsLoadingOpenAccount(true);
    const request = convertObjectBaseMappingFields(formValues, accountFormMapFields);
    request.prdt_c = prdt_c;
    request.apl_intrt = ntfct_intrt;
    request.tpd_trx_t = 0;
    request.tpd_chk = request.tpd_chk ? 'Y' : 'N';
    request.credit_chk = request.credit_chk ? '1' : '0';
    request.trx_amt = Number(request.trx_amt);
    delete request.intendedUseAccountDisplay;
    const openAccountResponse = await apiCall(endpoints.openAccount, 'POST', request);
    setIsLoadingOpenAccount(false);
    const openAccountStatus = openAccountResponse?.data?.elHeader;
    if (openAccountStatus?.resSuc) {
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
      getCustomerInfoRequest();
    }
  }, [showCustomerInfoBottom]);

  useEffect(() => {
    if (jobData) {
      const jobType = customer.job_t;
      const jobMapList = jobData.job_t || [];
      customer.job_display = jobMapList.find(item => item.key === jobType)?.value || '';
      const subJobType = customer.sub_job_t_v;
      const subJobMapList = jobData.sub_job_t_v || [];
      customer.sub_job_display = subJobMapList.find(item => item.key === subJobType)?.value || '';
      setIsLoadingCustomer(false);
    }
  }, [jobData]);

  useEffect(() => {
    if (customer && !jobData) {
      requestGetJob(`${getJobCode};${getSubJobCode}`);
    }
  }, [customer]);

  return (
    <>
      <div className="open-account__wrapper">
        {(isLoadingCustomer || isLoadingOpenAccount) && <Spinner />}
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
        {currentStep === OPEN_ACCOUNT_STEP.COMPLETED && <OpenAccountSuccessful openAccountInfo={openAccountInfo} />}
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
