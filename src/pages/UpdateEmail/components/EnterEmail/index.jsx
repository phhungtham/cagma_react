/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { EMAIL_VERIFY_IN_SECONDS, EMAIL_VERIFY_RETRY_MAX } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import { changeProfileLabels, commonLabels, updateEmailLabels as labels, menuLabels } from '@common/constants/labels';
import { notAllowNumberRegex, notAllowSpaceRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import useFocus from '@hooks/useFocus';
import { UpdateEmailContext } from '@pages/UpdateEmail';

import { EnterEmailSchema } from './schema';

const EnterEmail = ({ onNavigateEnterId, onConfirm }) => {
  const { translate: t, setShowLoading, setAlert } = useContext(UpdateEmailContext);
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
  const clearTimeOutRef = useRef();
  const verifyTimerResetRef = useRef(null);
  const verifyCodeSessionNumberRef = useRef(null);
  const verifyEmailFailedNumber = useRef(0);
  const { focusField } = useFocus();

  const [verificationCode, email] = watch(['verificationCode', 'email']);

  const invalidVerificationCode = verificationCode?.length !== 6;

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
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.requestGetEmailVerifyCode, request);
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
      onConfirm(email);
    }
  };

  const handleClickBack = () => {
    onNavigateEnterId();
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
        <Header
          title={t(menuLabels.manageLogin)}
          disabledMoveBack
          onClickBack={handleClickBack}
        />
        <div className="page__form">
          <div className="page__title">{t(labels.updateYourEmail)}</div>
          <div className="form__section mt-4 flex-gap-y-12">
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.email)}
                  type="text"
                  regex={notAllowSpaceRegex}
                  readOnly={enabledVerifyCode}
                  endAdornment={
                    <Button
                      label={alreadySendEmailVerification ? t(labels.resend) : t(labels.request)}
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
                    inputMode="numeric"
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
        </div>
        <div className="footer__fixed">
          <Button
            label={t(labels.next2)}
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSendEmailVerifyCode}
            disable={invalidVerificationCode || !enabledVerifyCode}
          />
        </div>
      </div>
    </>
  );
};

export default EnterEmail;
