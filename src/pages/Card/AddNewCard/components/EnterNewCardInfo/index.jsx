import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import ChequingIcon from '@assets/images/icon-fill-chequing-40.png';
import SavingIcon from '@assets/images/icon-fill-saving-40.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { initSelectBottom } from '@common/constants/bottomsheet';
import { getCanadaProvinceCode, getCardAreaProvinceCode } from '@common/constants/commonCode';
import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import { cardLabels, commonLabels, ctaLabels, menuLabels } from '@common/constants/labels';
import {
  invalidCityRegex,
  invalidNameRegex,
  notAllowNumberRegex,
  notAllowSpaceRegex,
  postalCodeNotAllowRegex,
} from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { commonCodeDataToOptions } from '@utilities/convert';
import { moveBack } from '@utilities/index';

import { newCardMaxContactless } from '../../constants';
import { newCardFormSchema } from './schema';
import './styles.scss';

const EnterNewCardInfo = ({ onSubmit, setShowLoading, setAlert, email, translate: t }) => {
  const [showMyAccountsBottom, setShowMyAccountBottom] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState();
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [areaProvinceOptions, setAreaProvinceOptions] = useState([]);
  const [currentProvinceFieldName, setCurrentProvinceFieldName] = useState();
  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const [accounts, setAccounts] = useState([]);
  const { requestApi } = useApi();

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(newCardFormSchema),
    defaultValues: {
      applyContactless: true,
    },
  });

  const [applyContactless, getTransactionNotice, totalContactless] = watch([
    'applyContactless',
    'getTransactionNotice',
    'totalContactless',
  ]);

  const handleOpenMyAccountBottom = () => {
    setShowMyAccountBottom(true);
  };

  const handleSelectAccount = account => {
    setValue('accountNo', account.lcl_ac_no, { shouldValidate: true });
    setSelectedAccount(account);
    setShowMyAccountBottom(false);
  };

  const handleOpenSelectProvinceBottom = fieldName => {
    setCurrentProvinceFieldName(fieldName);
    const options = fieldName === 'province' ? provinceOptions : areaProvinceOptions;
    setSelectBottom({
      type: '',
      options: options,
      isShow: true,
      title: t(cardLabels.province),
    });
  };

  const handleCloseSelectBottom = () => {
    setSelectBottom(initSelectBottom);
  };

  const handleChangeSelectBottom = item => {
    const value = item.value;
    setValue(currentProvinceFieldName, value, { shouldValidate: true });
    handleCloseSelectBottom();
  };

  const RenderAccountIcon = () => {
    if (!selectedAccount) {
      return;
    }
    let icon = SavingIcon;
    const { casol_prdt_c_display } = selectedAccount;
    if (casol_prdt_c_display === 'Chequing') {
      icon = ChequingIcon;
    }

    return (
      <div className="account-icon">
        <img
          src={icon}
          alt="account icon"
        />
      </div>
    );
  };

  const handleSubmitAddNewCard = values => {
    onSubmit({ ...values, provinceOptions });
  };

  const requestGetProvinces = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, {
      code: [getCanadaProvinceCode, getCardAreaProvinceCode].join(';'),
    });
    setShowLoading(false);
    if (isSuccess) {
      const { ca_state_c: provinces, ca_cashcd_use_regn_d: areaProvinces } = data || {};
      const convertedProvince = commonCodeDataToOptions(provinces);
      const convertedAreaProvince = commonCodeDataToOptions(areaProvinces);
      setProvinceOptions(convertedProvince);
      setAreaProvinceOptions(convertedAreaProvince);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestGetAccounts = async () => {
    setShowLoading(true);
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.getAccountList);
    setShowLoading(false);
    if (isSuccess) {
      const accountKindDepositWithDrawal = '01';
      const { cus_acno_list: totalAccountList = [], homeAccountList = [] } = data || {};
      const withdrawalDepositAccountNumbers = homeAccountList
        .filter(account => account.ac_k_cd === accountKindDepositWithDrawal)
        .map(account => account.acno);

      const filteredAccounts = totalAccountList.reduce((result, account) => {
        if (
          withdrawalDepositAccountNumbers.includes(account.lcl_ac_no) &&
          account.dep_sjt_class === DepositSubjectClass.REGULAR_SAVING
        ) {
          result.push({
            ...account,
            name: account.dep_ac_alnm_nm,
            number: account.lcl_ac_no_display,
            balance: account.pabl_blc_display,
          });
        }
        return result;
      }, []);

      if (filteredAccounts?.length) {
        handleSelectAccount(filteredAccounts[0]);
      }
      setAccounts(filteredAccounts);
      requestGetProvinces();
    } else {
      setAlert({
        isShow: true,
        title: '',
        content: error,
        requiredLogin,
      });
    }
  };

  useEffect(() => {
    if (email) {
      setValue('email', email);
    }
  }, [email]);

  useEffect(() => {
    const defaultContactlessValue = applyContactless ? newCardMaxContactless : '';
    setValue('contactlessPerTransaction', defaultContactlessValue, { shouldValidate: true });
    setValue('totalContactless', defaultContactlessValue, { shouldValidate: true });
  }, [applyContactless]);

  useEffect(() => {
    requestGetAccounts();
  }, []);

  return (
    <>
      <div className="enter-card__wrapper">
        <Header
          title={t(menuLabels.accessCardService)}
          onClick={moveBack}
        />
        <div className="enter-card__container">
          <div className="page__container">
            <h1 className="page__title">{t(cardLabels.getNewAccessCard2)}</h1>
            <div className="box__details my-4">
              <div className="box__item">
                <span className="box__label">{t(cardLabels.limitDailyCard)}</span>
                <span className="box__value">$1,000.00</span>
              </div>
              <div className="box__item">
                <span className="box__label">{t(cardLabels.dailyPosAmount)}</span>
                <span className="box__value">$519.00</span>
              </div>
            </div>
          </div>
          <div className="divider__group" />
          <div className="enter-card__form form__wrapper">
            <div className="form__section flex-gap-y-12 mt-2">
              <div className="form__section__title">
                <span>{t(cardLabels.linkedAccount)}</span>
              </div>
              <Dropdown
                label="Account"
                clazz="account-dropdown"
                onFocus={handleOpenMyAccountBottom}
                value={selectedAccount?.name}
                startAdornment={<RenderAccountIcon />}
              >
                {selectedAccount ? <div className="account-number">{selectedAccount?.number}</div> : ''}
              </Dropdown>
            </div>
            <div className="form__section mt-6 flex-gap-y-12">
              <div className="form__section__title">
                <span>{t(cardLabels.mailingAddress)}</span>
              </div>
              <Controller
                render={({ field }) => (
                  <Input
                    label={t(cardLabels.streetNumber)}
                    maxLength={100}
                    placeholder="Please input Detail text"
                    inputMode="numeric"
                    type="text"
                    regex={notAllowNumberRegex}
                    {...field}
                  />
                )}
                control={control}
                name="streetNumber"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label={t(cardLabels.streetName)}
                    maxLength={100}
                    placeholder="Please input Detail text"
                    regex={invalidNameRegex}
                    {...field}
                    onChange={value => {
                      if (value) {
                        value = value.replace(/- -|--+/g, '-');
                      }
                      field.onChange(value);
                    }}
                  />
                )}
                control={control}
                name="streetName"
              />
              <Controller
                render={({ field }) => {
                  return (
                    <Input
                      label={t(cardLabels.aptNumber)}
                      maxLength={100}
                      placeholder="Please input Detail text"
                      inputMode="numeric"
                      type="text"
                      regex={notAllowNumberRegex}
                      {...field}
                    />
                  );
                }}
                control={control}
                name="aptNumber"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label={t(cardLabels.city)}
                    maxLength={50}
                    placeholder="Please input Detail text"
                    regex={invalidCityRegex}
                    {...field}
                  />
                )}
                control={control}
                name="city"
              />
              <Controller
                render={({ field }) => (
                  <Dropdown
                    label={t(cardLabels.province)}
                    onFocus={() => handleOpenSelectProvinceBottom('province')}
                    options={provinceOptions}
                    {...field}
                  />
                )}
                control={control}
                name="province"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label={t(cardLabels.postalCode)}
                    maxLength={6}
                    placeholder=""
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
            </div>
            <div className="form__section mt-6 flex-gap-y-12">
              <div className="form__section__title">
                <span>{t(cardLabels.useAreaInformation)}</span>
              </div>
              <Controller
                render={({ field }) => (
                  <Dropdown
                    label={t(cardLabels.province2)}
                    onFocus={() => handleOpenSelectProvinceBottom('areaProvince')}
                    options={areaProvinceOptions}
                    {...field}
                  />
                )}
                control={control}
                name="areaProvince"
              />
            </div>
            <div className="divider__item__solid mt-5" />
            <div className="mt-4">
              <div className="form__section mt-4 flex-gap-y-12">
                <Controller
                  render={({ field }) => (
                    <CheckBox
                      size="large"
                      label={t(cardLabels.applyContactless)}
                      {...field}
                      checked={field.value}
                    />
                  )}
                  control={control}
                  name="applyContactless"
                />
                {applyContactless && (
                  <>
                    <Controller
                      render={({ field }) => (
                        <Input
                          label={t(cardLabels.contactlessPerTransaction)}
                          placeholder=""
                          inputMode="numeric"
                          type="text"
                          regex={notAllowNumberRegex}
                          maxLength={22}
                          {...field}
                          onChange={value => {
                            const numberValue = Number(value);
                            if (!numberValue) {
                              field.onChange('');
                            } else if (
                              numberValue > Number(newCardMaxContactless) ||
                              (totalContactless && numberValue > Number(totalContactless))
                            ) {
                              if (totalContactless) {
                                field.onChange(totalContactless);
                              } else {
                                field.onChange(newCardMaxContactless);
                              }
                            } else {
                              field.onChange(value);
                            }
                          }}
                        />
                      )}
                      control={control}
                      name="contactlessPerTransaction"
                    />
                    <Controller
                      render={({ field }) => (
                        <Input
                          label={t(cardLabels.totalContactless)}
                          placeholder=""
                          inputMode="numeric"
                          type="text"
                          regex={notAllowNumberRegex}
                          maxLength={22}
                          {...field}
                          onChange={value => {
                            const numberValue = Number(value);
                            if (!numberValue) {
                              field.onChange('');
                            } else if (numberValue > Number(newCardMaxContactless)) {
                              field.onChange(newCardMaxContactless);
                            } else {
                              field.onChange(value);
                            }
                          }}
                        />
                      )}
                      control={control}
                      name="totalContactless"
                    />
                  </>
                )}
              </div>
            </div>
            <div className="mt-4">
              <div className="form__section mt-4 flex-gap-y-12">
                <Controller
                  render={({ field }) => (
                    <CheckBox
                      size="large"
                      label={t(cardLabels.getTransactionNotice)}
                      {...field}
                      checked={field.value}
                    />
                  )}
                  control={control}
                  name="getTransactionNotice"
                />

                <Controller
                  render={({ field }) => (
                    <Input
                      label={t(cardLabels.emailAddress)}
                      maxLength={40}
                      placeholder=""
                      regex={notAllowSpaceRegex}
                      clazz={getTransactionNotice ? '' : 'hidden'}
                      errorMessage={errors?.email?.type === 'matches' ? t(commonLabels.invalidEmailFormat) : ''}
                      {...field}
                    />
                  )}
                  control={control}
                  name="email"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label={t(ctaLabels.getNewCard)}
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(handleSubmitAddNewCard)}
            disable={!isValid}
          />
        </div>
      </div>
      <MyAccountsBottom
        open={showMyAccountsBottom}
        onClose={() => setShowMyAccountBottom(false)}
        onSelect={handleSelectAccount}
        accounts={accounts}
      />
      <SelectBottom
        open={selectBottom.isShow}
        onClose={handleCloseSelectBottom}
        onSelect={handleChangeSelectBottom}
        options={selectBottom.options}
        title={selectBottom.title}
      />
    </>
  );
};

export default EnterNewCardInfo;
