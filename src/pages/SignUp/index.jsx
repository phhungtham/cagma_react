import { useState } from 'react';

import VerifyID from './components/VerifyID';
import VerifyMembershipResult from './components/VerifyMembershipResult';
import VerifyUserInfo from './components/VerifyUserInfo';
import { SignUpStep, VerifyMembershipResultStatus } from './constants';
import './styles.scss';

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(SignUpStep.VERIFY_ID);

  const handleConfirmVerifyID = values => {
    setCurrentStep(SignUpStep.VERIFY_USER_INFO);
  };

  const handleConfirmVerifyUserInfo = values => {
    setCurrentStep(SignUpStep.VERIFY_MEMBERSHIP_RESULT);
  };

  const handleNavigateVerifyMembership = () => {};

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
      </div>
    </>
  );
};

export default SignUp;
