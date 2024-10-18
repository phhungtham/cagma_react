import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import ChequingIcon from '@assets/images/icon-fill-chequing.png';
import SavingIcon from '@assets/images/icon-fill-saving-40.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { initSelectBottom } from '@common/constants/bottomsheet';
import { getCardAreaProvinceCode, getProvinceCode } from '@common/constants/commonCode';
import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { commonCodeDataToOptions } from '@utilities/convert';
import { moveBack } from '@utilities/index';

import { newCardFormSchema } from './schema';
import './styles.scss';

const EnterNewCardInfo = ({ onSubmit, setShowLoading, setAlert }) => {
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
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(newCardFormSchema),
  });

  const [applyContactless, getTransactionNotice] = watch(['applyContactless', 'getTransactionNotice']);

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
      title: 'Province',
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
      code: [getProvinceCode, getCardAreaProvinceCode].join(';'),
    });
    setShowLoading(false);
    if (isSuccess) {
      const { state_c: provinces, ca_cashcd_use_regn_d: areaProvinces } = data || {};
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
    const { data, error, isSuccess } = await requestApi(endpoints.getAccountList);
    setShowLoading(false);
    if (isSuccess) {
      const { cus_acno_list: accountList } = data || {};
      let newAccounts = (accountList || []).map(item => {
        return {
          ...item,
          name: item.dep_ac_alnm_nm,
          number: item.lcl_ac_no_display,
          balance: item.def_ac_blc_display,
        };
      });
      const filteredAccounts = newAccounts.filter(
        account => account.dep_sjt_class === DepositSubjectClass.REGULAR_SAVING
      );
      if (filteredAccounts?.length) {
        handleSelectAccount(filteredAccounts[0]);
      }
      setAccounts(filteredAccounts);
      requestGetProvinces();
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  useEffect(() => {
    const defaultContactlessValue = applyContactless ? '250' : '';
    setValue('contactlessPerTransaction', defaultContactlessValue);
    setValue('totalContactless', defaultContactlessValue);
  }, [applyContactless]);

  useEffect(() => {
    requestGetAccounts();
  }, []);

  return (
    <>
      <div className="enter-card__wrapper">
        <Header
          title="Access Card Service"
          onClick={moveBack}
        />
        <div className="enter-card__container">
          <div className="page__container">
            <h1 className="page__title">Get your NEW Access Card</h1>
            <div className="box__details my-4">
              {/* //TODO: Pending to waiting BE return limit amount */}
              <div className="box__item">
                <span className="box__label">The Limit of the daily card</span>
                <span className="box__value">$00,000.00</span>
              </div>
              <div className="box__item">
                <span className="box__label">Daily POS Limit Amount</span>
                <span className="box__value">$00,000.00</span>
              </div>
            </div>
          </div>
          <div className="divider__group" />
          <div className="enter-card__form form__wrapper">
            <div className="form__section mt-2">
              <div className="form__section__title">
                <span>Linked Account</span>
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
            <div className="form__section mt-6">
              <div className="form__section__title">
                <span>Mailing address</span>
              </div>
              <Controller
                render={({ field }) => (
                  <Input
                    label="Street Number"
                    maxLength={100}
                    placeholder="Please input Detail text"
                    {...field}
                  />
                )}
                control={control}
                name="streetNumber"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="Street Name"
                    maxLength={100}
                    placeholder="Please input Detail text"
                    {...field}
                  />
                )}
                control={control}
                name="streetName"
              />
              <Controller
                render={({ field }) => {
                  return (
                    <Input
                      label="APT Number/SUITE Number"
                      maxLength={100}
                      placeholder="Please input Detail text"
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
                    label="City"
                    maxLength={50}
                    placeholder="Please input Detail text"
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
                    label="Postal Code"
                    maxLength={110}
                    placeholder="Please input 6numerics"
                    {...field}
                  />
                )}
                control={control}
                name="postalCode"
              />
            </div>
            <div className="form__section mt-6">
              <div className="form__section__title">
                <span>Use Area Information</span>
              </div>
              <Controller
                render={({ field }) => (
                  <Dropdown
                    label="Province"
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
              <div className="form__section mt-4">
                <Controller
                  render={({ field }) => (
                    <CheckBox
                      size="large"
                      label="Apply for Contactless"
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
                          label="Contactless per Transaction(CAD)"
                          placeholder=""
                          type="number"
                          maxLength={22}
                          {...field}
                          onChange={value => {
                            if (!Number(value)) {
                              field.onChange('');
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
                          label="Total Contactless(CAD)"
                          placeholder=""
                          type="number"
                          maxLength={22}
                          {...field}
                          onChange={value => {
                            if (!Number(value)) {
                              field.onChange('');
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
              <div className="form__section mt-4">
                <Controller
                  render={({ field }) => (
                    <CheckBox
                      size="large"
                      label="Get a Transaction Notice"
                      {...field}
                      checked={field.value}
                    />
                  )}
                  control={control}
                  name="getTransactionNotice"
                />
                {/* //TODO: Call APi CAME001 and set email to default value */}
                {getTransactionNotice && (
                  <Controller
                    render={({ field }) => (
                      <Input
                        label="Email Address"
                        maxLength={40}
                        placeholder=""
                        {...field}
                      />
                    )}
                    control={control}
                    name="email"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label="Get a New Card"
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
        showArrow
        title={selectBottom.title}
      />
    </>
  );
};

export default EnterNewCardInfo;
