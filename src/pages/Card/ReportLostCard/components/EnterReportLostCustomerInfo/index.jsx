import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';
import Header from '@common/components/organisms/Header';
import { CustomerTypes } from '@common/constants/account';
import { isDevelopmentEnv } from '@common/constants/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerTypeOptions } from '@pages/Card/constants';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import { moveBack } from '@utilities/index';

import { reportLostCardCustomerInfoSchema } from './schema';

const EMAIL_VERIFY_IN_SECONDS = 180;

const EnterReportLostCustomerInfo = ({ onSubmit, isLogin }) => {
  const [alreadySendEmailVerification, setAlreadySendEmailVerification] = useState(false);
  const [showEmailVerifyCode, setShowEmailVerifyCode] = useState(false);
  const [disabledVerifyButton, setDisabledVerifyButton] = useState(false);
  const clearTimeOutRef = useRef();

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      customerType: CustomerTypes.PERSONAL,
    },
    mode: 'onChange',
    resolver: yupResolver(reportLostCardCustomerInfoSchema),
  });

  const [verificationCode, customerType] = watch(['verificationCode', 'customerType']);
  const invalidVerificationCode = verificationCode?.length !== 6;

  const handleRequestGetEmailVerifyCode = async () => {
    if (errors.email) {
      return;
    }
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
    if (!alreadySendEmailVerification) {
      setAlreadySendEmailVerification(true);
    }
  };

  const handleSendEmailVerifyCode = async () => {
    // setShowLoading(true);
    // // await apiCall(endpoints.inquiryUserInformation, 'POST');
    // const request = {
    //   cert_no: verificationCode,
    //   seqno: verifyCodeSessionNumberRef.current,
    // };
    // const verifyResponse = await apiCall(endpoints.sendEmailVerifyCode, 'POST', request);
    // const responseData = verifyResponse?.data?.elData;
    // const resultCode = String(responseData?.result_cd || '');
    // const isVerifyFailed = resultCode === '9';
    // const isVerifySuccess = resultCode === '1';
    // setShowLoading(false);
    // if (isVerifyFailed) {
    //   verifyEmailFailedNumber.current += 1;
    //   if (verifyEmailFailedNumber.current === EMAIL_VERIFY_RETRY_MAX) {
    //     setError('verificationCode', {
    //       type: 'wrong',
    //       message: 'You’ve entered the wrong code %1 times. Resend E-mail and try again.',
    //     });
    //     setDisabledVerifyButton(true);
    //   } else {
    //     setError('verificationCode', {
    //       type: 'wrong',
    //       message: `You’ve entered the wrong code. (${verifyEmailFailedNumber.current}/5)`,
    //     });
    //   }
    //   return;
    // }
    // if (isVerifySuccess) {
    //   setShowEmailVerifyCode(false);
    //   setValue('isEmailVerified', true);
    //   setShowToast({
    //     isShow: true,
    //     message: 'Email verification is complete.',
    //     type: 'success',
    //   });
    // }
  };

  const [dob] = watch(['dob']);

  const handleSelectDate = selectedDate => {
    if (selectedDate) {
      setValue('dob', selectedDate, { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay(selectedDate), { shouldValidate: true });
    }
  };

  const handleOpenCalendar = () => {
    if (isDevelopmentEnv) {
      //For dummy data because it call native calendar
      setValue('dob', '19980523', { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay('19980523'), { shouldValidate: true });
    }
    openCalendar(handleSelectDate, { selectDate: dob || undefined });
  };

  return (
    <>
      <Header
        title="Access Card Service"
        onClick={moveBack}
      />
      <div className="page__form">
        <h1 className="page__title">Report a Lost Access Card</h1>
        <div className="report-lost-card-info__form py-4 mt-4">
          <div className="form__section">
            <div className="form__label">Customer types</div>
            <Controller
              render={({ field }) => (
                <BoxRadio
                  options={customerTypeOptions}
                  {...field}
                />
              )}
              control={control}
              name="customerType"
            />
            {customerType === CustomerTypes.PERSONAL ? (
              <>
                <Controller
                  render={({ field }) => (
                    <Input
                      label="First Name"
                      placeholder="Please input Detail text"
                      {...field}
                    />
                  )}
                  control={control}
                  name="firstName"
                />
                <Controller
                  render={({ field }) => (
                    <Input
                      label="Last Name"
                      placeholder="Please input Detail text"
                      {...field}
                    />
                  )}
                  control={control}
                  name="lastName"
                />
                <Controller
                  render={({ field: { value } }) => (
                    <InputDate
                      label="Date of Birth"
                      onFocus={handleOpenCalendar}
                      value={value}
                    />
                  )}
                  control={control}
                  name="dob_display"
                />
              </>
            ) : (
              <>
                <Controller
                  render={({ field }) => (
                    <Input
                      label="Corporate Account Number"
                      type="number"
                      placeholder="Please input 12 numerics"
                      {...field}
                    />
                  )}
                  control={control}
                  name="companyAcNo"
                />
              </>
            )}

            <Controller
              render={({ field }) => (
                <Input
                  label="Phone Number"
                  placeholder="Please include the '-'."
                  {...field}
                />
              )}
              control={control}
              name="phoneNumber"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label="Postal Code"
                  placeholder="Please input 6 numerics"
                  type="number"
                  maxLength={6}
                  {...field}
                />
              )}
              control={control}
              name="postalCode"
            />
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
            <InfoBox
              variant="informative"
              label="Please verify the email address registered with the bank."
            />
            <Controller
              render={({ field }) => (
                <Input
                  label="Detail of Accident"
                  placeholder="Please input Detail text"
                  {...field}
                />
              )}
              control={control}
              name="accident"
            />
          </div>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label="Next"
          variant="filled__primary"
          className="btn__cta"
          onClick={handleSubmit(onSubmit)}
          disable={!isValid}
        />
      </div>
    </>
  );
};

export default EnterReportLostCustomerInfo;
