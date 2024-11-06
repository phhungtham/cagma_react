import { Controller, useFormContext } from 'react-hook-form';

import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import { employmentValuesDisableOccupation } from '@common/constants/account';

import { CommonCodeFieldName, SignUpSelectType } from '../../constants';

const EmploymentInfoSection = ({ onOpenSelectBottom, commonCode, occupation2Options }) => {
  const { control, watch, setValue } = useFormContext();
  const [employmentStatus] = watch(['employmentStatus']);
  const isDisabledOccupation = employmentValuesDisableOccupation.includes(employmentStatus);

  return (
    <div className="form__section">
      <div className="form__section__title">Employment Information</div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label="Employment Status"
            onFocus={() => onOpenSelectBottom(SignUpSelectType.EMPLOYMENT_STATUS)}
            options={commonCode[CommonCodeFieldName.EMPLOYMENT_STATUS]}
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
            disabled={isDisabledOccupation}
            onFocus={() => onOpenSelectBottom(SignUpSelectType.JOB)}
            options={commonCode[CommonCodeFieldName.JOB]}
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
            disabled={isDisabledOccupation}
            onFocus={() => onOpenSelectBottom(SignUpSelectType.SUB_JOB)}
            options={occupation2Options}
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
