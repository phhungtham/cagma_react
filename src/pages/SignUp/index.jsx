import { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { BiometricAuthType } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import getEkycInfo from '@utilities/gmCommon/getEkycInfo';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { nativeParamsSelector } from 'app/redux/selector';

import AgreeTermsConditions from './components/AgreeTermsConditions';
import SignUpCreateID from './components/CreateID';
import SignUpCreatePasscode from './components/CreatePasscode';
import SignUpCreatePassword from './components/CreatePassword';
import EKYCInProgress from './components/EKYCInProgress';
import EKYCResult from './components/EKYCResult';
import SignUpEnterEmail from './components/EnterEmail';
import EnterPersonalDetail from './components/EnterPersonalDetail';
import OpenAccountInstruction from './components/OpenAccountInstruction';
import SetUpAlerts from './components/SetUpAlerts';
import SetUpBiometricAuth from './components/SetUpBiometricAuth';
import SignUpSuccess from './components/SignUpSuccess';
import SignUpVerifyID from './components/VerifyID';
import VerifyIdentityTerms from './components/VerifyIdentityTerms';
import VerifyMembershipResult from './components/VerifyMembershipResult';
import VerifyUserInfo from './components/VerifyUserInfo';
import { SignUpStep } from './constants';

export const SignUpContext = createContext();

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState();
  const [verifyUserInfoStatus, setVerifyUserInfoStatus] = useState();
  const [deviceId, setDeviceId] = useState();
  const [userId, setUserId] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const { requestApi } = useApi();
  const nativeParams = useSelector(nativeParamsSelector);

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

  const handleConfirmEmail = values => {
    setCurrentStep(SignUpStep.VERIFY_IDENTITY_TERMS);
  };

  const handleNavigateEKYCProgress = ekycVerifyExternalLink => {
    openURLInBrowser(ekycVerifyExternalLink);
    setCurrentStep(SignUpStep.EKYC_IN_PROGRESS);
  };

  const handleConfirmEKYC = () => {
    setCurrentStep(SignUpStep.ENTER_PERSONAL_DETAIL);
  };

  const handleSubmitPersonalDetail = () => {
    setCurrentStep(SignUpStep.EKYC_RESULT);
  };

  const handleNavigateCreateId = () => {
    setCurrentStep(SignUpStep.CREATE_ID);
  };

  const handleCreateID = id => {
    setUserId(id);
    setCurrentStep(SignUpStep.CREATE_PASSWORD);
  };

  const handleCreatePassword = () => {
    setCurrentStep(SignUpStep.MOTP_AGREE_TERMS);
  };

  const handleConfirmTermsConditions = () => {
    setCurrentStep(SignUpStep.CREATE_PASSCODE);
  };

  const handleCreatePasscodeSuccess = () => {
    setCurrentStep(SignUpStep.SIGN_UP_COMPLETE);
  };

  const handleNavigateSetupBiometricAuth = () => {
    setCurrentStep(SignUpStep.SET_UP_BIOMETRIC_AUTH);
  };

  const handleNavigateSetUpAlerts = () => {
    setCurrentStep(SignUpStep.SET_UP_ALERTS);
  };

  const handleNavigateOpenAccountInstruction = () => {
    setCurrentStep(SignUpStep.OPEN_ACCOUNT_INSTRUCTION);
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
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
      const { ekyc_aplct_stp_c: applyCode } = data;
      if (Number(applyCode) === 1) {
        setCurrentStep(SignUpStep.VERIFY_IDENTITY_TERMS);
      }
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const getEkycInfoCallback = result => {
    const { isEkycProcessing, email, deviceId } = result || {};
    setDeviceId(deviceId);
    // setUserEmail(email);
    const isFromLogin = nativeParams?.isFromLogin;
    if (!isEkycProcessing) {
      if (isFromLogin) {
        setCurrentStep(SignUpStep.ENTER_EMAIL);
        // setCurrentStep(SignUpStep.ENTER_PERSONAL_DETAIL); //TODO: Just for test
      } else {
        //Sign Up New Account
        setCurrentStep(SignUpStep.VERIFY_USER_INFO);
      }
    } else {
      requestCheckEkycStatus({ deviceId, email });
    }
  };

  // useEffect(() => {
  //   if (nativeParams) {
  //     getEkycInfo(getEkycInfoCallback);
  //   }
  // }, [nativeParams]);

  useEffect(() => {
    getEkycInfo(getEkycInfoCallback);
  }, []);

  return (
    <SignUpContext.Provider value={{ deviceId, userId }}>
      {showLoading && <Spinner />}
      <div className="sign-up__wrapper page__wrapper">
        {currentStep === SignUpStep.VERIFY_ID && <SignUpVerifyID onConfirm={handleConfirmVerifyID} />}
        {currentStep === SignUpStep.VERIFY_USER_INFO && (
          <VerifyUserInfo
            navigateToVerifyResult={handleNavigateToVerifyMemberResult}
            navigateToVerifyEmail={() => setCurrentStep(SignUpStep.ENTER_EMAIL)}
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
            onConfirm={handleConfirmEmail}
            onNavigateEkycVerify={handleNavigateEkycVerify}
            onNavigateMOTPAgreeTerms={handleNavigateMOTPAgreeTerms}
          />
        )}
        {currentStep === SignUpStep.VERIFY_IDENTITY_TERMS && (
          <VerifyIdentityTerms onConfirm={handleNavigateEKYCProgress} />
        )}
        {currentStep === SignUpStep.EKYC_IN_PROGRESS && <EKYCInProgress onConfirm={handleConfirmEKYC} />}
        {currentStep === SignUpStep.ENTER_PERSONAL_DETAIL && (
          <EnterPersonalDetail onConfirm={handleSubmitPersonalDetail} />
        )}
        {currentStep === SignUpStep.EKYC_RESULT && (
          <EKYCResult
            isSuccess={false}
            onNavigate={handleNavigateCreateId}
          />
        )}
        {currentStep === SignUpStep.CREATE_ID && <SignUpCreateID onConfirm={handleCreateID} />}
        {currentStep === SignUpStep.CREATE_PASSWORD && <SignUpCreatePassword onConfirm={handleCreatePassword} />}
        {currentStep === SignUpStep.MOTP_AGREE_TERMS && (
          <AgreeTermsConditions onConfirm={handleConfirmTermsConditions} />
        )}
        {currentStep === SignUpStep.CREATE_PASSCODE && <SignUpCreatePasscode onConfirm={handleCreatePasscodeSuccess} />}
        {currentStep === SignUpStep.SIGN_UP_COMPLETE && <SignUpSuccess onConfirm={handleNavigateSetupBiometricAuth} />}
        {currentStep === SignUpStep.SET_UP_BIOMETRIC_AUTH && (
          <SetUpBiometricAuth
            type={BiometricAuthType.TOUCH_ID}
            onSkipSetUp={handleNavigateSetUpAlerts}
          />
        )}
        {currentStep === SignUpStep.SET_UP_ALERTS && (
          <SetUpAlerts
            onSkipSetUp={handleNavigateOpenAccountInstruction}
            onConfirmSetUp={handleNavigateOpenAccountInstruction}
          />
        )}
        {currentStep === SignUpStep.OPEN_ACCOUNT_INSTRUCTION && (
          <OpenAccountInstruction
            useCanadaID
            onSkipSetUp={() => {}}
            onOpenAccount={() => {}}
          />
        )}
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
          label: 'Confirm',
        }}
      />
    </SignUpContext.Provider>
  );
};

export default SignUp;
