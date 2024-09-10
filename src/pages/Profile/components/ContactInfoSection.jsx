import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ViewDetailIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import { endpoints } from '@common/constants/endpoint';
import { notAllowNumberRegex } from '@common/constants/regex';
import { apiCall } from '@shared/api';

import { EMAIL_VERIFY_IN_SECONDS, employmentValuesDisableOccupation } from '../constants';

const ContactInfoSection = ({
  onOpenSelectEmploymentBottom,
  employmentOptions,
  onOpenSelectOccupation1Bottom,
  occupation1Options,
  onOpenSelectOccupation2Bottom,
  occupation2Options,
  onShowLoading,
  onCloseLoading,
}) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  //TODO: Hanle 3 minutes

  const [employment, verificationCode, email] = watch(['employment', 'verificationCode', 'email']);

  const [isShowEmailVerifyCode, setIsShowEmailVerifyCode] = useState(false);

  const invalidVerificationCode = verificationCode?.length !== 6;
  const isDisabledOccupation = employmentValuesDisableOccupation.includes(employment);

  const handleSendEmailVerifyCode = async () => {
    if (!errors.email) {
      onShowLoading();
      const request = {
        cus_email: email,
      };
      const requestVerifyResponse = await apiCall(endpoints.requestEmailVerification, 'POST', request);
      onCloseLoading();
      console.log('requestVerifyResponse :>> ', requestVerifyResponse);
      setIsShowEmailVerifyCode(true);
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
                label="Send"
                variant="outlined__primary"
                className="btn__send btn__sm"
                onClick={handleSendEmailVerifyCode}
              />
            }
            {...field}
          />
        )}
        control={control}
        name="email"
      />
      {isShowEmailVerifyCode && (
        <>
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
                    disable={invalidVerificationCode}
                  />
                }
                regex={notAllowNumberRegex}
                maxLength={6}
                {...field}
              />
            )}
            control={control}
            name="verificationCode"
          />
          <InfoBox
            variant="notice"
            label="You need to click the Save button after making changes to apply them."
          />
        </>
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
