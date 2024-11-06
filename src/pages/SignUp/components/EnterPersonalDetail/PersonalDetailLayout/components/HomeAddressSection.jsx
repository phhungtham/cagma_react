import { Controller, useFormContext } from 'react-hook-form';

import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';

import { CommonCodeFieldName, SignUpSelectType } from '../../constants';

const HomeAddressSection = ({ onOpenSelectBottom, commonCode }) => {
  const { control, watch, setValue } = useFormContext();

  return (
    <div className="form__section">
      <div className="form__section__title">Home (Residential) Address</div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label="Country"
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
            label="Postal Code"
            {...field}
          />
        )}
        control={control}
        name="postalCode"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="APT#/SUITE#"
            type="number"
            inputMode="numeric"
            {...field}
          />
        )}
        control={control}
        name="aptNumber"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="Street#"
            type="number"
            inputMode="numeric"
            {...field}
          />
        )}
        control={control}
        name="streetNumber"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="Street Name"
            {...field}
          />
        )}
        control={control}
        name="streetName"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="Address"
            {...field}
          />
        )}
        control={control}
        name="address"
      />
      <Controller
        render={({ field }) => (
          <Input
            label="City"
            {...field}
          />
        )}
        control={control}
        name="city"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label="Province"
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
            label="House Phone Number"
            type="number"
            inputMode="numeric"
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
