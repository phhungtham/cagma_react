/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Input from '@common/components/atoms/Input/Input';
import { signUpEnterPersonalLabels as labels } from '@common/constants/labels';
import { notAllowNumberRegex } from '@common/constants/regex';
import { SignUpContext } from '@pages/SignUp';

const ContactInfoSection = () => {
  const { existingCustomer, translate: t } = useContext(SignUpContext);
  const { control, watch, setValue } = useFormContext();

  return (
    <div className="form__section flex-gap-y-12">
      <div className="form__section__title">{t(labels.contactInfo)}</div>
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.cellNumber)}
            maxLength={30}
            inputMode="numeric"
            type="text"
            regex={notAllowNumberRegex}
            {...field}
          />
        )}
        control={control}
        name="cellNumber"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.emailAddress)}
            disabled={!!existingCustomer}
            maxLength={40}
            {...field}
          />
        )}
        control={control}
        name="emailAddress"
      />
    </div>
  );
};

export default ContactInfoSection;
