import { useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CheckBox from '@common/components/atoms/Checkbox';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import { signUpEnterPersonalLabels as labels } from '@common/constants/labels';
import { SignUpContext } from '@pages/SignUp';

import { CommonCodeFieldName, SignUpSelectType } from '../../constants';

const AdditionalInfoSection = ({ onOpenSelectBottom, commonCode }) => {
  const { translate: t } = useContext(SignUpContext);
  const { control, watch } = useFormContext();

  const [notSin] = watch(['notSin']);

  return (
    <div className="form__section flex-gap-y-12">
      <div className="form__section__title">{t(labels.additionalInfo)}</div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label={t(labels.nationality)}
            onFocus={() => onOpenSelectBottom(SignUpSelectType.NATIONALITY)}
            options={commonCode[CommonCodeFieldName.COUNTRY]}
            {...field}
          />
        )}
        control={control}
        name="nationality"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label={t(labels.residentialStatus)}
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
            label={t(labels.sinNumber)}
            helperText={t(labels.yourSinWillBe)}
            disabled={!!notSin}
            maxLength={9}
            type="number"
            inputMode="numeric"
            {...field}
          />
        )}
        control={control}
        name="sin"
      />
      <Controller
        render={({ field }) => (
          <CheckBox
            size="large"
            label={t(labels.iDontHaveSin)}
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
