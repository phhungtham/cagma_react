import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import { ArrowDown, FillTooltipIcon } from '@assets/icons';
import CheckBox from '@common/components/atoms/Checkbox';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Tooltip from '@common/components/atoms/Tooltip';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import { postalCodeNotAllowRegex } from '@common/constants/regex';
import { AppCfg } from '@configs/appConfigs';
import useProvince from '@hooks/useProvince';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';

const InterestRateSection = ({ control, watch, interestRate, setValue }) => {
  const { data: provinceList, requestGetProvinceList } = useProvince();
  const [showSelectProvinceBottom, setShowSelectProvinceBottom] = useState(false);

  const provinceListConverted = (provinceList || []).map(item => {
    return { value: item.key, label: item.value };
  });

  const [thirdPartyChecked, dob] = watch(['thirdPartyChecked', 'dob']);

  const handleSelectDate = data => {
    if (data) {
      const selectedDate = data?.selectDate;
      setValue('dob', selectedDate);
      // setValue('dob_display', formatYYYYMMDDToDisplay(selectedDate));
      setValue('dob_display', selectedDate);
    }
  };

  const handleOpenCalendar = () => {
    if (AppCfg.ENV === 'development') {
      //For dummy data because it call native calendar
      setValue('dob', '19980523');
      setValue('dob_display', formatYYYYMMDDToDisplay('19980523'));
    }
    openCalendar(handleSelectDate, { selectDate: dob || undefined });
  };

  const handleOpenSelectProvinceDropdown = () => {
    setShowSelectProvinceBottom(true);
  };

  const handleSelectProvince = item => {
    setValue('province', item.value);
    setShowSelectProvinceBottom(false);
  };

  useEffect(() => {
    if (thirdPartyChecked && !provinceList?.length) {
      requestGetProvinceList();
    }
  }, [thirdPartyChecked]);

  return (
    <div className="interest-rate__section">
      <section className="pb-6">
        <div className="enter-account__interest-rate">
          <span>Interest rate</span>
          <span>{interestRate}% APR</span>
          <span className="interest-rate__arrow">
            <ArrowDown />
          </span>
        </div>
        <InfoBox
          variant="informative"
          label="APR (Annual Percentage Rate)"
        />
      </section>
      <div className="divider__item__solid" />
      <section className="py-5">
        <div className="checklist___options">
          <div className="option-item">
            <Controller
              render={({ field }) => (
                <CheckBox
                  size="large"
                  label="Debit Card Issuance"
                  {...field}
                  checked={field.value}
                />
              )}
              control={control}
              name="debitCardIssuance"
            />
            <Tooltip
              content="If a debit card is issued, it will be sent to the stored customer address."
              placement="bottom_center"
            >
              <div className="item__tooltip">
                <FillTooltipIcon />
              </div>
            </Tooltip>
          </div>
          <div className="option-item">
            <Controller
              render={({ field }) => (
                <CheckBox
                  size="large"
                  label="Third Party Determination"
                  {...field}
                  checked={field.value}
                />
              )}
              control={control}
              name="thirdPartyChecked"
            />
            <Tooltip
              content="If this account be used by or on behalf of third party, please complete information"
              placement="bottom_center"
            >
              <div className="item__tooltip">
                <FillTooltipIcon />
              </div>
            </Tooltip>
          </div>
        </div>
        {thirdPartyChecked && (
          <section className="third_party-form__wrapper">
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
                  options={provinceListConverted}
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
          </section>
        )}
      </section>
      <div className="divider__item__solid" />
      <section className="mt-6">
        <Controller
          render={({ field }) => (
            <Input
              label={'Referral Code (Optional)'}
              maxLength={8}
              {...field}
            />
          )}
          control={control}
          name="referralCode"
        />
      </section>
      <SelectBottom
        open={showSelectProvinceBottom}
        onClose={() => setShowSelectProvinceBottom(false)}
        onSelect={handleSelectProvince}
        options={provinceListConverted}
        title="Province"
      />
    </div>
  );
};

export default InterestRateSection;
