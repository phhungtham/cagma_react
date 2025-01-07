import { useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import { signUpEnterPersonalLabels as labels } from '@common/constants/labels';
import {
  invalidCityRegex,
  invalidNameRegex,
  notAllowNumberRegex,
  postalCodeNotAllowRegex,
} from '@common/constants/regex';
import { SignUpContext } from '@pages/SignUp';

import { CommonCodeFieldName, SignUpSelectType } from '../../constants';

const HomeAddressSection = ({ onOpenSelectBottom, commonCode }) => {
  const { translate: t } = useContext(SignUpContext);
  const { control, watch, setValue } = useFormContext();

  const [aptNumber, streetNumber, streetName] = watch(['aptNumber', 'streetNumber', 'streetName']);

  const handleFieldAddressOnBlur = () => {
    const updatedAddress = [aptNumber, streetNumber, streetName].filter(Boolean).join(' ');
    setValue('address', updatedAddress);
  };

  return (
    <div className="form__section flex-gap-y-12">
      <div className="form__section__title">{t(labels.homeAddress)}</div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label={t(labels.country)}
            onFocus={() => onOpenSelectBottom(SignUpSelectType.COUNTRY)}
            options={commonCode[CommonCodeFieldName.COUNTRY]}
            {...field}
          />
        )}
        control={control}
        name="country"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.postalCode)}
            maxLength={6}
            regex={postalCodeNotAllowRegex}
            {...field}
            onChange={value => {
              const upperCaseValue = value ? value.toUpperCase() : '';
              field.onChange(upperCaseValue);
            }}
          />
        )}
        control={control}
        name="postalCode"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.aptNumber)}
            inputMode="numeric"
            type="text"
            regex={notAllowNumberRegex}
            maxLength={40}
            {...field}
            onBlur={handleFieldAddressOnBlur}
          />
        )}
        control={control}
        name="aptNumber"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.streetNumber)}
            inputMode="numeric"
            type="text"
            regex={notAllowNumberRegex}
            maxLength={60}
            {...field}
            onBlur={handleFieldAddressOnBlur}
          />
        )}
        control={control}
        name="streetNumber"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.streetName)}
            maxLength={80}
            regex={invalidNameRegex}
            {...field}
            onBlur={handleFieldAddressOnBlur}
          />
        )}
        control={control}
        name="streetName"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.address)}
            maxLength={200}
            readOnly
            {...field}
          />
        )}
        control={control}
        name="address"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.city)}
            maxLength={50}
            regex={invalidCityRegex}
            {...field}
          />
        )}
        control={control}
        name="city"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label={t(labels.province)}
            onFocus={() => onOpenSelectBottom(SignUpSelectType.PROVINCE)}
            options={commonCode[CommonCodeFieldName.PROVINCE]}
            {...field}
          />
        )}
        control={control}
        name="province"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.housePhoneNumber)}
            inputMode="numeric"
            type="text"
            regex={notAllowNumberRegex}
            maxLength={30}
            {...field}
          />
        )}
        control={control}
        name="housePhoneNo"
      />
    </div>
  );
};

export default HomeAddressSection;
