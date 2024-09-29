import { Controller, useFormContext } from 'react-hook-form';

import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import { isDevelopmentEnv } from '@common/constants/common';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';

const IDInfoSection = () => {
  const { control, watch, setValue } = useFormContext();

  const [dob] = watch(['dob']);

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

  return (
    <div className="form__section">
      <div className="form__section__title">ID Information</div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label="Title"
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
