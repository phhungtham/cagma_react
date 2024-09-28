import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ArrowRight } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { initSelectBottom } from '@common/constants/bottomsheet';
import { getCountryCode } from '@common/constants/commonCode';
import useCommonCode from '@hooks/useCommonCode';
import { commonCodeDataToOptions } from '@utilities/convert';
import { moveBack } from '@utilities/index';

import { SELECT_TYPE, selectBottomTypeMapField, USResidentOptions } from './constants';
import GuideTaxBottom from './GuideTaxBottom';
import './styles.scss';

const DTR = () => {
  const [showGuideTaxBottom, setShowGuideTaxBottom] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([
    {
      label: 'Applied or will apply TIN but haven’t reveiced it yet. I’ll provide it later.',
      value: 1,
    },
    {
      label: 'Another reason. I’ll provide my TIN later.',
      value: 2,
    },
  ]);
  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const { sendRequest: requestGetCommonCode, data: commonCodeData, isLoading: isLoadingCommonCode } = useCommonCode();
  const { control, setValue } = useForm();

  const handleOpenGuideTaxBottom = () => {
    setShowGuideTaxBottom(true);
  };

  const handleOpenSelectCountryBottom = () => {
    setSelectBottom({
      type: SELECT_TYPE.COUNTRY,
      options: countryOptions,
      isShow: true,
      title: 'Select country',
    });
  };

  const handleOpenSelectReasonBottom = () => {
    setSelectBottom({
      type: SELECT_TYPE.COUNTRY,
      options: reasonOptions,
      isShow: true,
      title: 'Select reason',
    });
  };

  const onCloseSelectBottom = () => {
    setSelectBottom(initSelectBottom);
  };

  const onChangeSelectBottom = async item => {
    const fieldName = selectBottomTypeMapField[selectBottom.type];
    const value = item.value;
    setValue(fieldName, value);
    onCloseSelectBottom();
  };

  useEffect(() => {
    if (commonCodeData) {
      const { nat_c: countries } = commonCodeData || {};
      const convertedCountries = commonCodeDataToOptions(countries);

      setCountryOptions(convertedCountries);
    }
  }, [commonCodeData]);

  useEffect(() => {
    requestGetCommonCode(getCountryCode);
  }, []);

  return (
    <>
      <Header
        title="Open Account"
        onClick={moveBack}
      />
      <div className="page__form px-0 answer-tax__wrapper">
        <div className="page__container pb-4">
          <h1 className="page__title">Answer Questions about Tax</h1>
          <div className="mt-4 answer-tax__desc">
            <div>
              The Canada Revenue Agency requires us to collect information about your tax residency when opening an
              account.
            </div>
            <div className="mt-4">Please enter the correct information when inputting DTR information.</div>
          </div>
          <div className="mt-3">
            <Button
              label="View guidelines"
              variant="text__primary"
              size="sm"
              endIcon={<ArrowRight />}
              onClick={handleOpenGuideTaxBottom}
            />
          </div>
        </div>
        <div className="divider__group" />
        <div className="page__container pt-5 pb-6">
          <div className="form__section">
            <div className="form__section__title">
              <span>SIN Number</span>
            </div>
            <Controller
              render={({ field }) => (
                <Input
                  label="SIN Number"
                  type="number"
                  helperText="Your SIN will be used only for account opening."
                  {...field}
                />
              )}
              control={control}
              name="sin"
            />
          </div>
        </div>
        <div className="divider__group" />
        <div className="page__container pt-5 pb-6">
          <div className="form__section__title">
            <span>Tax Questions</span>
          </div>
          <div className="tax-question mt-3">Are you a tax resident or citizen the U.S.?</div>
          <div className="mt-4">
            <div className="form__section">
              <Controller
                render={({ field }) => (
                  <BoxRadio
                    options={USResidentOptions}
                    {...field}
                  />
                )}
                control={control}
                name="isUSResident"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="TIN(Tax Identification Number)"
                    {...field}
                  />
                )}
                control={control}
                name="tin"
              />
            </div>
          </div>
          <div className="divider__item__solid mt-6" />
          <div className="pt-5">
            <div className="tax-question">Are you a tax resident of a country other than Canada or the U.S.? </div>
            <div className="mt-4">
              <div className="form__section">
                <Controller
                  render={({ field }) => (
                    <BoxRadio
                      options={USResidentOptions}
                      {...field}
                    />
                  )}
                  control={control}
                  name="isOtherCountryResident"
                />
                <Controller
                  render={({ field }) => (
                    <Dropdown
                      label="Country you hold tax residency in"
                      onFocus={handleOpenSelectCountryBottom}
                      options={countryOptions}
                      {...field}
                    />
                  )}
                  control={control}
                  name="country"
                />
                <Controller
                  render={({ field }) => (
                    <Input
                      label="TIN(Tax Identification Number)"
                      {...field}
                    />
                  )}
                  control={control}
                  name="tin"
                />
                <div className="my-1">
                  <Controller
                    render={({ field }) => (
                      <CheckBox
                        size="large"
                        label="I don’t have the TIN for this country"
                        {...field}
                        checked={field.value}
                      />
                    )}
                    control={control}
                    name="notTin"
                  />
                </div>
                <Controller
                  render={({ field }) => (
                    <Dropdown
                      label="Reason"
                      onFocus={handleOpenSelectReasonBottom}
                      options={reasonOptions}
                      {...field}
                    />
                  )}
                  control={control}
                  name="reason"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label="Next"
            variant="filled__primary"
            className="btn__cta"
            onClick={() => {}}
          />
        </div>
      </div>
      <GuideTaxBottom
        open={showGuideTaxBottom}
        onClose={() => setShowGuideTaxBottom(false)}
      />
      <SelectBottom
        open={selectBottom.isShow}
        onClose={onCloseSelectBottom}
        onSelect={onChangeSelectBottom}
        options={selectBottom.options}
        showArrow
        title={selectBottom.title}
      />
    </>
  );
};

export default DTR;
