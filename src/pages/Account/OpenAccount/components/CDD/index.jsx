import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';
import Spinner from '@common/components/atoms/Spinner';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { initSelectBottom } from '@common/constants/bottomsheet';
import {
  getCountryCode,
  getExpectedTransferAmountCode,
  getExpectedTransferCycleCode,
  getTransferExpectedRelationshipCode,
} from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, openAccountCDDLabels as labels, menuLabels } from '@common/constants/labels';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { commonCodeDataToOptions } from '@utilities/convert';
import { moveBack } from '@utilities/index';

import { accountReceiveLargeTransferOptions, cddRelationshipOthers, CDDSelectType } from './constants';
import { cddFormSchema } from './schema';
import './styles.scss';

const CDD = ({ setAlert, onConfirm, translate: t }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [currentSelectFieldName, setCurrentSelectFieldName] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [frequencyOptions, setFrequencyOptions] = useState([]);
  const [relationshipOptions, setRelationshipOptions] = useState([]);
  const [amountOptions, setAmountOptions] = useState([]);
  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const { requestApi } = useApi();
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(cddFormSchema),
  });

  const [accountReceiveTransferYN, relationship] = watch(['accountReceiveTransferYN', 'relationship']);
  const isReceiveTransfer = accountReceiveTransferYN === '1';
  const isRelationshipOtherSelected = cddRelationshipOthers.includes(relationship);

  const handleOpenSelectCountryBottom = () => {
    setCurrentSelectFieldName('country');
    setSelectBottom({
      type: CDDSelectType.COUNTRY,
      options: countryOptions,
      isShow: true,
      title: t(labels.selectCountry),
    });
  };

  const handleOpenSelectRelationshipBottom = () => {
    setCurrentSelectFieldName('relationship');
    setSelectBottom({
      type: CDDSelectType.RELATIONSHIP,
      options: relationshipOptions,
      isShow: true,
      title: t(labels.selectRelationship),
    });
  };

  const handleOpenSelectAmountBottom = () => {
    setCurrentSelectFieldName('amount');
    setSelectBottom({
      type: CDDSelectType.AMOUNT,
      options: amountOptions,
      isShow: true,
      title: t(labels.selectAmountPerMonth),
    });
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
      code: [
        getExpectedTransferCycleCode,
        getCountryCode,
        getTransferExpectedRelationshipCode,
        getExpectedTransferAmountCode,
      ].join(';'),
    });
    setShowLoading(false);
    if (isSuccess) {
      const {
        [getExpectedTransferCycleCode]: frequency,
        [getCountryCode]: countries,
        [getTransferExpectedRelationshipCode]: relationships,
        [getExpectedTransferAmountCode]: amounts,
      } = data;
      const convertedFrequency = commonCodeDataToOptions(frequency);
      const convertedCountries = commonCodeDataToOptions(countries);
      const convertedRelationships = commonCodeDataToOptions(relationships);
      const convertedAmounts = commonCodeDataToOptions(amounts);
      setCountryOptions(convertedCountries);
      setFrequencyOptions(convertedFrequency);
      setRelationshipOptions(convertedRelationships);
      setAmountOptions(convertedAmounts);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleSubmitForm = async values => {
    setShowLoading(true);
    const {
      accountReceiveTransferYN: cdd_high_amut_ovs_fund_trsf_yn,
      frequency: trsf_expt_prd_c,
      country: trsf_expt_nat_c,
      relationship: trsf_expt_relt_c,
      otherRelationship: trsf_expt_relt_ctt,
      amount: trsf_expt_amt_c,
    } = values;
    let payload = {
      cdd_high_amut_ovs_fund_trsf_yn,
    };
    if (isReceiveTransfer) {
      payload = {
        cdd_high_amut_ovs_fund_trsf_yn,
        trsf_expt_prd_c,
        trsf_expt_nat_c,
        trsf_expt_relt_c,
        trsf_expt_relt_ctt,
        trsf_expt_amt_c,
      };
    }

    const { error, isSuccess, requiredLogin } = await requestApi(endpoints.registerCDD, payload);
    setShowLoading(false);
    if (isSuccess) {
      onConfirm();
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
      <Header
        title={t(menuLabels.openAccount)}
        onClick={moveBack}
      />
      <div className="py-5 answer-cdd__wrapper">
        {showLoading && <Spinner />}
        <div className="page__container">
          <h1 className="page__title">{t(labels.answerQuestionCDD)}</h1>
          <div className="mt-8">
            <div className="form__section__title">{t(labels.cddQuestions)}</div>
            <ul className="mt-4 answer-cdd__questions">
              <li className="mt-4 answer-cdd__desc">{t(labels.willThisAccount)}</li>
            </ul>
            <div className="mt-4">
              <Controller
                render={({ field }) => (
                  <BoxRadio
                    options={accountReceiveLargeTransferOptions}
                    {...field}
                  />
                )}
                control={control}
                name="accountReceiveTransferYN"
              />
            </div>
          </div>
        </div>
        {isReceiveTransfer && (
          <>
            <div className="divider__group mt-6" />
            <div className="page__container pt-5 pb-6">
              <div className="form__section flex-gap-y-12">
                <div className="form__section__title">
                  <span>{t(labels.frequency)}</span>
                </div>
                <Controller
                  render={({ field }) => (
                    <BoxRadio
                      options={frequencyOptions}
                      {...field}
                    />
                  )}
                  control={control}
                  name="frequency"
                />
              </div>
              <div className="divider__item__solid mt-6" />
              <div className="form__section__title pt-5">
                <span>{t(labels.country)}</span>
              </div>
              <div className="mt-4">
                <Controller
                  render={({ field }) => (
                    <Dropdown
                      label={t(labels.selectCountry)}
                      onFocus={handleOpenSelectCountryBottom}
                      options={countryOptions}
                      {...field}
                    />
                  )}
                  control={control}
                  name="country"
                />
              </div>
              <div className="divider__item__solid mt-6" />
              <div className="form__section__title pt-5">
                <span>{t(labels.relationship)}</span>
              </div>
              <div className="mt-4 form__section">
                <Controller
                  render={({ field }) => (
                    <Dropdown
                      label={t(labels.selectRelationship)}
                      onFocus={handleOpenSelectRelationshipBottom}
                      options={relationshipOptions}
                      {...field}
                    />
                  )}
                  control={control}
                  name="relationship"
                />
                {isRelationshipOtherSelected && (
                  <Controller
                    render={({ field }) => (
                      <Input
                        label={t(labels.pleaseEnterRelationship)}
                        maxLength={100}
                        {...field}
                      />
                    )}
                    control={control}
                    name="otherRelationship"
                  />
                )}
              </div>
              <div className="divider__item__solid mt-6" />
              <div className="form__section__title pt-5">
                <span>{t(labels.amountPerMonth)}</span>
              </div>
              <div className="mt-4 form-section">
                <Controller
                  render={({ field }) => (
                    <Dropdown
                      label={t(labels.selectAmountPerMonth)}
                      onFocus={handleOpenSelectAmountBottom}
                      options={amountOptions}
                      {...field}
                    />
                  )}
                  control={control}
                  name="amount"
                />
              </div>
            </div>
          </>
        )}

        <div className="footer__fixed">
          <Button
            label={t(ctaLabels.next)}
            variant="filled__primary"
            className="btn__cta"
            disable={!isValid}
            onClick={handleSubmit(handleSubmitForm)}
          />
        </div>
      </div>

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

export default CDD;
