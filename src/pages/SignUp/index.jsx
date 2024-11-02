import { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { BiometricAuthType } from '@common/constants/common';
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
import { SignUpStep, VerifyMembershipResultStatus } from './constants';

export const SignUpContext = createContext();

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState();
  const [userEmail, setUserEmail] = useState();
  const [deviceId, setDeviceId] = useState();
  const nativeParams = useSelector(nativeParamsSelector);

  const handleConfirmVerifyID = values => {
    setCurrentStep(SignUpStep.VERIFY_USER_INFO);
  };

  const handleConfirmVerifyUserInfo = values => {
    setCurrentStep(SignUpStep.VERIFY_MEMBERSHIP_RESULT);
  };

  const handleNavigateVerifyMembership = () => {
    //TODO: For test
    setCurrentStep(SignUpStep.ENTER_EMAIL);
  };

  const handleConfirmEmail = values => {
    setCurrentStep(SignUpStep.VERIFY_IDENTITY_TERMS);
  };

  const handleNavigateUpdateEmail = () => {
    setCurrentStep(SignUpStep.VERIFY_USER_INFO);
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

  const handleCreateID = () => {
    setCurrentStep(SignUpStep.CREATE_PASSWORD);
  };

  const handleCreatePassword = () => {
    setCurrentStep(SignUpStep.AGREE_TERMS_CONDITIONS);
  };

  const handleConfirmTermsConditions = () => {
    setCurrentStep(SignUpStep.CREATE_PASSCODE);
  };

  const handleCreatePasscode = () => {
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

  const getEkycInfoCallback = result => {
    const { isEkycProcessing, email, deviceId } = result || {};
    setDeviceId(deviceId);
    // setUserEmail(email);
    const isFromLogin = nativeParams?.isFromLogin;
    if (!isEkycProcessing) {
      if (isFromLogin) {
        setCurrentStep(SignUpStep.ENTER_EMAIL);
      } else {
        //Sign Up New Account
        setCurrentStep(SignUpStep.VERIFY_USER_INFO);
      }
    } else {
      //TODO: Call CASE109
    }
  };

  useEffect(() => {
    // if (nativeParams) {
    getEkycInfo(getEkycInfoCallback);
    // }
  }, [nativeParams]);

  return (
    <SignUpContext.Provider value={{ deviceId }}>
      <div className="sign-up__wrapper page__wrapper">
        {currentStep === SignUpStep.VERIFY_ID && <SignUpVerifyID onConfirm={handleConfirmVerifyID} />}
        {currentStep === SignUpStep.VERIFY_USER_INFO && (
          <VerifyUserInfo
            onConfirm={handleConfirmVerifyUserInfo}
            navigateToVerifyEmail={() => setCurrentStep(SignUpStep.ENTER_EMAIL)}
          />
        )}
        {currentStep === SignUpStep.VERIFY_MEMBERSHIP_RESULT && (
          <VerifyMembershipResult
            type={VerifyMembershipResultStatus.FAILED}
            onNavigateVerifyMembership={handleNavigateVerifyMembership}
          />
        )}
        {currentStep === SignUpStep.ENTER_EMAIL && (
          <SignUpEnterEmail
            onConfirm={handleConfirmEmail}
            onNavigateUpdateEmail={handleNavigateUpdateEmail}
          />
        )}
        {currentStep === SignUpStep.VERIFY_IDENTITY_TERMS && (
          <VerifyIdentityTerms onConfirm={handleNavigateEKYCProgress} />
        )}
        {currentStep === SignUpStep.EKYC_IN_PROGRESS && <EKYCInProgress onConfirm={handleConfirmEKYC} />}
        {currentStep === SignUpStep.ENTER_PERSONAL_DETAIL && (
          <EnterPersonalDetail onSubmit={handleSubmitPersonalDetail} />
        )}
        {currentStep === SignUpStep.EKYC_RESULT && (
          <EKYCResult
            isSuccess={false}
            onNavigate={handleNavigateCreateId}
          />
        )}
        {currentStep === SignUpStep.CREATE_ID && <SignUpCreateID onConfirm={handleCreateID} />}
        {currentStep === SignUpStep.CREATE_PASSWORD && <SignUpCreatePassword onConfirm={handleCreatePassword} />}
        {currentStep === SignUpStep.AGREE_TERMS_CONDITIONS && (
          <AgreeTermsConditions onConfirm={handleConfirmTermsConditions} />
        )}
        {currentStep === SignUpStep.CREATE_PASSCODE && <SignUpCreatePasscode onConfirm={handleCreatePasscode} />}
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
    </SignUpContext.Provider>
  );
};

export default SignUp;
