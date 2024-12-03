import { useContext, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { EMAIL_VERIFY_IN_SECONDS, EMAIL_VERIFY_RETRY_MAX } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import {
  cardLabels,
  changeProfileLabels,
  commonLabels,
  ctaLabels,
  signUpEnterEmailLabels as labels,
  menuLabels,
} from '@common/constants/labels';
import { notAllowSpaceRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import useFocus from '@hooks/useFocus';
import useMove from '@hooks/useMove';
import { SignUpContext } from '@pages/SignUp';
import clearEkycInfo from '@utilities/gmCommon/clearEkycInfo';
import clearTempLoginInfo from '@utilities/gmCommon/clearTempLoginInfo';

import { EnterEmailSchema } from './schema';

const SignUpEnterEmail = ({ onNavigateEkycVerify, onNavigateMOTPAgreeTerms, onNavigateVerifyMember }) => {
  const { deviceId, ekycCached, setEkycToNativeCache, translate: t, isNavigateFromLogin } = useContext(SignUpContext);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [alreadySendEmailVerification, setAlreadySendEmailVerification] = useState(false);
  const [showEmailVerifyCode, setShowEmailVerifyCode] = useState(false);
  const [enabledVerifyCode, setEnabledVerifyCode] = useState(false);
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
  const { moveHomeNative } = useMove();
  const clearTimeOutRef = useRef();
  const verifyTimerResetRef = useRef(null);
  const verifyCodeSessionNumberRef = useRef(null);
  const verifyEmailFailedNumber = useRef(0);
  const { focusField } = useFocus();

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
        content: t(changeProfileLabels.checkYourEmail),
      });
      return;
    }
    setShowLoading(true);
    const request = {
      cus_email: email,
    };
    const endpoint = isNavigateFromLogin
      ? endpoints.requestGetEmailVerifyCodeMotp
      : endpoints.requestGetEmailVerifyCode;
    const { data, error, isSuccess } = await requestApi(endpoint, request);
    setShowLoading(false);
    if (!isSuccess) {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
    if (clearTimeOutRef.current) {
      clearTimeout(clearTimeOutRef.current);
    }
    clearErrors('verificationCode');
    setValue('isEmailVerified', false, { shouldValidate: true });
    setEnabledVerifyCode(true);
    setValue('verificationCode', '', { shouldValidate: true });

    if (verifyTimerResetRef.current) verifyTimerResetRef.current();

    const { seqno } = data || {};
    verifyCodeSessionNumberRef.current = seqno;

    clearTimeOutRef.current = setTimeout(() => {
      setError('verificationCode', {
        type: 'timeout',
        message: t(commonLabels.verifyEmailTimeout),
      });
      setEnabledVerifyCode(false);
    }, EMAIL_VERIFY_IN_SECONDS * 1000);
    setShowEmailVerifyCode(true);
    setTimeout(() => {
      focusField('verificationCode'); //Trigger auto focus after show email verify
    }, 100);

    if (!alreadySendEmailVerification) {
      setAlreadySendEmailVerification(true);
    }
  };

  const requestUpdateEmail = async () => {
    setShowLoading(true);
    const payload = {
      cus_email: email,
      uuid_v: deviceId,
      isFromLogin: isNavigateFromLogin ? '1' : '0',
    };
    const { data, error, isSuccess } = await requestApi(endpoints.updateEmail, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { screen_kd, cus_email, isFromLogin } = data;
      //Check case lost session on server or lost cusno
      if (isFromLogin === 0 || isFromLogin === '0') {
        clearEkycInfo();
        clearTempLoginInfo();
        moveHomeNative();
        return;
      }
      if (Number(screen_kd) === 1) {
        setEkycToNativeCache({
          ...ekycCached,
          email: cus_email,
        });
        onNavigateMOTPAgreeTerms();
      } else if (Number(screen_kd) === 2) {
        setEkycToNativeCache({
          ...ekycCached,
          email: cus_email,
          isEkycProcessing: true,
        });
        clearTempLoginInfo();
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
    const endpoint = isNavigateFromLogin ? endpoints.sendEmailVerifyCodeMotp : endpoints.sendEmailVerifyCode;
    const { data, isSuccess, error, requiredLogin } = await requestApi(endpoint, request);
    const resultCode = String(data?.result_cd || '');
    const isVerifyFailed = resultCode === '9';
    const isVerifySuccess = resultCode === '1';
    setShowLoading(false);
    if (isVerifyFailed) {
      verifyEmailFailedNumber.current += 1;
      if (verifyEmailFailedNumber.current >= EMAIL_VERIFY_RETRY_MAX) {
        setError('verificationCode', {
          type: 'wrong',
          message: t(commonLabels.verifyEmailWrongMax).replace('%1', EMAIL_VERIFY_RETRY_MAX),
        });
        setEnabledVerifyCode(false);
      } else {
        setError('verificationCode', {
          type: 'wrong',
          message: t(commonLabels.verifyEmailWrongNumber).replace('%', verifyEmailFailedNumber.current),
        });
      }

      return;
    } else if (isVerifySuccess) {
      setShowEmailVerifyCode(false);
      setEnabledVerifyCode(false);
      setValue('isEmailVerified', true, { shouldValidate: true });
      clearErrors('verificationCode');
      requestUpdateEmail();
    }
  };

  const handleClickBack = () => {
    if (isNavigateFromLogin) {
      clearTempLoginInfo();
      moveHomeNative();
    } else {
      onNavigateVerifyMember();
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
          title={t(menuLabels.signUp)}
          disabledMoveBack
          onClickBack={handleClickBack}
        />
        <div className="page__form">
          <div className="page__title">{t(labels.enterYourEmail)}</div>
          <div className="form__section mt-4">
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.email)}
                  placeholder=""
                  type="text"
                  regex={notAllowSpaceRegex}
                  disabled={enabledVerifyCode}
                  endAdornment={
                    <Button
                      label={alreadySendEmailVerification ? t(cardLabels.resend) : t(cardLabels.request)}
                      variant="outlined__primary"
                      className="btn-request-email btn__sm"
                      onClick={handleRequestGetEmailVerifyCode}
                      disable={enabledVerifyCode}
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
                    label={t(labels.verificationCode)}
                    type="number"
                    inputMode="numeric"
                    placeholder="6 digits"
                    remainingTime={EMAIL_VERIFY_IN_SECONDS}
                    onResetTimer={cb => (verifyTimerResetRef.current = cb)}
                    maxLength={6}
                    errorMessage={errors?.verificationCode?.message || ''}
                    disabled={!enabledVerifyCode}
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
            label={t(labels.next)}
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSendEmailVerifyCode}
            disable={invalidVerificationCode || !enabledVerifyCode}
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
          label: t(ctaLabels.confirm),
        }}
      />
    </>
  );
};

export default SignUpEnterEmail;
