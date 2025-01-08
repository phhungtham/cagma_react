/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useMove from '@hooks/useMove';
import clearEkycInfo from '@utilities/gmCommon/clearEkycInfo';
import getEkycInfo from '@utilities/gmCommon/getEkycInfo';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import setEkycInfo from '@utilities/gmCommon/setEkycInfo';
import { nativeParamsSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import AgreeTermsConditions from './components/AgreeTermsConditions';
import SignUpCreateID from './components/CreateID';
import SignUpCreatePasscode from './components/CreatePasscode';
import SignUpCreatePassword from './components/CreatePassword';
import EKYCInProgress from './components/EKYCInProgress';
import EKYCResult from './components/EKYCResult';
import SignUpEnterEmail from './components/EnterEmail';
import EnterPersonalDetail from './components/EnterPersonalDetail';
import SignUpSuccess from './components/SignUpSuccess';
import ThankVisitAgain from './components/ThankVisitAgain';
import VerifyIdentityTerms from './components/VerifyIdentityTerms';
import VerifyMembershipResult from './components/VerifyMembershipResult';
import VerifyUserInfo from './components/VerifyUserInfo';
import { SignUpStep, SignUpStepStatus } from './constants';

export const SignUpContext = createContext();

const SignUp = ({ translate }) => {
  const [currentStep, setCurrentStep] = useState();
  const [verifyUserInfoStatus, setVerifyUserInfoStatus] = useState();
  const [deviceId, setDeviceId] = useState();
  const [ekycCached, setEkycCached] = useState();
  const [ekycStepStatus, setEkycStepStatus] = useState();
  const [existingCustomer, setExistingCustomer] = useState();
  const [getExistingCustomerByEkyc, setGetExistingCustomerByEkyc] = useState(false);
  const [userId, setUserId] = useState();
  const [isNavigateFromLogin, setIsNavigateFromLogin] = useState(false);
  const [ekycResultSuccess, setEkycResultSuccess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
    isMoveHome: false,
  });
  const { requestApi } = useApi();
  const { moveHomeNative } = useMove();
  const { isFromLogin, cusno } = useSelector(nativeParamsSelector) || {};

  const handleConfirmVerifyID = values => {
    setCurrentStep(SignUpStep.VERIFY_USER_INFO);
  };

  const handleNavigateToVerifyMemberResult = verifyStatus => {
    setVerifyUserInfoStatus(verifyStatus);
    setCurrentStep(SignUpStep.VERIFY_MEMBERSHIP_RESULT);
  };

  const handleNavigateVerifyMembership = () => {
    setCurrentStep(SignUpStep.VERIFY_USER_INFO);
  };

  const handleNavigateEkycVerify = () => {
    setCurrentStep(SignUpStep.VERIFY_IDENTITY_TERMS);
  };

  const handleNavigateMOTPAgreeTerms = () => {
    setCurrentStep(SignUpStep.MOTP_AGREE_TERMS);
  };

  const handleNavigateEnterEmail = () => {
    setCurrentStep(SignUpStep.ENTER_EMAIL);
  };

  const handleNavigateEKYCProgress = ekycVerifyExternalLink => {
    openURLInBrowser(ekycVerifyExternalLink, true);
    setCurrentStep(SignUpStep.EKYC_IN_PROGRESS);
  };

  const requestGetExistingCustomerInfo = async () => {
    setShowLoading(true);
    const { email: cus_email } = ekycCached || {};
    const payload = {
      cus_email: cus_email,
      uuid_v: deviceId,
    };
    const { data, error, isSuccess, errorCode } = await requestApi(endpoints.getExistingCustomerInfo, payload);
    setShowLoading(false);
    if (isSuccess) {
      setExistingCustomer(data);
    } else {
      let shouldMoveHome = false;
      if (errorCode === 'CASE.0006') {
        shouldMoveHome = true;
      }
      return setAlert({
        isShow: true,
        content: error,
        title: '',
        isMoveHome: shouldMoveHome,
      });
    }
  };

  const requestGetEkycDetail = async () => {
    setShowLoading(true);
    const { email: cus_email } = ekycCached || {};
    const payload = {
      cus_email: cus_email,
      uuid_v: deviceId,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.getEkycDetail, payload);
    setShowLoading(false);
    if (isSuccess) {
      setExistingCustomer(data);
      setGetExistingCustomerByEkyc(true);
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleConfirmEKYC = async isFetchCustomerData => {
    if (isFetchCustomerData) {
      await requestGetExistingCustomerInfo();
    } else {
      await requestGetEkycDetail();
    }
    setCurrentStep(SignUpStep.ENTER_PERSONAL_DETAIL);
  };

  const handleSubmitPersonalDetail = () => {
    setEkycResultSuccess(true);
    setCurrentStep(SignUpStep.EKYC_RESULT);
  };

  const handleNavigateCreateId = () => {
    setCurrentStep(SignUpStep.CREATE_ID);
  };

  const handleNavigateCreatePasscode = () => {
    handleNavigatePasscodeAgreeTerms();
  };

  const handleCreateID = id => {
    setUserId(id);
    setCurrentStep(SignUpStep.CREATE_PASSWORD);
  };

  const handleNavigatePasscodeAgreeTerms = () => {
    setCurrentStep(SignUpStep.MOTP_AGREE_TERMS);
  };

  const handleCreatePassword = () => {
    handleNavigatePasscodeAgreeTerms();
  };

  const handleConfirmTermsConditions = () => {
    setCurrentStep(SignUpStep.CREATE_PASSCODE);
  };

  const handleCreatePasscodeSuccess = userId => {
    setUserId(userId);
    setCurrentStep(SignUpStep.SIGN_UP_COMPLETE);
  };

  const handleNavigateEkycResult = ({ isSuccess }) => {
    setEkycResultSuccess(isSuccess);
    setCurrentStep(SignUpStep.EKYC_RESULT);
  };

  const handleNavigateWelcome = () => {
    setCurrentStep(SignUpStep.VERIFY_USER_INFO);
  };

  const handleCloseAlert = () => {
    if (alert.isMoveHome) {
      moveHomeNative();
    }
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  const handleNavigateThankVisitAgain = () => {
    setCurrentStep(SignUpStep.THANK_VISIT_AGAIN);
  };

  const requestCheckEkycStatus = async ({ deviceId, email }) => {
    setShowLoading(true);
    const payload = {
      cus_email: email,
      uuid_v: deviceId,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.checkEkycStatus, payload);
    setShowLoading(false);
    if (isSuccess) {
      //Check case user is sign up process but login with user empty MOTP
      //If user login different with user sign-up process. Clear all ekyc cache and move to email verify follow isFromLogin
      //temp check cusno
      console.log(`cusno from login: ${cusno} and cusno from CASE109: ${data.cusno}`);
      if (isFromLogin && String(cusno) !== String(data.cusno)) {
        clearEkycInfo();
        setEkycCached({});
        return setCurrentStep(SignUpStep.ENTER_EMAIL);
      }
      setEkycStepStatus(data);
      const { ekyc_aplct_stp_c: applyCode } = data;
      if (Number(applyCode) === SignUpStepStatus.REGISTERED_EMAIL) {
        setCurrentStep(SignUpStep.VERIFY_IDENTITY_TERMS);
      } else if ([SignUpStepStatus.EKYC_IN_PROGRESS, SignUpStepStatus.EKYC_DONE].includes(Number(applyCode))) {
        setCurrentStep(SignUpStep.EKYC_IN_PROGRESS);
      } else if (
        [SignUpStepStatus.INFO_APPROVED, SignUpStepStatus.INFO_REVIEWING, SignUpStepStatus.INFO_REJECTED].includes(
          Number(applyCode)
        )
      ) {
        setCurrentStep(SignUpStep.THANK_VISIT_AGAIN);
      } else if (isFromLogin && Number(applyCode) === SignUpStepStatus.SKIP_THANK_VISIT_AGAIN) {
        clearEkycInfo();
        setEkycCached({});
        return setCurrentStep(SignUpStep.ENTER_EMAIL);
      }
    } else {
      //Sign Up New Account
      setCurrentStep(SignUpStep.VERIFY_USER_INFO);
    }
  };

  const setEkycToNativeCache = info => {
    setEkycInfo(info);
    setEkycCached(info);
  };

  const getEkycInfoCallback = result => {
    const { isEkycProcessing, email, deviceId } = result || {};
    setEkycToNativeCache(result);
    setDeviceId(deviceId);
    // setUserEmail(email);
    setIsNavigateFromLogin(isFromLogin);
    if (!isEkycProcessing) {
      if (isFromLogin) {
        setCurrentStep(SignUpStep.ENTER_EMAIL);
      } else {
        //Sign Up New Account
        setCurrentStep(SignUpStep.VERIFY_USER_INFO);
      }
    } else {
      requestCheckEkycStatus({ deviceId, email });
    }
  };

  useEffect(() => {
    getEkycInfo(getEkycInfoCallback);
  }, []);

  return (
    <SignUpContext.Provider
      value={{
        deviceId,
        userId,
        existingCustomer,
        ekycCached,
        setEkycToNativeCache,
        ekycStepStatus,
        translate,
        isNavigateFromLogin,
        getExistingCustomerByEkyc,
      }}
    >
      {showLoading && <Spinner />}
      <div className="sign-up__wrapper h-screen">
        {currentStep === SignUpStep.VERIFY_USER_INFO && (
          <VerifyUserInfo
            navigateToVerifyResult={handleNavigateToVerifyMemberResult}
            navigateToVerifyEmail={handleNavigateEnterEmail}
          />
        )}
        {currentStep === SignUpStep.VERIFY_MEMBERSHIP_RESULT && (
          <VerifyMembershipResult
            type={verifyUserInfoStatus}
            onNavigateVerifyMembership={handleNavigateVerifyMembership}
          />
        )}
        {currentStep === SignUpStep.ENTER_EMAIL && (
          <SignUpEnterEmail
            onNavigateEkycVerify={handleNavigateEkycVerify}
            onNavigateMOTPAgreeTerms={handleNavigateMOTPAgreeTerms}
            onNavigateVerifyMember={handleNavigateVerifyMembership}
          />
        )}
        {currentStep === SignUpStep.VERIFY_IDENTITY_TERMS && (
          <VerifyIdentityTerms
            onConfirm={handleNavigateEKYCProgress}
            onNavigateEnterEmail={handleNavigateEnterEmail}
          />
        )}
        {currentStep === SignUpStep.EKYC_IN_PROGRESS && (
          <EKYCInProgress
            onConfirm={handleConfirmEKYC}
            navigateToVerifyResult={handleNavigateToVerifyMemberResult}
            onNavigateVerifyMember={handleNavigateVerifyMembership}
          />
        )}
        {currentStep === SignUpStep.ENTER_PERSONAL_DETAIL && (
          <EnterPersonalDetail onConfirm={handleSubmitPersonalDetail} />
        )}
        {currentStep === SignUpStep.EKYC_RESULT && (
          <EKYCResult
            onNavigate={handleNavigateCreateId}
            isSuccess={ekycResultSuccess}
            onNavigateWelcome={handleNavigateWelcome}
          />
        )}
        {currentStep === SignUpStep.THANK_VISIT_AGAIN && (
          <ThankVisitAgain
            onConfirm={handleConfirmVerifyID}
            onNavigateEkycResult={handleNavigateEkycResult}
            onNavigateCreateId={handleNavigateCreateId}
            onNavigateCreatePasscode={handleNavigateCreatePasscode}
          />
        )}
        {currentStep === SignUpStep.CREATE_ID && (
          <SignUpCreateID
            onConfirm={handleCreateID}
            onNavigateThankVisitAgain={handleNavigateThankVisitAgain}
          />
        )}
        {currentStep === SignUpStep.CREATE_PASSWORD && (
          <SignUpCreatePassword
            onConfirm={handleCreatePassword}
            onNavigateCreateId={handleNavigateCreateId}
          />
        )}
        {currentStep === SignUpStep.MOTP_AGREE_TERMS && (
          <AgreeTermsConditions onConfirm={handleConfirmTermsConditions} />
        )}
        {currentStep === SignUpStep.CREATE_PASSCODE && (
          <SignUpCreatePasscode
            onConfirm={handleCreatePasscodeSuccess}
            onNavigatePasscodeAgreeTerms={handleNavigatePasscodeAgreeTerms}
          />
        )}
        {currentStep === SignUpStep.SIGN_UP_COMPLETE && <SignUpSuccess />}
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        onClose={handleCloseAlert}
        textAlign="left"
        firstButton={{
          onClick: handleCloseAlert,
          label: translate(ctaLabels.confirm),
        }}
      />
    </SignUpContext.Provider>
  );
};

export default withHTMLParseI18n(SignUp);
