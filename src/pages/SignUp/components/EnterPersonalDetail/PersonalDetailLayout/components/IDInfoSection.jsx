import { useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import { SignUpContext } from '@pages/SignUp';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';

import { CommonCodeFieldName, SignUpSelectType } from '../../constants';

const IDInfoSection = ({ onOpenSelectBottom, commonCode }) => {
  const { existingCustomer } = useContext(SignUpContext);
  const { control, watch, setValue } = useFormContext();

  const [dob] = watch(['dob']);

  const handleSelectDate = selectedDate => {
    if (selectedDate) {
      setValue('dob', selectedDate, { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay(selectedDate), { shouldValidate: true });
    }
  };

  const handleOpenCalendar = () => {
    openCalendar(handleSelectDate, { selectDate: dob || undefined });
  };

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
            disabled={!!existingCustomer}
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
            disabled={!!existingCustomer}
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
            disabled={!!existingCustomer}
            onFocus={handleOpenCalendar}
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
