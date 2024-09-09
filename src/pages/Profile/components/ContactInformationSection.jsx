import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ViewDetailIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';

import { employmentValuesDisableOccupation } from '../constants';

const ContactInformationSection = ({
  onOpenSelectEmploymentBottom,
  employmentOptions,
  onOpenSelectOccupation1Bottom,
  occupation1Options,
}) => {
  const { control, watch, setValue } = useFormContext();
  const [employment] = watch(['employment']);

  const isDisabledOccupation = employmentValuesDisableOccupation.includes(employment);

  useEffect(() => {
    setValue('occupation1', null);
    setValue('occupation2', null);
    if (employmentValuesDisableOccupation.includes(employment)) {
      const occupation3Name = (employmentOptions || []).find(item => item.value === employment)?.label;
      setValue('occupation3', occupation3Name);
    } else {
      setValue('occupation3', '');
    }
  }, [employment]);

  return (
    <div className="form__section">
      <div className="form__section__title">
        <span>Contact Information</span>
      </div>
      <Controller
        render={({ field }) => (
          <Input
            label={'Name'}
            type={'text'}
            disabled
            {...field}
          />
        )}
        control={control}
        name="name"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={'Date of Birth'}
            type={'text'}
            disabled
            {...field}
          />
        )}
        control={control}
        name="dobDisplay"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={'SIN'}
            type={'text'}
            disabled
            {...field}
          />
        )}
        control={control}
        name="sin"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={'E-mail address'}
            type={'text'}
            endAdornment={
              <Button
                label="Send"
                variant="outlined__primary"
                className="btn__send btn__sm"
              />
            }
            {...field}
          />
        )}
        control={control}
        name="email"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={'Call Number'}
            type={'text'}
            {...field}
          />
        )}
        control={control}
        name="callNumber"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label={'Employment'}
            onFocus={onOpenSelectEmploymentBottom}
            options={employmentOptions}
            {...field}
          />
        )}
        control={control}
        name="employment"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label={'Occupation1'}
            onFocus={onOpenSelectOccupation1Bottom}
            options={occupation1Options}
            disabled={isDisabledOccupation}
            {...field}
          />
        )}
        control={control}
        name="occupation1"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label={'Occupation2'}
            disabled={isDisabledOccupation}
            {...field}
          />
        )}
        control={control}
        name="occupation2"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={'Occupation3'}
            {...field}
          />
        )}
        control={control}
        name="occupation3"
      />
      <div className="agreement__download">
        <span>Electronic Communication Agreement</span>
        <ViewDetailIcon />
      </div>
    </div>
  );
};

export default ContactInformationSection;
