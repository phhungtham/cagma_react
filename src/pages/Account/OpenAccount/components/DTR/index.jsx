import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

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
import { getCountryCode, tinUnregisterReason } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import { openAccountDTRLabels as labels, menuLabels } from '@common/constants/labels';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { commonCodeDataToOptions } from '@utilities/convert';
import { moveBack } from '@utilities/index';

import { SELECT_TYPE, USResidentOptions } from './constants';
import GuideTaxBottom from './GuideTaxBottom';
import RegisterDTRSuccess from './RegisterDTRSuccess';
import { dtrFormSchema } from './schema';
import './styles.scss';

const DTR = ({ setAlert, DTRInfo, onConfirm, translate: t }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showRegisterDTRSuccess, setShowRegisterDTRSuccess] = useState(false);
  const [showGuideTaxBottom, setShowGuideTaxBottom] = useState(false);
  const [currentSelectFieldName, setCurrentSelectFieldName] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [unregisterReasons, setUnregisterReasons] = useState([]);
  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const { requestApi } = useApi();
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      isUSResident: 'Y',
      isOtherCountryResident: 'N',
    },
    mode: 'onChange',
    resolver: yupResolver(dtrFormSchema),
  });

  const [isUSResident, isOtherCountryResident, notHaveTin1, showCountry2, notHaveTin2] = watch([
    'isUSResident',
    'isOtherCountryResident',
    'notHaveTin1',
    'showCountry2',
    'notHaveTin2',
  ]);

  const showAddCountryButton = !showCountry2 && isOtherCountryResident === 'Y';

  const handleOpenGuideTaxBottom = () => {
    setShowGuideTaxBottom(true);
  };

  const handleOpenSelectCountryBottom = fieldName => {
    setCurrentSelectFieldName(fieldName);
    setSelectBottom({
      type: SELECT_TYPE.COUNTRY,
      options: countryOptions,
      isShow: true,
      title: t(labels.selectCountry),
    });
  };

  const handleOpenSelectReasonBottom = fieldName => {
    setCurrentSelectFieldName(fieldName);
    setSelectBottom({
      type: SELECT_TYPE.COUNTRY,
      options: unregisterReasons,
      isShow: true,
      title: t(labels.selectAReason),
    });
  };

  const handleAddCountry = () => {
    setValue('showCountry2', true, { shouldValidate: true });
  };

  const handleDeleteCountry = index => {
    setValue('showCountry2', false, { shouldValidate: true });
  };

  const onCloseSelectBottom = () => {
    setSelectBottom(initSelectBottom);
  };

  const onChangeSelectBottom = async item => {
    const value = item.value;
    setValue(currentSelectFieldName, value, { shouldValidate: true });
    onCloseSelectBottom();
  };

  const requestGetCommonCode = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, {
      code: [getCountryCode, tinUnregisterReason].join(';'),
    });
    setShowLoading(false);
    if (isSuccess) {
      const { nat_c: countries, tin_un_regis_rsn_c: reasons } = data;
      const convertedCountries = commonCodeDataToOptions(countries);
      const convertedReasons = commonCodeDataToOptions(reasons);
      setCountryOptions(convertedCountries);
      setUnregisterReasons(convertedReasons);
      return data;
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleSubmitForm = async values => {
    setShowLoading(true);
    const { isUSResident, personalTin, country1, tin1, reason1, country2, tin2, reason2, sin } = values;
    const payload = {
      ...DTRInfo,
      tin_aplct_yn: DTRInfo?.dtr_yn === 'Y' ? 1 : 0,
      scscrt_no: sin,
      crs_us_pn_yn: isUSResident,
      psn_tin_no: personalTin || '',
      etc_nat_yn: isOtherCountryResident,
      tax_paid_nat_c: country1,
      etc_nat_tin_no: tin1,
      tin_un_regis_rsn_c: reason1,
      ca_tax_tgt_yn: sin ? 'Y' : 'N',
      tax_paid_nat_c2: country2,
      etc_nat_tin_no2: tin2 || '',
      tin_un_regis_rsn_c2: reason2,
    };
    const { error, isSuccess, requiredLogin } = await requestApi(endpoints.registerDTR, payload);
    setShowLoading(false);
    if (isSuccess) {
      setShowRegisterDTRSuccess(true);
    } else {
      setAlert({
        isShow: true,
        content: error,
        requiredLogin,
      });
    }
  };

  useEffect(() => {
    requestGetCommonCode();
  }, []);

  return (
    <>
      {showRegisterDTRSuccess ? (
        <RegisterDTRSuccess
          onConfirm={onConfirm}
          translate={t}
        />
      ) : (
        <>
          <Header
            title={t(menuLabels.openAccount)}
            onClick={moveBack}
          />
          <div className="py-5 answer-tax__wrapper">
            {showLoading && <Spinner />}
            <div className="page__container pb-4">
              <h1 className="page__title">{t(labels.answerQuestion)}</h1>
              <div className="mt-4 answer-tax__desc">
                <div>{t(labels.theCanadaRevenue)}</div>
                <div className="mt-4">{t(labels.pleaseEnterTheCorrect)}</div>
              </div>
              <div className="mt-3">
                <Button
                  label={t(labels.viewGuidelines)}
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
                  <span>{t(labels.sinNumberTitle)}</span>
                </div>
                <Controller
                  render={({ field }) => (
                    <Input
                      label={t(labels.sinNumber)}
                      type="number"
                      inputMode="numeric"
                      maxLength={9}
                      placeholder="(Social Insurance Number)"
                      helperText={t(labels.yourSinWillBe)}
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
                <span>{t(labels.taxQuestions)}</span>
              </div>
              <div className="tax-question mt-3">{t(labels.areYouTaxResidentUS)}</div>
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
                          label={t(labels.tinTaxIdentification)}
                          type="number"
                          inputMode="numeric"
                          maxLength={9}
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
                <div className="tax-question">{t(labels.areYouResidentOtherUS)}</div>
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
                              label={t(labels.countryYouHold)}
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
                              label={t(labels.tinTaxIdentification2)}
                              type="number"
                              inputMode="numeric"
                              maxLength={30}
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
                                label={t(labels.iDontHaveTin)}
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
                                label={t(labels.reason)}
                                onFocus={() => handleOpenSelectReasonBottom('reason1')}
                                options={unregisterReasons}
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
            {showCountry2 && (
              <>
                <div className="divider__group" />
                <div className="page__container py-6">
                  <div className="form__section__title country-title">
                    <span>{t(labels.country2)}</span>
                    <span
                      className="flex-center"
                      onClick={handleDeleteCountry}
                    >
                      <LineDeleteIcon />
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="form__section">
                      <Controller
                        render={({ field }) => (
                          <Dropdown
                            label={t(labels.countryYouHold)}
                            onFocus={() => handleOpenSelectCountryBottom('country2')}
                            options={countryOptions}
                            {...field}
                          />
                        )}
                        control={control}
                        name="country2"
                      />
                      <Controller
                        render={({ field }) => (
                          <Input
                            label={t(labels.tinTaxIdentification2)}
                            disabled={notHaveTin2}
                            type="number"
                            inputMode="numeric"
                            maxLength={30}
                            {...field}
                          />
                        )}
                        control={control}
                        name="tin2"
                      />
                      <div className="my-1">
                        <Controller
                          render={({ field }) => (
                            <CheckBox
                              size="large"
                              label={t(labels.iDontHaveTin)}
                              {...field}
                              checked={field.value}
                            />
                          )}
                          control={control}
                          name="notHaveTin2"
                        />
                      </div>
                      {notHaveTin2 && (
                        <Controller
                          render={({ field }) => (
                            <Dropdown
                              label={t(labels.reason)}
                              onFocus={() => handleOpenSelectReasonBottom('reason2')}
                              options={unregisterReasons}
                              {...field}
                            />
                          )}
                          control={control}
                          name="reason2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {showAddCountryButton && (
              <div className="mt-6 flex-center">
                <Button
                  label={t(labels.addCountry)}
                  variant="filled__secondary-gray"
                  size="md"
                  startIcon={<PlusIcon />}
                  onClick={handleAddCountry}
                />
              </div>
            )}
            <div className="footer__fixed">
              <Button
                label={t(labels.next)}
                variant="filled__primary"
                className="btn__cta"
                disable={!isValid}
                onClick={handleSubmit(handleSubmitForm)}
              />
            </div>
          </div>
        </>
      )}

      <GuideTaxBottom
        open={showGuideTaxBottom}
        onClose={() => setShowGuideTaxBottom(false)}
        translate={t}
      />
      <SelectBottom
        open={selectBottom.isShow}
        onClose={onCloseSelectBottom}
        onSelect={onChangeSelectBottom}
        options={selectBottom.options}
        title={selectBottom.title}
      />
    </>
  );
};

export default DTR;
