import { useContext, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { EMAIL_VERIFY_IN_SECONDS, EMAIL_VERIFY_RETRY_MAX } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import { moveBack } from '@utilities/index';

import { EnterEmailSchema } from './schema';

const SignUpEnterEmail = ({ onNavigateEkycVerify, onNavigateMOTPAgreeTerms }) => {
  const { deviceId, ekycCached, setEkycToNativeCache } = useContext(SignUpContext);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [alreadySendEmailVerification, setAlreadySendEmailVerification] = useState(false);
  const [showEmailVerifyCode, setShowEmailVerifyCode] = useState(false);
  const [disabledVerifyButton, setDisabledVerifyButton] = useState(false);
  const [showUnableVerifyEmailAlert, setShowUnableVerifyEmailAlert] = useState(false);
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(EnterEmailSchema),
  });

  const {
    control,
    watch,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isValid },
  } = methods;

  const { requestApi } = useApi();
  const clearTimeOutRef = useRef();
  const verifyTimerResetRef = useRef(null);
  const verifyCodeSessionNumberRef = useRef(null);
  const verifyEmailFailedNumber = useRef(0);

  const [verificationCode, email] = watch(['verificationCode', 'email']);

  const invalidVerificationCode = verificationCode?.length !== 6;

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  const handleRequestGetEmailVerifyCode = async () => {
    const emailSchema = EnterEmailSchema.pick(['email']);
    const isEmailValid = emailSchema.isValidSync({ email: email });
    if (!isEmailValid || !email) {
      setAlert({
        isShow: true,
        title: '',
        content: 'Please check Your E-mail',
      });
      return;
    }
    setShowLoading(true);
    const request = {
      cus_email: email,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.requestGetEmailVerifyCode, request);
    setShowLoading(false);
    if (!isSuccess) {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
    const resultCode = data?.cnt;
    const isDuplicatedEmail = resultCode === 9;
    const isEmailAvailable = resultCode === 0;
    if (isDuplicatedEmail) {
      return setAlert({
        isShow: true,
        title: '',
        content: 'This email is already in use',
      });
    }

    if (isEmailAvailable) {
      if (clearTimeOutRef.current) {
        clearTimeout(clearTimeOutRef.current);
      }
      clearErrors('verificationCode');
      setValue('isEmailVerified', false, { shouldValidate: true });
      setDisabledVerifyButton(false);

      if (verifyTimerResetRef.current) verifyTimerResetRef.current();

      const { seqno } = data || {};
      verifyCodeSessionNumberRef.current = seqno;

      clearTimeOutRef.current = setTimeout(() => {
        setError('verificationCode', {
          type: 'timeout',
          message: 'Verification code has timed out. Resend E-mail and try again.',
        });
        setDisabledVerifyButton(true);
      }, EMAIL_VERIFY_IN_SECONDS * 1000);
      setShowEmailVerifyCode(true);

      if (!alreadySendEmailVerification) {
        setAlreadySendEmailVerification(true);
      }
    }
  };

  const requestUpdateEmail = async () => {
    setShowLoading(true);
    const payload = {
      cus_email: email,
      uuid_v: deviceId,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.updateEmail, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { screen_kd, cus_email } = data;
      setEkycToNativeCache({
        ...ekycCached,
        email: cus_email,
        isEkycProcessing: true,
      });
      if (Number(screen_kd) === 1) {
        onNavigateMOTPAgreeTerms();
      } else if (Number(screen_kd) === 2) {
        onNavigateEkycVerify();
      }
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleSendEmailVerifyCode = async () => {
    setShowLoading(true);
    const request = {
      cert_no: verificationCode,
      seqno: verifyCodeSessionNumberRef.current,
    };
    const { data, isSuccess, error } = await requestApi(endpoints.sendEmailVerifyCode, request);
    const resultCode = String(data?.result_cd || '');
    const isVerifyFailed = resultCode === '9';
    const isVerifySuccess = resultCode === '1';
    setShowLoading(false);
    if (isVerifyFailed) {
      verifyEmailFailedNumber.current += 1;
      if (verifyEmailFailedNumber.current === EMAIL_VERIFY_RETRY_MAX) {
        setError('verificationCode', {
          type: 'wrong',
          message: `You’ve entered the wrong code ${EMAIL_VERIFY_RETRY_MAX} times. Resend E-mail and try again.`,
        });
        setDisabledVerifyButton(true);
      } else {
        setError('verificationCode', {
          type: 'wrong',
          message: `You’ve entered the wrong code. (${verifyEmailFailedNumber.current}/${EMAIL_VERIFY_RETRY_MAX})`,
        });
      }

      return;
    }

    if (isVerifySuccess) {
      setShowEmailVerifyCode(false);
      setValue('isEmailVerified', true, { shouldValidate: true });
      clearErrors('verificationCode');
      requestUpdateEmail();
    }
  };

  useEffect(() => {
    return () => {
      if (clearTimeOutRef.current) {
        clearTimeout(clearTimeOutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div>
        {showLoading && <Spinner />}
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
                  label="Email Address"
                  placeholder="emailname@email.com"
                  type="text"
                  endAdornment={
                    <Button
                      label={alreadySendEmailVerification ? 'Resend' : 'Request'}
                      variant="outlined__primary"
                      className="btn__send btn__sm"
                      onClick={handleRequestGetEmailVerifyCode}
                    />
                  }
                  maxLength={64}
                  {...field}
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
                    placeholder="6 digits"
                    remainingTime={EMAIL_VERIFY_IN_SECONDS}
                    onResetTimer={cb => (verifyTimerResetRef.current = cb)}
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
        </div>
        <div className="footer__fixed">
          <Button
            label="Next"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSendEmailVerifyCode}
            disable={invalidVerificationCode || disabledVerifyButton}
          />
        </div>
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
    </>
  );
};

export default SignUpEnterEmail;
