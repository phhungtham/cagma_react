/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Input from '@common/components/atoms/Input/Input';
import { signUpEnterPersonalLabels as labels } from '@common/constants/labels';
import { SignUpContext } from '@pages/SignUp';

const ContactInfoSection = () => {
  const { existingCustomer, translate: t } = useContext(SignUpContext);
  const { control, watch, setValue } = useFormContext();

  return (
    <div className="form__section">
      <div className="form__section__title">{t(labels.contactInfo)}</div>
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.cellNumber)}
            maxLength={30}
            type="number"
            inputMode="numeric"
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
