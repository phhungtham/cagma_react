/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ArrowRight } from '@assets/icons';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { initAlert } from '@common/constants/bottomsheet';
import { EMAIL_VERIFY_IN_SECONDS, EMAIL_VERIFY_RETRY_MAX, isDevelopmentEnv, MENU_CODE } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import {
  cardLabels,
  changeProfileLabels,
  commonLabels,
  ctaLabels,
  signUpEnterEmailLabels as labels,
  menuLabels,
} from '@common/constants/labels';
import { notAllowNumberRegex, notAllowSpaceRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import useFocus from '@hooks/useFocus';
import useMove from '@hooks/useMove';
import { SignUpContext } from '@pages/SignUp';
import { routePaths } from '@routes/paths';
import clearEkycInfo from '@utilities/gmCommon/clearEkycInfo';
import clearTempLoginInfo from '@utilities/gmCommon/clearTempLoginInfo';
import { moveNext } from '@utilities/index';

import { EnterEmailSchema } from './schema';

const SignUpEnterEmail = ({ onNavigateEkycVerify, onNavigateMOTPAgreeTerms, onNavigateVerifyMember }) => {
  const { deviceId, ekycCached, setEkycToNativeCache, translate: t, isNavigateFromLogin } = useContext(SignUpContext);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState(initAlert);
  const [alreadySendEmailVerification, setAlreadySendEmailVerification] = useState(false);
  const [showEmailVerifyCode, setShowEmailVerifyCode] = useState(false);
  const [enabledVerifyCode, setEnabledVerifyCode] = useState(false);
  const [showUpdateEmailConfirmAlert, setShowUpdateEmailConfirmAlert] = useState(false);
  const { moveInitHomeNative } = useMove();
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
    if (alert.requiredLogin) {
      moveInitHomeNative('initHome');
    }
    setAlert(initAlert);
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
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoint, request);
    setShowLoading(false);
    if (!isSuccess) {
      return setAlert({
        isShow: true,
        title: '',
        content: error,
        requiredLogin,
      });
    }
    if (clearTimeOutRef.current) {
      clearTimeout(clearTimeOutRef.current);
    }
    verifyEmailFailedNumber.current = 0;
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
      setValue('isEmailVerified', true, { shouldValidate: true });
      clearErrors('verificationCode');
      requestUpdateEmail();
    }
  };
  const handleLogout = async () => {
    if (isDevelopmentEnv) {
      localStorage.removeItem('isLogin');
    }
    await requestApi(endpoints.logout);
  };

  const handleClickBack = async () => {
    if (isNavigateFromLogin) {
      clearEkycInfo();
      clearTempLoginInfo();
      await handleLogout();
      moveHomeNative();
    } else {
      onNavigateVerifyMember();
    }
  };

  const maskEmail = email => {
    return email.replace(/^(.)(.*)(@.*)$/, (match, firstChar, middle, domain) => {
      return `${firstChar}${'*'.repeat(middle.length)}${domain}`;
    });
  };

  const fetchEmailByCurrentUser = async () => {
    setShowLoading(true);
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.inquiryUserInformation);
    setShowLoading(false);
    if (isSuccess) {
      const { cus_email } = data;
      const maskedEmail = maskEmail(cus_email);
      setValue('email', cus_email, { shouldValidate: true });
      setValue('maskedEmail', maskedEmail);
    } else {
      setAlert({
        isShow: true,
        title: '',
        content: error,
        requiredLogin,
      });
    }
  };

  const handleShowUpdateEmailConfirmAlert = () => {
    setShowUpdateEmailConfirmAlert(true);
  };

  const handleCloseUpdateEmailConfirmAlert = () => {
    setShowUpdateEmailConfirmAlert(false);
  };

  const handleClearCacheLogin = async () => {
    setShowLoading(true);
    await requestApi(endpoints.logout);
    clearTempLoginInfo();
    setShowLoading(false);
  };

  const handleNavigateUpdateEmail = () => {
    moveNext(MENU_CODE.UPDATE_EMAIL, {}, routePaths.updateEmail);
  };

  const handleClickUpdateEmail = async () => {
    handleCloseUpdateEmailConfirmAlert();
    await handleClearCacheLogin();
    handleNavigateUpdateEmail();
  };

  useEffect(() => {
    if (isNavigateFromLogin) {
      fetchEmailByCurrentUser();
    }
  }, [isNavigateFromLogin]);

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
          title={isNavigateFromLogin ? t(menuLabels.security) : t(menuLabels.signUp)}
          disabledMoveBack
          onClickBack={handleClickBack}
        />
        <div className="page__form">
          <div className="page__title">{t(labels.enterYourEmail)}</div>
          <div className="form__section mt-4 flex-gap-y-12">
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.email)}
                  placeholder=""
                  type="text"
                  regex={notAllowSpaceRegex}
                  readOnly={enabledVerifyCode || isNavigateFromLogin}
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
              name={isNavigateFromLogin ? 'maskedEmail' : 'email'}
            />
            {showEmailVerifyCode && (
              <Controller
                render={({ field }) => (
                  <Input
                    label={t(labels.verificationCode)}
                    inputMode="numeric"
                    placeholder="6 digits"
                    type="text"
                    regex={notAllowNumberRegex}
                    remainingTime={EMAIL_VERIFY_IN_SECONDS}
                    onResetTimer={cb => (verifyTimerResetRef.current = cb)}
                    maxLength={6}
                    errorMessage={errors?.verificationCode?.message || ''}
                    readOnly={!enabledVerifyCode}
                    {...field}
                  />
                )}
                control={control}
                name="verificationCode"
              />
            )}
          </div>
          {isNavigateFromLogin && (
            <div className="mt-4 flex-center">
              <Button
                variant="text__gray"
                label={t(labels.unableToVerifyEmail)}
                size="sm"
                endIcon={<ArrowRight />}
                onClick={handleShowUpdateEmailConfirmAlert}
              />
            </div>
          )}
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
        isShowAlert={showUpdateEmailConfirmAlert}
        onClose={handleCloseUpdateEmailConfirmAlert}
        title={t(labels.unableToVerifyEmail2)}
        subtitle={t(labels.forSecurityReasons)}
        textAlign="left"
        firstButton={{
          onClick: handleClickUpdateEmail,
          label: t(labels.updateEmail),
        }}
        secondButton={{
          onClick: handleCloseUpdateEmailConfirmAlert,
          label: t(labels.cancel),
        }}
      />
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
