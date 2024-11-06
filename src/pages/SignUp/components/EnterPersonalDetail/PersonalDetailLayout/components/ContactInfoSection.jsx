import { Controller, useFormContext } from 'react-hook-form';

import Input from '@common/components/atoms/Input/Input';

const ContactInfoSection = () => {
  const { control, watch, setValue } = useFormContext();

  return (
    <div className="form__section">
      <div className="form__section__title">Contact Information</div>
      <Controller
        render={({ field }) => (
          <Input
            label="Cell Number"
            {...field}
          />
        )}
        control={control}
        name="cellNumber"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="E-mail Address"
            disabled
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
