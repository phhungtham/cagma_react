import { useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import { signUpEnterPersonalLabels as labels } from '@common/constants/labels';
import { notAllowNumberAlphabetRegex } from '@common/constants/regex';
import { SignUpContext } from '@pages/SignUp';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import dayjs from 'dayjs';

import { CommonCodeFieldName, SignUpSelectType } from '../../constants';

const IDInfoSection = ({ onOpenSelectBottom, commonCode }) => {
  const { existingCustomer, translate: t } = useContext(SignUpContext);
  const { control, watch, setValue } = useFormContext();

  const [dob] = watch(['dob']);

  const handleSelectDate = selectedDate => {
    if (selectedDate) {
      setValue('dob', selectedDate, { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay(selectedDate), { shouldValidate: true });
    }
  };

  const handleOpenCalendar = () => {
    const maxDate = dayjs().subtract('1', 'day').format('YYYYMMDD');
    openCalendar(handleSelectDate, { selectDate: dob || undefined, endDate: maxDate });
  };

  return (
    <div className="form__section">
      <div className="form__section__title">{t(labels.idInformation)}</div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label={t(labels.title)}
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
            label={t(labels.firstName)}
            disabled={!!existingCustomer}
            regex={notAllowNumberAlphabetRegex}
            maxLength={20}
            {...field}
          />
        )}
        control={control}
        name="firstName"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.middleName)}
            maxLength={60}
            regex={notAllowNumberAlphabetRegex}
            {...field}
          />
        )}
        control={control}
        name="middleName"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.lastName)}
            disabled={!!existingCustomer}
            regex={notAllowNumberAlphabetRegex}
            maxLength={20}
            {...field}
          />
        )}
        control={control}
        name="lastName"
      />
      <Controller
        render={({ field: { value } }) => (
          <InputDate
            label={t(labels.dob)}
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
