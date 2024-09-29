import { Controller, useFormContext } from 'react-hook-form';

import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';

const EmploymentInfoSection = () => {
  const { control, watch, setValue } = useFormContext();

  return (
    <div className="form__section">
      <div className="form__section__title">Employment Information</div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label="Employment Status"
            {...field}
          />
        )}
        control={control}
        name="employmentStatus"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label="Occupation1"
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
            {...field}
          />
        )}
        control={control}
        name="occupation3"
      />
    </div>
  );
};

export default EmploymentInfoSection;
