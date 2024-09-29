import { useState } from 'react';

import EKYCInProgress from './components/EKYCInProgress';
import EKYCResult from './components/EKYCResult';
import SignUpEnterEmail from './components/EnterEmail';
import EnterPersonalDetail from './components/EnterPersonalDetail';
import VerifyID from './components/VerifyID';
import VerifyIdentityTerms from './components/VerifyIdentityTerms';
import VerifyMembershipResult from './components/VerifyMembershipResult';
import VerifyUserInfo from './components/VerifyUserInfo';
import { SignUpStep, VerifyMembershipResultStatus } from './constants';

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(SignUpStep.VERIFY_ID);

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

  const handleNavigateEKYCProgress = () => {
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

  return (
    <>
      <div className="sign-up__wrapper">
        {currentStep === SignUpStep.VERIFY_ID && <VerifyID onConfirm={handleConfirmVerifyID} />}
        {currentStep === SignUpStep.VERIFY_USER_INFO && <VerifyUserInfo onConfirm={handleConfirmVerifyUserInfo} />}
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
      </div>
    </>
  );
};

export default SignUp;
