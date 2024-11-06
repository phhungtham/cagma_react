import { Controller, useFormContext } from 'react-hook-form';

import CheckBox from '@common/components/atoms/Checkbox';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';

import { CommonCodeFieldName, SignUpSelectType } from '../../constants';

const AdditionalInfoSection = ({ onOpenSelectBottom, commonCode }) => {
  const { control, watch, setValue } = useFormContext();

  const [notSin] = watch(['notSin']);

  return (
    <div className="form__section">
      <div className="form__section__title">Additional Information</div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label="Nationality"
            onFocus={() => onOpenSelectBottom(SignUpSelectType.NATIONALITY)}
            options={commonCode[CommonCodeFieldName.COUNTRY]}
            disabled
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
            onFocus={() => onOpenSelectBottom(SignUpSelectType.RESIDENTIAL_STATUS)}
            options={commonCode[CommonCodeFieldName.RESIDENTIAL_STATUS]}
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
            disabled={!!notSin}
            {...field} //TODO: open customer keyboard plugin
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
        name="notSin"
      />
    </div>
  );
};

export default AdditionalInfoSection;
