import { Controller, useFormContext } from 'react-hook-form';

import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';

import { CommonCodeFieldName, SignUpSelectType } from '../../constants';

const IDInfoSection = ({ onOpenSelectBottom, commonCode }) => {
  const { control, watch, setValue } = useFormContext();

  return (
    <div className="form__section">
      <div className="form__section__title">ID Information</div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label="Title"
            onFocus={() => onOpenSelectBottom(SignUpSelectType.TITLE)}
            options={commonCode[CommonCodeFieldName.TITLE]}
            {...field}
          />
        )}
        control={control}
        name="title"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="First Name"
            disabled
            {...field}
          />
        )}
        control={control}
        name="firstName"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="Middle name (Optional)"
            {...field}
          />
        )}
        control={control}
        name="middleName"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="Last Name"
            disabled
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
            disabled
            value={value}
          />
        )}
        control={control}
        name="dob_display"
      />
    </div>
  );
};

export default IDInfoSection;
