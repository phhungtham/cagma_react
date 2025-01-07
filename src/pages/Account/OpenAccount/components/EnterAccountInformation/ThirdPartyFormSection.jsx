import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FillTooltipIcon } from '@assets/icons';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';
import Tooltip from '@common/components/atoms/Tooltip';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import { openAccountLabels as labels } from '@common/constants/labels';
import { invalidCityRegex, postalCodeNotAllowRegex } from '@common/constants/regex';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import dayjs from 'dayjs';

import { thirdPartyActiveOptions } from './constants';

const ThirdPartyFormSection = ({ provinces, translate: t }) => {
  const [showSelectProvinceBottom, setShowSelectProvinceBottom] = useState(false);

  const { watch, setValue, control } = useFormContext();

  const [thirdPartyChecked, dob] = watch(['thirdPartyChecked', 'dob']);

  const handleSelectDate = selectedDate => {
    if (selectedDate) {
      setValue('dob', selectedDate, { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay(selectedDate), { shouldValidate: true });
    }
  };

  const handleOpenCalendar = () => {
    const maxDate = dayjs().subtract('1', 'day').format('YYYYMMDD');
    openCalendar(handleSelectDate, { selectDate: dob || maxDate, endDate: maxDate });
  };

  const handleOpenSelectProvinceDropdown = () => {
    setShowSelectProvinceBottom(true);
  };

  const handleSelectProvince = item => {
    setValue('province', item.value, { shouldValidate: true });
    setShowSelectProvinceBottom(false);
  };

  return (
    <div className="third-party__section page__container">
      <div className="option-item flex-gap-x-8">
        <div className="form__section__title mb-0">{t(labels.thirdPartyDetermination)}</div>
        <Tooltip
          content={t(labels.ifThisAccount)}
          placement="bottom_center"
        >
          <div className="item__tooltip">
            <FillTooltipIcon />
          </div>
        </Tooltip>
      </div>
      <section className="third_party-form__wrapper flex-gap-y-12">
        <Controller
          render={({ field }) => (
            <BoxRadio
              options={thirdPartyActiveOptions}
              {...field}
            />
          )}
          control={control}
          name="thirdPartyChecked"
        />
        {thirdPartyChecked === 'Y' && (
          <>
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.nameThirdParty)}
                  maxLength={100}
                  {...field}
                />
              )}
              control={control}
              name="thirdPartyName"
            />
            <Controller
              render={({ field: { value } }) => (
                <InputDate
                  label={t(labels.dob2)}
                  onFocus={handleOpenCalendar}
                  value={value}
                />
              )}
              control={control}
              name="dob_display"
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
                  regex={invalidCityRegex}
                  maxLength={200}
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
                  onFocus={handleOpenSelectProvinceDropdown}
                  options={provinces}
                  {...field}
                />
              )}
              control={control}
              name="province"
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
                  label={t(labels.occupationNature)}
                  maxLength={100}
                  {...field}
                />
              )}
              control={control}
              name="occupation"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.relationship)}
                  maxLength={100}
                  {...field}
                />
              )}
              control={control}
              name="relationship"
            />
          </>
        )}
      </section>
      <SelectBottom
        open={showSelectProvinceBottom}
        onClose={() => setShowSelectProvinceBottom(false)}
        onSelect={handleSelectProvince}
        options={provinces}
        title="Province"
      />
    </div>
  );
};

export default ThirdPartyFormSection;
