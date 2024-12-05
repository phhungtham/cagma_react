import { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { EMAIL_VERIFY_IN_SECONDS, EMAIL_VERIFY_RETRY_MAX } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import { cardLabels, changeProfileLabels, commonLabels } from '@common/constants/labels';
import { notAllowNumberRegex, notAllowSpaceRegex } from '@common/constants/regex';
import useApi from '@hooks/useApi';
import useFocus from '@hooks/useFocus';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import { Button } from '../ButtonGroup/Button/Button';
import Input from '../Input/Input';

const EmailVerifyControl = ({ schema, setAlert, setShowLoading, setShowToast, translate: t }) => {
  const [alreadySendEmailVerification, setAlreadySendEmailVerification] = useState(false);
  const [enabledVerifyCode, setEnabledVerifyCode] = useState(false);
  const [showEmailVerifyCode, setShowEmailVerifyCode] = useState(false);
  const {
    control,
    setValue,
    clearErrors,
    watch,
    setError,
    formState: { errors },
  } = useFormContext();
  const { requestApi } = useApi();
  const clearTimeOutRef = useRef();
  const verifyTimerResetRef = useRef(null);
  const verifyCodeSessionNumberRef = useRef(null);
  const verifyEmailFailedNumber = useRef(0);
  const { focusField } = useFocus();

  const [verificationCode, email] = watch(['verificationCode', 'email']);
  const invalidVerificationCode = verificationCode?.length !== 6;

  const handleRequestGetEmailVerifyCode = async () => {
    const emailSchema = schema.pick(['email']);
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
    const { data, error, isSuccess } = await requestApi(endpoints.requestGetEmailVerifyCode, request);
    setShowLoading(false);
    if (!isSuccess) {
      return setAlert({
        isShow: true,
        title: '',
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
        content: t(changeProfileLabels.emailAlreadyUse),
      });
    }

    if (isEmailAvailable) {
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
    }

    if (isVerifySuccess) {
      setShowEmailVerifyCode(false);
      setEnabledVerifyCode(false);
      setValue('isEmailVerified', true, { shouldValidate: true });
      clearErrors('verificationCode');
      setShowToast({
        isShow: true,
        message: t(changeProfileLabels.emailVerifyComplete),
        type: 'success',
      });
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
      <Controller
        render={({ field }) => (
          <Input
            label={t(cardLabels.emailAddress2)}
            placeholder="emailname@email.com"
            type="text"
            regex={notAllowSpaceRegex}
            disabled={enabledVerifyCode}
            maxLength={64}
            endAdornment={
              <Button
                label={alreadySendEmailVerification ? t(cardLabels.resend) : t(cardLabels.request)}
                variant="outlined__primary"
                className="btn__send btn__sm"
                onClick={handleRequestGetEmailVerifyCode}
                disable={enabledVerifyCode}
              />
            }
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
              label={t(cardLabels.verificationCode)}
              inputMode="numeric"
              placeholder="6 digits"
              type="text"
              regex={notAllowNumberRegex}
              remainingTime={EMAIL_VERIFY_IN_SECONDS}
              onResetTimer={cb => (verifyTimerResetRef.current = cb)}
              maxLength={6}
              errorMessage={errors?.verificationCode?.message || ''}
              disabled={!enabledVerifyCode}
              endAdornment={
                <Button
                  label={t(cardLabels.verify)}
                  variant="outlined__primary"
                  className="btn__send btn__sm"
                  disable={invalidVerificationCode || !enabledVerifyCode}
                  onClick={handleSendEmailVerifyCode}
                />
              }
              {...field}
            />
          )}
          control={control}
          name="verificationCode"
        />
      )}
    </>
  );
};

export default withHTMLParseI18n(EmailVerifyControl);
