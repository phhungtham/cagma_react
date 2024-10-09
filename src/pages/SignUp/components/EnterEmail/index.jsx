import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ArrowRight } from '@assets/icons';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { EMAIL_VERIFY_IN_SECONDS } from '@common/constants/common';
import { moveBack } from '@utilities/index';

const SignUpEnterEmail = ({ onConfirm, onNavigateUpdateEmail }) => {
  const [alreadySendEmailVerification, setAlreadySendEmailVerification] = useState(false);
  const [showEmailVerifyCode, setShowEmailVerifyCode] = useState(false);
  const [disabledVerifyButton, setDisabledVerifyButton] = useState(false);
  const [showUnableVerifyEmailAlert, setShowUnableVerifyEmailAlert] = useState(false);
  //TODO: Handle use ref for call reset timer of child component
  const [timer, setTimer] = useState();
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const [verificationCode] = watch(['verificationCode']);

  const invalidVerificationCode = verificationCode?.length !== 6;

  const handleRequestGetEmailVerifyCode = async () => {
    setShowEmailVerifyCode(true);

    if (!alreadySendEmailVerification) {
      setAlreadySendEmailVerification(true);
    }
  };

  const handleSendEmailVerifyCode = async () => {};

  const handleShowUnableVerifyEmailAlert = () => {
    setShowUnableVerifyEmailAlert(true);
  };

  const handleCloseUnableVerifyEmailAlert = () => {
    setShowUnableVerifyEmailAlert(false);
  };

  const handleSubmitForm = values => {
    onConfirm(values);
  };

  const handleNavigateUpdateEmail = () => {
    onNavigateUpdateEmail();
  };

  return (
    <>
      <div>
        <Header
          title="Sign up"
          onClick={moveBack}
        />
        <div className="page__form">
          <div className="page__title">Enter your e-mail</div>
          <div className="form__section mt-4">
            <Controller
              render={({ field }) => (
                <Input
                  label="e-mail"
                  type="text"
                  maxLength={40}
                  {...field}
                  endAdornment={
                    <Button
                      label={alreadySendEmailVerification ? 'Resend' : 'Request'}
                      variant="outlined__primary"
                      className="btn__send btn__sm"
                      onClick={handleRequestGetEmailVerifyCode}
                    />
                  }
                />
              )}
              control={control}
              name="email"
            />
            {showEmailVerifyCode && (
              <Controller
                render={({ field }) => (
                  <Input
                    label="Verification code"
                    type="number"
                    remainingTime={EMAIL_VERIFY_IN_SECONDS}
                    timer={timer}
                    endAdornment={
                      <Button
                        label="Verify"
                        variant="outlined__primary"
                        className="btn__send btn__sm"
                        disable={invalidVerificationCode || disabledVerifyButton}
                        onClick={handleSendEmailVerifyCode}
                      />
                    }
                    maxLength={6}
                    errorMessage={errors?.verificationCode?.message || ''}
                    {...field}
                  />
                )}
                control={control}
                name="verificationCode"
              />
            )}
          </div>
          <div className="flex-center mt-4">
            <Button
              variant="text__gray"
              label="Unable to verify this email?"
              size="sm"
              endIcon={<ArrowRight />}
              onClick={handleShowUnableVerifyEmailAlert}
            />
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label="Next"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(handleSubmitForm)}
            disable={!isValid}
          />
        </div>
      </div>
      {showUnableVerifyEmailAlert && (
        <Alert
          isCloseButton={false}
          isShowAlert={showUnableVerifyEmailAlert}
          title="Unable to verify this email?"
          subtitle="For security reasons, please verify the email registered with Shinhan Bank Canada. If you're unsure, you can update your email after verifying your ID information."
          onClose={handleCloseUnableVerifyEmailAlert}
          textAlign="left"
          firstButton={{
            onClick: handleNavigateUpdateEmail,
            label: 'Update Email',
          }}
          secondButton={{
            onClick: handleCloseUnableVerifyEmailAlert,
            label: 'Cancel',
          }}
        />
      )}
    </>
  );
};

export default SignUpEnterEmail;
