import { Controller, useFormContext } from 'react-hook-form';

import { FillTooltipIcon } from '@assets/icons';
import CheckBox from '@common/components/atoms/Checkbox';
import Input from '@common/components/atoms/Input/Input';
import Tooltip from '@common/components/atoms/Tooltip';
import { openAccountLabels as labels } from '@common/constants/labels';
import { ProductCode } from '@common/constants/product';

const ReferralCodeSection = ({ productCode, translate: t }) => {
  const isShowCheckboxList = [
    ProductCode.E_SAVING,
    ProductCode.TFSA_E_SAVINGS,
    ProductCode.RRSP_E_SAVINGS,
    ProductCode.CHEQUING,
  ].includes(productCode);
  const isShowDebitCardCheckbox = [ProductCode.E_SAVING, ProductCode.CHEQUING].includes(productCode);
  const isShowTFSACheckbox = productCode === ProductCode.TFSA_E_SAVINGS;
  const isShowRRSPCheckbox = productCode === ProductCode.RRSP_E_SAVINGS;
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
                    label={t(labels.debitCardIssuance)}
                    {...field}
                    checked={field.value}
                  />
                )}
                control={control}
                name="debitCardIssuance"
              />
              <Tooltip
                content={t(labels.ifADebitCardIssued)}
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
                      label={t(labels.iHaveCheckedTFSA)}
                      {...field}
                      checked={field.value}
                    />
                  )}
                  control={control}
                  name="tfsaTerm"
                />
                <Tooltip
                  content={t(labels.tfsaTooltip)}
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
          {isShowRRSPCheckbox && (
            <>
              <div className="option-item">
                <Controller
                  render={({ field }) => (
                    <CheckBox
                      size="large"
                      label={t(labels.iHaveCheckedRRSP)}
                      {...field}
                      checked={field.value}
                    />
                  )}
                  control={control}
                  name="rrspTerm"
                />
                <Tooltip
                  content={t(labels.rrspTooltip)}
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
              label={t(labels.referralCode)}
              maxLength={8}
              type="number"
              inputMode="numeric"
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
