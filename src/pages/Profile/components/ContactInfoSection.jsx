import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ViewDetailIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import { endpoints } from '@common/constants/endpoint';
import { notAllowNumberRegex } from '@common/constants/regex';
import { apiCall } from '@shared/api';

import { EMAIL_VERIFY_IN_SECONDS, EMAIL_VERIFY_RETRY_MAX, employmentValuesDisableOccupation } from '../constants';

const ContactInfoSection = ({
  onOpenSelectEmploymentBottom,
  employmentOptions,
  onOpenSelectOccupation1Bottom,
  occupation1Options,
  onOpenSelectOccupation2Bottom,
  occupation2Options,
  setShowLoading,
  setShowToast,
  onClickViewAgreement,
}) => {
  const {
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useFormContext();

  //TODO: Hanle 3 minutes

  const [employment, verificationCode, email] = watch(['employment', 'verificationCode', 'email']);

  const [showEmailVerifyCode, setShowEmailVerifyCode] = useState(false);
  const [showEmailVerifyInfo, setShowEmailVerifyInfo] = useState(false);
  const [disabledVerifyButton, setDisabledVerifyButton] = useState(false);
  const [alreadySendEmailVerification, setAlreadySendEmailVerification] = useState(false);
  const clearTimeOutRef = useRef();

  const verifyEmailFailedNumber = useRef(0);

  const invalidVerificationCode = verificationCode?.length !== 6;
  const isDisabledOccupation = employmentValuesDisableOccupation.includes(employment);

  const verifyCodeSessionNumberRef = useRef(null);

  console.log('verifyCodeSessionNumberRef.current :>> ', verifyCodeSessionNumberRef.current);

  const handleRequestGetEmailVerifyCode = async () => {
    if (errors.email) {
      return;
    }
    setShowLoading(true);
    await apiCall(endpoints.inquiryUserInformation, 'POST');
    const request = {
      cus_email: email,
    };
    const requestVerifyResponse = await apiCall(endpoints.requestGetEmailVerifyCode, 'POST', request);
    const responseData = requestVerifyResponse?.data?.elData;
    const resultCode = responseData?.cnt;
    const isDuplicatedEmail = resultCode === 9;
    const isEmailAvailable = resultCode === 0;
    setShowLoading(false);
    if (isDuplicatedEmail) {
      //TODO: Show Error
      return;
    }

    if (isEmailAvailable) {
      const { seqno, new_cus_email } = responseData || {};
      setValue('verifiedEmail', new_cus_email);
      verifyCodeSessionNumberRef.current = seqno;
      //TODO: Handle clear time out when submit or failed 5 times.
      //TODO: Focus to verify code input when clicking send button
      //TODO: Handle reset update timeout for layout verification
      clearTimeOutRef.current = setTimeout(() => {
        setError('verificationCode', {
          type: 'timeout',
          message: 'Verification code has timed out. Resend E-mail and try again.',
        });
        setDisabledVerifyButton(true);
      }, EMAIL_VERIFY_IN_SECONDS * 1000);
      setShowEmailVerifyCode(true);
      setShowEmailVerifyInfo(true);
      if (!alreadySendEmailVerification) {
        setAlreadySendEmailVerification(true);
      }
    }
  };

  const handleSendEmailVerifyCode = async () => {
    setShowLoading(true);
    // await apiCall(endpoints.inquiryUserInformation, 'POST');
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
          message: 'You’ve entered the wrong code %1 times. Resend E-mail and try again.',
        });
        setDisabledVerifyButton(true);
      } else {
        setError('verificationCode', {
          type: 'wrong',
          message: `You’ve entered the wrong code. (${verifyEmailFailedNumber.current}/5)`,
        });
      }

      return;
    }

    if (isVerifySuccess) {
      setShowEmailVerifyCode(false);
      setValue('isEmailVerified', true);
      setShowToast({
        isShow: true,
        message: 'Email verification is complete.',
        type: 'success',
      });
    }
  };

  return (
    <div className="form__section">
      <div className="form__section__title">
        <span>Contact Information</span>
      </div>
      <Controller
        render={({ field }) => (
          <Input
            label={'Name'}
            type={'text'}
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
            label={'Date of Birth'}
            type={'text'}
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
            label={'SIN'}
            type={'text'}
            disabled
            {...field}
          />
        )}
        control={control}
        name="sin"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={'E-mail address'}
            type={'text'}
            endAdornment={
              <Button
                label={alreadySendEmailVerification ? 'Resend' : 'Send'}
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
              type={'text'}
              remainingTime={EMAIL_VERIFY_IN_SECONDS}
              endAdornment={
                <Button
                  label="Verify"
                  variant="outlined__primary"
                  className="btn__send btn__sm"
                  disable={invalidVerificationCode || disabledVerifyButton}
                  onClick={handleSendEmailVerifyCode}
                />
              }
              regex={notAllowNumberRegex}
              maxLength={6}
              errorMessage={errors?.verificationCode?.message || ''}
              {...field}
            />
          )}
          control={control}
          name="verificationCode"
        />
      )}
      {showEmailVerifyInfo && (
        <InfoBox
          variant="notice"
          label="You need to click the Save button after making changes to apply them."
        />
      )}

      <Controller
        render={({ field }) => (
          <Input
            label={'Call Number'}
            type={'text'}
            {...field}
          />
        )}
        control={control}
        name="callNumber"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label={'Employment'}
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
            label={'Occupation1'}
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
            label={'Occupation2'}
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
            label={'Occupation3'}
            {...field}
          />
        )}
        control={control}
        name="occupation3"
      />
      <div className="agreement__download">
        <span>Electronic Communication Agreement</span>
        <ViewDetailIcon />
      </div>
    </div>
  );
};

export default ContactInfoSection;
