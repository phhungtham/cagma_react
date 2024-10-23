import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FillTooltipIcon } from '@assets/icons';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';
import Tooltip from '@common/components/atoms/Tooltip';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import { postalCodeNotAllowRegex } from '@common/constants/regex';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';

import { thirdPartyActiveOptions } from './constants';

const ThirdPartyFormSection = ({ provinces }) => {
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
    openCalendar(handleSelectDate, { selectDate: dob || undefined });
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
      <div className="option-item">
        <div className="form__section__title mb-0">Third Party Determination</div>
        <Tooltip
          content="If this account be used by or on behalf of third party, please complete information"
          placement="bottom_center"
        >
          <div className="item__tooltip">
            <FillTooltipIcon />
          </div>
        </Tooltip>
      </div>
      <section className="third_party-form__wrapper">
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
                  label="Name of the Third Party"
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
                  label="Date of Birth"
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
                  label="Address"
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
                  label="City"
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
                  label="Province"
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
                  label="Postal Code"
                  maxLength={10}
                  regex={postalCodeNotAllowRegex}
                  {...field}
                />
              )}
              control={control}
              name="postalCode"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label="Occupation/Nature of Business"
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
                  label="Relationship to Applicant(S)"
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
