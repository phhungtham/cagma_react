import { Controller } from 'react-hook-form';

import { ArrowDown, FillTooltipIcon } from '@assets/icons';
import CheckBox from '@common/components/atoms/Checkbox';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';

const InterestRateSection = ({ control, watch, interestRate, setValue }) => {
  const thirdPartyChecked = watch('tpd_chk');

  const handleChangeThirdPartyOption = checked => {
    setValue('tpd_chk', checked);
  };

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
            <CheckBox
              size="large"
              label="Debit Card Issuance"
            />
            <div className="item__tooltip">
              <FillTooltipIcon />
            </div>
          </div>
          <div className="option-item">
            <CheckBox
              size="large"
              label="Third Party Determination"
              checked={!!thirdPartyChecked}
              onChange={handleChangeThirdPartyOption}
            />
            <div className="item__tooltip">
              <FillTooltipIcon />
            </div>
          </div>
        </div>
        {thirdPartyChecked && (
          <section className="third_party-form__wrapper">
            <Controller
              render={({ field }) => (
                <Input
                  label="Name of the Third Party"
                  {...field}
                />
              )}
              control={control}
              name="tpd_nm"
            />
            <Controller
              render={({ field }) => (
                <InputDate
                  label="Date of Birth"
                  {...field}
                />
              )}
              control={control}
              name="tpd_bth_y4mm_dt"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label="Address"
                  {...field}
                />
              )}
              control={control}
              name="tpd_adr1"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label="City"
                  {...field}
                />
              )}
              control={control}
              name="tpd_adr2"
            />
            <Controller
              render={({ field }) => (
                <Dropdown
                  label="Province"
                  {...field}
                />
              )}
              control={control}
              name="tpd_state_c"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label="Postal Code"
                  {...field}
                />
              )}
              control={control}
              name="tpd_adr_zipc"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label="Occupation/Nature of Business"
                  {...field}
                />
              )}
              control={control}
              name="tpd_job_nm"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label="Relationship to Applicant(S)"
                  {...field}
                />
              )}
              control={control}
              name="tpd_cus_relt_ctt"
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
              {...field}
            />
          )}
          control={control}
          name="referralCode"
        />
      </section>
    </div>
  );
};

export default InterestRateSection;
