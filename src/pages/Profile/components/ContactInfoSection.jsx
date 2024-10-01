import { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ViewDetailIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import { EMAIL_VERIFY_IN_SECONDS, EMAIL_VERIFY_RETRY_MAX } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import { notAllowNumberRegex } from '@common/constants/regex';
import { apiCall } from '@shared/api';

import { employmentValuesDisableOccupation } from '../constants';
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
}) => {
  const {
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [employment, verificationCode, email, isEmailVerified] = watch([
    'employment',
    'verificationCode',
    'email',
    'isEmailVerified',
  ]);

  const [showEmailVerifyCode, setShowEmailVerifyCode] = useState(false);
  const [disabledVerifyButton, setDisabledVerifyButton] = useState(false);
  const [alreadySendEmailVerification, setAlreadySendEmailVerification] = useState(false);
  //TODO: Handle use ref for call reset timer of child component

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
        content: 'Please check Your E-mail',
      });
      return;
    }
    setShowLoading(true);
    //TODO: Check we should call this API before calling send email verification
    await apiCall(endpoints.inquiryUserInformation, 'POST');
    const request = {
      cus_email: email,
    };
    const requestVerifyResponse = await apiCall(endpoints.requestGetEmailVerifyCode, 'POST', request);
    setShowLoading(false);
    const headerResponse = requestVerifyResponse?.data?.elHeader || {};
    if (!headerResponse.resSuc) {
      return setShowAlert({
        isShow: true,
        title: 'Sorry!',
        content: headerResponse.resMsg || 'Internal server error',
      });
    }
    const responseData = requestVerifyResponse?.data?.elData;
    const resultCode = responseData?.cnt;
    const isDuplicatedEmail = resultCode === 9;
    const isEmailAvailable = resultCode === 0;
    if (isDuplicatedEmail) {
      return setShowAlert({
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
      setValue('isEmailVerified', false);
      setDisabledVerifyButton(false);

      if (verifyTimerResetRef.current) verifyTimerResetRef.current();

      const { seqno, new_cus_email } = responseData || {};
      setValue('verifiedEmail', new_cus_email);
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

  const handleSendEmailVerifyCode = async () => {
    setShowLoading(true);
    const request = {
      cert_no: verificationCode,
      seqno: verifyCodeSessionNumberRef.current,
    };
    const verifyResponse = await apiCall(endpoints.sendEmailVerifyCode, 'POST', request);
    const responseData = verifyResponse?.data?.elData;
    const resultCode = String(responseData?.result_cd || '');
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
      setValue('isEmailVerified', true);
      clearErrors('verificationCode');
      setShowToast({
        isShow: true,
        message: 'Email verification is complete.',
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
        <span>Contact Information</span>
      </div>
      <Controller
        render={({ field }) => (
          <Input
            label="Name"
            type="text"
            disabled
            {...field}
          />
        )}
        control={control}
        name="name"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="Date of Birth"
            type="text"
            disabled
            {...field}
          />
        )}
        control={control}
        name="dobDisplay"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="SIN"
            type="text"
            disabled
            {...field}
          />
        )}
        control={control}
        name="sin"
      />
      <InfoBox
        variant="notice"
        label="If there are DTR changes, contact branch"
        direction="middle"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="E-mail Address"
            type="text"
            maxLength={40}
            helperText={
              isEmailVerified && !showEmailVerifyCode
                ? 'You need to click the Save button after making changes to apply them.'
                : ''
            }
            {...field}
            endAdornment={
              <Button
                label={alreadySendEmailVerification ? 'Resend' : 'Send'}
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
              onResetTimer={cb => (verifyTimerResetRef.current = cb)}
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
              helperText="You need to click the Save button after making changes to apply them."
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
            label="Call Number"
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
            label="Employment"
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
            label="Occupation1"
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
            label="Occupation2"
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
            label="Occupation3"
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
        <span>Electronic Communication Agreement</span>
        <ViewDetailIcon />
      </div>
    </div>
  );
};

export default ContactInfoSection;
