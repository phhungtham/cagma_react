import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { yupResolver } from '@hookform/resolvers/yup';
import { moveBack } from '@utilities/index';

import { reportLostCardInfoSchema } from './schema';

const EMAIL_VERIFY_IN_SECONDS = 180;

const EnterReportLostCardInfo = ({ onSubmit, isLogin }) => {
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
    mode: 'onChange',
    resolver: yupResolver(reportLostCardInfoSchema),
  });

  const [verificationCode] = watch(['verificationCode']);
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

  return (
    <>
      <Header
        title="Access Card Service"
        onClick={moveBack}
      />
      <div className="page__form">
        <h1 className="page__title">Report a Lost Access Card</h1>
        <div className="report-lost-card-info__form mt-4">
          <div className="form__section">
            <Controller
              render={({ field }) => (
                <Input
                  label="Current Card Number"
                  placeholder="Please input 16 numerics"
                  type="number"
                  helperText="To get started, please enter your current 16-digit Access Card number."
                  maxLength={16}
                  {...field}
                />
              )}
              control={control}
              name="cardNumber"
            />
            <Controller
              render={({ field: { value, onChange } }) => {
                return (
                  <Input
                    label="Expiry Date(MMYY)"
                    placeholder="Enter MM/YY"
                    type="text"
                    maxLength={5}
                    value={value}
                    pattern="\d{2}/\d{2}"
                    inputMode="numeric"
                    onChange={inputValue => {
                      let valueEmptySlash = inputValue;
                      //Handle case delete slash
                      if (valueEmptySlash.length === 2 && value.length === 3) {
                        valueEmptySlash = valueEmptySlash.substring(0, 1);
                      } else if (valueEmptySlash.length >= 2) {
                        valueEmptySlash = inputValue.replace(/\D/g, '');
                        valueEmptySlash = `${valueEmptySlash.substring(0, 2)}/${valueEmptySlash.substring(2, 4)}`;
                      }

                      onChange(valueEmptySlash);
                    }}
                  />
                );
              }}
              control={control}
              name="expiryDate"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label="Email Address"
                  type="text"
                  placeholder="6 digits"
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

export default EnterReportLostCardInfo;
