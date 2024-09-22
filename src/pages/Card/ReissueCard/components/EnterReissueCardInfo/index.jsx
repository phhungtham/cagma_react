import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Header from '@common/components/organisms/Header';
import { isDevelopmentEnv } from '@common/constants/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import { moveBack } from '@utilities/index';

import { reissueCardFormSchema } from './schema';
import './styles.scss';

const EMAIL_VERIFY_IN_SECONDS = 180;

const EnterReissueCardInfo = ({ onSubmit, isLogin }) => {
  const [alreadySendEmailVerification, setAlreadySendEmailVerification] = useState(false);
  const [showEmailVerifyCode, setShowEmailVerifyCode] = useState(false);
  const [disabledVerifyButton, setDisabledVerifyButton] = useState(false);
  const clearTimeOutRef = useRef();

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(reissueCardFormSchema),
  });

  const [dob, verificationCode] = watch(['dob', 'verificationCode']);
  const invalidVerificationCode = verificationCode?.length !== 6;

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
        title="Cards"
        onClick={moveBack}
      />
      <div className="page__form reissue-card-info__form">
        <h1 className="page__title">Reissue your Access Card</h1>
        <div className="mt-4">
          <div className="form__section">
            {isLogin && (
              <InfoBox
                variant="informative"
                label="To get started, please enter your name and your current 16-digit Access Card number."
              />
            )}

            <Controller
              render={({ field }) => (
                <Input
                  label="Current Card Number"
                  placeholder="Please input 16 numerics"
                  type="number"
                  maxLength={16}
                  helperText={isLogin ? '' : 'To get started, please enter your current 16-digit Access Card number.'}
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
            {!isLogin && (
              <>
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
              </>
            )}
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

export default EnterReissueCardInfo;
