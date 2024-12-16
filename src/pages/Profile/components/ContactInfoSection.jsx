/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ViewDetailIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import { employmentValuesDisableOccupation } from '@common/constants/account';
import { EMAIL_VERIFY_IN_SECONDS, EMAIL_VERIFY_RETRY_MAX } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import { commonLabels, changeProfileLabels as labels } from '@common/constants/labels';
import { notAllowNumberRegex, notAllowSpaceRegex } from '@common/constants/regex';
import useApi from '@hooks/useApi';
import useFocus from '@hooks/useFocus';

import { changeProfileSchema } from '../schema';

const ContactInfoSection = ({
  onOpenSelectEmploymentBottom,
  employmentOptions,
  onOpenSelectOccupation1Bottom,
  occupation1Options,
  onOpenSelectOccupation2Bottom,
  occupation2Options,
  setShowLoading,
  setShowToast,
  setShowAlert,
  onClickViewAgreement,
  translate: t,
}) => {
  const {
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const { requestApi } = useApi();
  const { focusField } = useFocus();

  const [employment, verificationCode, email, isEmailVerified, idTypeDisplay] = watch([
    'employment',
    'verificationCode',
    'email',
    'isEmailVerified',
    'idTypeDisplay',
  ]);

  const [showEmailVerifyCode, setShowEmailVerifyCode] = useState(false);
  const [enabledVerifyCode, setEnabledVerifyCode] = useState(false);
  const [alreadySendEmailVerification, setAlreadySendEmailVerification] = useState(false);

  const verifyCodeSessionNumberRef = useRef(null);
  const clearTimeOutRef = useRef();
  const verifyEmailFailedNumber = useRef(0);

  const invalidVerificationCode = verificationCode?.length !== 6;
  const isDisabledOccupation = employmentValuesDisableOccupation.includes(employment);
  const verifyTimerResetRef = useRef(null);

  const handleRequestGetEmailVerifyCode = async () => {
    const emailSchema = changeProfileSchema.pick(['email']);
    const isEmailValid = emailSchema.isValidSync({ email });
    if (!isEmailValid) {
      setShowAlert({
        isShow: true,
        title: '',
        content: t(labels.checkYourEmail),
      });
      return;
    }
    setShowLoading(true);
    await requestApi(endpoints.inquiryUserInformation);
    const request = {
      cus_email: email,
    };
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.requestGetEmailVerifyCode, request);
    setShowLoading(false);
    if (!isSuccess) {
      return setShowAlert({
        isShow: true,
        title: '',
        content: error,
        requiredLogin,
      });
    }
    const resultCode = data?.cnt;
    const isDuplicatedEmail = resultCode === 9;
    const isEmailAvailable = resultCode === 0;
    if (isDuplicatedEmail) {
      return setShowAlert({
        isShow: true,
        title: '',
        content: t(labels.emailAlreadyUse),
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

      const { seqno, new_cus_email } = data || {};
      setValue('verifiedEmail', new_cus_email);
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
    const { data, error, isSuccess } = await requestApi(endpoints.sendEmailVerifyCode, request);
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
      setValue('isEmailVerified', true);
      clearErrors('verificationCode');
      setShowToast({
        isShow: true,
        message: t(labels.emailVerifyComplete),
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
    <div className="form__section">
      <div className="form__section__title">
        <span>{t(labels.contactInfo)}</span>
      </div>
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.name)}
            type="text"
            readOnly
            {...field}
          />
        )}
        control={control}
        name="name"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.dob)}
            type="text"
            readOnly
            {...field}
          />
        )}
        control={control}
        name="dobDisplay"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={idTypeDisplay || t(labels.sin)}
            type="text"
            readOnly
            {...field}
          />
        )}
        control={control}
        name="sin"
      />
      <InfoBox
        variant="notice"
        label={t(labels.contactBranch)}
        direction="middle"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.mailAddress)}
            type="text"
            maxLength={40}
            regex={notAllowSpaceRegex}
            helperText={isEmailVerified && !showEmailVerifyCode ? t(labels.youNeedToClick) : ''}
            disabled={enabledVerifyCode}
            {...field}
            endAdornment={
              <Button
                label={alreadySendEmailVerification ? t(labels.resend) : t(labels.send)}
                variant="outlined__primary"
                className="btn__send btn__sm"
                onClick={handleRequestGetEmailVerifyCode}
                disable={enabledVerifyCode}
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
              label={t(labels.verificationCode)}
              inputMode="numeric"
              type="text"
              regex={notAllowNumberRegex}
              remainingTime={EMAIL_VERIFY_IN_SECONDS}
              onResetTimer={cb => (verifyTimerResetRef.current = cb)}
              endAdornment={
                <Button
                  label={t(labels.verify)}
                  variant="outlined__primary"
                  className="btn__send btn__sm"
                  disable={invalidVerificationCode || !enabledVerifyCode}
                  onClick={handleSendEmailVerifyCode}
                />
              }
              maxLength={6}
              errorMessage={errors?.verificationCode?.message || ''}
              helperText={t(labels.clickSaveButton)}
              disabled={!enabledVerifyCode}
              {...field}
            />
          )}
          control={control}
          name="verificationCode"
        />
      )}
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.callNumber)}
            inputMode="numeric"
            type="text"
            regex={notAllowNumberRegex}
            maxLength={30}
            {...field}
          />
        )}
        control={control}
        name="callNumber"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label={t(labels.employment)}
            onFocus={onOpenSelectEmploymentBottom}
            options={employmentOptions}
            {...field}
          />
        )}
        control={control}
        name="employment"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label={t(labels.occupation1)}
            onFocus={onOpenSelectOccupation1Bottom}
            options={occupation1Options}
            disabled={isDisabledOccupation}
            {...field}
          />
        )}
        control={control}
        name="occupation1"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label={t(labels.occupation2)}
            onFocus={onOpenSelectOccupation2Bottom}
            options={occupation2Options}
            disabled={isDisabledOccupation}
            {...field}
          />
        )}
        control={control}
        name="occupation2"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.occupation3)}
            maxLength={100}
            {...field}
          />
        )}
        control={control}
        name="occupation3"
      />
      <div
        className="agreement__download"
        onClick={onClickViewAgreement}
      >
        <span>{t(labels.electronicAgree)}</span>
        <ViewDetailIcon />
      </div>
    </div>
  );
};

export default ContactInfoSection;
