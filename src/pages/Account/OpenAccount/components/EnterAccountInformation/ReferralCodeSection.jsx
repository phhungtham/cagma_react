import { Controller, useFormContext } from 'react-hook-form';

import { FillTooltipIcon } from '@assets/icons';
import CheckBox from '@common/components/atoms/Checkbox';
import Input from '@common/components/atoms/Input/Input';
import Tooltip from '@common/components/atoms/Tooltip';
import { ProductCode } from '@common/constants/product';

const ReferralCodeSection = ({ productCode }) => {
  const isShowCheckboxList = [ProductCode.E_SAVING, ProductCode.TFSA_E_SAVINGS, ProductCode.TFSA_E_GIC].includes(
    productCode
  );
  const isShowDebitCardCheckbox = productCode === ProductCode.E_SAVING;
  const isShowTFSACheckbox = [ProductCode.TFSA_E_GIC, ProductCode.TFSA_E_SAVINGS].includes(productCode);
  const { control } = useFormContext();

  return (
    <div className="referral-code__section">
      {isShowCheckboxList && (
        <div className="checklist___options pt-5">
          {isShowDebitCardCheckbox && (
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
          )}
          {isShowTFSACheckbox && (
            <>
              <div className="option-item">
                <Controller
                  render={({ field }) => (
                    <CheckBox
                      size="large"
                      label="I have checked my TFSA contribution room"
                      {...field}
                      checked={field.value}
                    />
                  )}
                  control={control}
                  name="debitCardIssuance"
                />
                {/* TODO: Check to get content */}
                <Tooltip
                  content="If a debit card is issued, it will be sent to the stored customer address."
                  placement="bottom_center"
                >
                  <div className="item__tooltip">
                    <FillTooltipIcon />
                  </div>
                </Tooltip>
              </div>
              <div className="divider__item__solid mb-2" />
            </>
          )}
        </div>
      )}
      <section className={isShowCheckboxList ? 'mt-4' : 'mt-6'}>
        <Controller
          render={({ field }) => (
            <Input
              label="Referral Code (Optional)"
              maxLength={8}
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

export default ReferralCodeSection;
