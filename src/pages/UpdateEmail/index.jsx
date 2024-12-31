import { createContext, useEffect, useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { ctaLabels } from '@common/constants/labels';
import useMove from '@hooks/useMove';
import clearEmailUpdateInfo from '@utilities/gmCommon/clearEmailUpdateInfo';
import getEmailUpdateInfo from '@utilities/gmCommon/getEmailUpdateInfo';
import setEmailUpdateInfo from '@utilities/gmCommon/setEmailUpdateInfo';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import EnterEmail from './components/EnterEmail';
import EnterUserId from './components/EnterUserId';
import IdentityVerifyResult from './components/IdentityVerifyResult';
import VerifyIdentityTerms from './components/VerifyIdentityTerms';
import { UpdateEmailStep } from './constants';

export const UpdateEmailContext = createContext();

const UpdateEmail = ({ translate }) => {
  const [currentStep, setCurrentStep] = useState();
  const [updateEmailInfo, setUpdateEmailInfo] = useState();
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
    isMoveHome: false,
  });
  const [showLoading, setShowLoading] = useState(false);
  const { moveHomeNative } = useMove();

  const handleCloseAlert = () => {
    if (alert.isMoveHome) {
      moveHomeNative();
    }
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  const setDataToNativeCache = data => {
    setEmailUpdateInfo(data);
  };

  const handleConfirmEnterUserId = ({ userId }) => {
    setUpdateEmailInfo({ userId });
    setCurrentStep(UpdateEmailStep.ENTER_EMAIL);
  };

  const handleConfirmEmail = email => {
    setUpdateEmailInfo({ ...updateEmailInfo, email });
    setCurrentStep(UpdateEmailStep.VERIFY_YOUR_IDENTIFICATION);
  };

  const handleNavigateEnterId = () => {
    setCurrentStep(UpdateEmailStep.ENTER_USER_ID);
  };

  const handleNavigateEnterEmail = () => {
    setCurrentStep(UpdateEmailStep.ENTER_EMAIL);
  };

  const handleConfirmVerifyIdentification = ({ firstName, lastName }) => {
    setDataToNativeCache({ ...updateEmailInfo, firstName, lastName });
    setUpdateEmailInfo({ ...updateEmailInfo, firstName, lastName });
    setCurrentStep(UpdateEmailStep.IDENTIFICATION_RESULT);
  };

  const getEmailUpdateInfoCallback = result => {
    const { email, userId, firstName, lastName } = result || {};
    if (email && userId && firstName && lastName) {
      //Just check one param, don't need check all params
      setUpdateEmailInfo(result);
      setCurrentStep(UpdateEmailStep.IDENTIFICATION_RESULT);
    } else {
      setCurrentStep(UpdateEmailStep.ENTER_USER_ID);
    }
  };

  const handleRestart = () => {
    clearEmailUpdateInfo();
    setCurrentStep(UpdateEmailStep.ENTER_USER_ID);
  };

  useEffect(() => {
    getEmailUpdateInfo(getEmailUpdateInfoCallback);
  }, []);

  return (
    <UpdateEmailContext.Provider
      value={{
        translate,
        setShowLoading,
        setAlert,
        updateEmailInfo,
        onRestart: handleRestart,
      }}
    >
      {showLoading && <Spinner />}
      <div className="change-email__wrapper h-screen">
        {currentStep === UpdateEmailStep.ENTER_USER_ID && <EnterUserId onConfirm={handleConfirmEnterUserId} />}
        {currentStep === UpdateEmailStep.ENTER_EMAIL && (
          <EnterEmail
            onNavigateEnterId={handleNavigateEnterId}
            onConfirm={handleConfirmEmail}
          />
        )}
        {currentStep === UpdateEmailStep.VERIFY_YOUR_IDENTIFICATION && (
          <VerifyIdentityTerms
            onConfirm={handleConfirmVerifyIdentification}
            onNavigateEnterEmail={handleNavigateEnterEmail}
          />
        )}
        {currentStep === UpdateEmailStep.IDENTIFICATION_RESULT && <IdentityVerifyResult />}
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
    </UpdateEmailContext.Provider>
  );
};

export default withHTMLParseI18n(UpdateEmail);
