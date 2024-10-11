import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import Input from '@common/components/atoms/Input/Input';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { initSelectBottom } from '@common/constants/bottomsheet';
import { getProvinceCode } from '@common/constants/commonCode';
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
  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const [accounts, setAccounts] = useState([]);
  const { requestApi } = useApi();

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(newCardFormSchema),
  });

  const onOpenMyAccountBottom = () => {
    setShowMyAccountBottom(true);
  };

  const onSelectAccount = account => {
    setValue('accountNo', account.lcl_ac_no, { shouldValidate: true });
    setSelectedAccount(account);
    setShowMyAccountBottom(false);
  };

  const handleOpenSelectProvinceBottom = () => {
    setSelectBottom({
      type: '',
      options: provinceOptions,
      isShow: true,
      title: 'Province',
    });
  };

  const onCloseSelectBottom = () => {
    setSelectBottom(initSelectBottom);
  };

  const onChangeSelectBottom = item => {
    const value = item.value;
    setValue('province', value);
    onCloseSelectBottom();
  };

  const onSubmitAddNewCard = values => {
    onSubmit(values);
  };

  const requestGetProvinces = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, { code: getProvinceCode });
    setShowLoading(false);
    if (isSuccess) {
      const { state_c: provinces } = data || {};
      const convertedProvince = commonCodeDataToOptions(provinces);
      setProvinceOptions(convertedProvince);
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
    requestGetAccounts();
  }, []);

  return (
    <>
      <div className="enter-card__wrapper">
        <Header
          title="Cards"
          onClick={moveBack}
        />
        <div className="enter-card__container">
          <div className="page__container">
            <h1 className="page__title">Get your NEW Access Card</h1>
            <section className="my-4">
              <TextDropdown
                label="Linked to"
                placeholder="Select"
                onClick={onOpenMyAccountBottom}
                value={selectedAccount?.name}
              >
                {selectedAccount ? (
                  <div className="text-dropdown__sub">
                    <span>{selectedAccount?.number}</span>
                    <span>${selectedAccount?.balance}</span>
                  </div>
                ) : (
                  <></>
                )}
              </TextDropdown>
            </section>
          </div>
          <div className="divider__group" />
          <div className="enter-card__form form__wrapper">
            <div className="form__section">
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
                    onFocus={handleOpenSelectProvinceBottom}
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
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label="Get a New Card"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(onSubmitAddNewCard)}
            disable={!isValid}
          />
        </div>
      </div>
      <MyAccountsBottom
        open={showMyAccountsBottom}
        onClose={() => setShowMyAccountBottom(false)}
        onSelect={onSelectAccount}
        accounts={accounts}
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

export default EnterNewCardInfo;
