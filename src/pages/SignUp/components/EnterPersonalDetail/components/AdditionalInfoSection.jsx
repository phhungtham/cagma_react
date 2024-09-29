import { Controller, useFormContext } from 'react-hook-form';

import CheckBox from '@common/components/atoms/Checkbox';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';

const AdditionalInfoSection = () => {
  const { control, watch, setValue } = useFormContext();

  return (
    <div className="form__section">
      <div className="form__section__title">Additional Information</div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label="Nationality"
            {...field}
          />
        )}
        control={control}
        name="nationality"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label="Residential Status"
            {...field}
          />
        )}
        control={control}
        name="residentialStatus"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="SIN Number"
            helperText="Your SIN will be used only for account opening."
            {...field}
          />
        )}
        control={control}
        name="sin"
      />
      <Controller
        render={({ field }) => (
          <CheckBox
            size="large"
            label="I don’t have the SIN Number"
            {...field}
            checked={field.value}
          />
        )}
        control={control}
        name="alreadySin"
      />
    </div>
  );
};

export default AdditionalInfoSection;
