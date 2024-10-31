import { Fragment, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import { ArrowRight, LineDeleteIcon, PlusIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';
import Spinner from '@common/components/atoms/Spinner';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { initSelectBottom } from '@common/constants/bottomsheet';
import { getCountryCode } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { commonCodeDataToOptions } from '@utilities/convert';
import { moveBack } from '@utilities/index';

import { SELECT_TYPE, USResidentOptions } from './constants';
import GuideTaxBottom from './GuideTaxBottom';
import { dtrFormSchema } from './schema';
import './styles.scss';

const maxCountriesLength = 2;

const DTR = ({ setAlert }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showGuideTaxBottom, setShowGuideTaxBottom] = useState(false);
  const [currentSelectFieldName, setCurrentSelectFieldName] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([
    {
      label: 'Applied or will apply TIN but haven’t received it yet. I’ll provide it later.',
      value: 1,
    },
    {
      label: 'Another reason. I’ll provide my TIN later.',
      value: 2,
    },
  ]);
  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const { requestApi } = useApi();
  const {
    control,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      isUSResident: 'Y',
      isOtherCountryResident: 'N',
    },
    mode: 'onChange',
    resolver: yupResolver(dtrFormSchema),
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'countries',
  });

  const [isUSResident, isOtherCountryResident, notHaveTin1, countries] = watch([
    'isUSResident',
    'isOtherCountryResident',
    'notHaveTin1',
    'countries',
  ]);

  console.log('countries :>> ', countries);

  const showAddCountryButton = isOtherCountryResident === 'Y' && fields.length < maxCountriesLength;

  const handleOpenGuideTaxBottom = () => {
    setShowGuideTaxBottom(true);
  };

  const handleOpenSelectCountryBottom = fieldName => {
    setCurrentSelectFieldName(fieldName);
    setSelectBottom({
      type: SELECT_TYPE.COUNTRY,
      options: countryOptions,
      isShow: true,
      title: 'Select country',
    });
  };

  const handleOpenSelectReasonBottom = fieldName => {
    setCurrentSelectFieldName(fieldName);
    setSelectBottom({
      type: SELECT_TYPE.COUNTRY,
      options: reasonOptions,
      isShow: true,
      title: 'Select reason',
    });
  };

  const handleAddCountry = () => {
    append({
      country: '',
      notHaveTin: false,
      countryTin: '',
      reason: '',
    });
  };

  const handleDeleteCountry = index => {
    remove(index);
  };

  const onCloseSelectBottom = () => {
    setSelectBottom(initSelectBottom);
  };

  const onChangeSelectBottom = async item => {
    const value = item.value;
    setValue(currentSelectFieldName, value, { shouldValidate: true });
    onCloseSelectBottom();
  };

  const requestGetCountries = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, { code: getCountryCode });
    setShowLoading(false);
    if (isSuccess) {
      const { nat_c: countries } = data;
      const convertedCountries = commonCodeDataToOptions(countries);
      setCountryOptions(convertedCountries);
      return data;
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  useEffect(() => {
    requestGetCountries();
  }, []);

  return (
    <>
      <Header
        title="Open Account"
        onClick={moveBack}
      />
      <div className="page__form px-0 answer-tax__wrapper">
        {showLoading && <Spinner />}
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
                  inputMode="numeric"
                  placeholder="(Social Insurance Number)"
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
              {isUSResident === 'Y' && (
                <Controller
                  render={({ field }) => (
                    <Input
                      label="TIN(Tax Identification Number)"
                      {...field}
                    />
                  )}
                  control={control}
                  name="personalTin"
                />
              )}
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
                {isOtherCountryResident === 'Y' && (
                  <>
                    <Controller
                      render={({ field }) => (
                        <Dropdown
                          label="Country you hold tax residency in"
                          onFocus={() => handleOpenSelectCountryBottom('country1')}
                          options={countryOptions}
                          {...field}
                        />
                      )}
                      control={control}
                      name="country1"
                    />
                    <Controller
                      render={({ field }) => (
                        <Input
                          label="TIN(Tax Identification Number)"
                          disabled={notHaveTin1}
                          {...field}
                        />
                      )}
                      control={control}
                      name="tin1"
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
                        name="notHaveTin1"
                      />
                    </div>
                    {notHaveTin1 && (
                      <Controller
                        render={({ field }) => (
                          <Dropdown
                            label="Reason"
                            onFocus={() => handleOpenSelectReasonBottom('reason1')}
                            options={reasonOptions}
                            {...field}
                          />
                        )}
                        control={control}
                        name="reason1"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {fields.map((field, index) => (
          <Fragment key={field.id}>
            <div className="divider__group" />
            <div className="page__container py-6">
              <div className="form__section__title country-title">
                <span>Country{index + 2}</span>
                <span
                  className="flex-center"
                  onClick={() => handleDeleteCountry(index)}
                >
                  <LineDeleteIcon />
                </span>
              </div>
              <div className="mt-4">
                <div className="form__section">
                  <Controller
                    render={({ field }) => (
                      <Dropdown
                        label="Country you hold tax residency in"
                        onFocus={() => handleOpenSelectCountryBottom(`countries.${index}.country`)}
                        options={countryOptions}
                        {...field}
                      />
                    )}
                    control={control}
                    name={`countries.${index}.country`}
                  />
                  <Controller
                    render={({ field }) => (
                      <Input
                        label="TIN(Tax Identification Number)"
                        disabled={countries?.[index]?.notHaveTin}
                        {...field}
                      />
                    )}
                    control={control}
                    name={`countries.${index}.countryTin`}
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
                      name={`countries.${index}.notHaveTin`}
                    />
                  </div>
                  {countries?.[index]?.notHaveTin && (
                    <Controller
                      render={({ field }) => (
                        <Dropdown
                          label="Reason"
                          onFocus={() => handleOpenSelectReasonBottom(`countries.${index}.reason`)}
                          options={reasonOptions}
                          {...field}
                        />
                      )}
                      control={control}
                      name={`countries.${index}.reason`}
                    />
                  )}
                </div>
              </div>
            </div>
          </Fragment>
        ))}
        {showAddCountryButton && (
          <div className="mt-6 flex-center">
            <Button
              label="Add Country"
              variant="filled__secondary-gray"
              size="md"
              startIcon={<PlusIcon />}
              onClick={handleAddCountry}
            />
          </div>
        )}
        <div className="footer__fixed">
          <Button
            label="Next"
            variant="filled__primary"
            className="btn__cta"
            disable={!isValid}
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
        showArrow={false}
        title={selectBottom.title}
      />
    </>
  );
};

export default DTR;
