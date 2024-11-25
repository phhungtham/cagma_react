import { useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import { signUpEnterPersonalLabels as labels } from '@common/constants/labels';
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
    <div className="form__section">
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
            maxLength={10}
            {...field}
          />
        )}
        control={control}
        name="postalCode"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.aptNumber)}
            type="number"
            inputMode="numeric"
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
            type="number"
            inputMode="numeric"
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
            type="number"
            inputMode="numeric"
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
