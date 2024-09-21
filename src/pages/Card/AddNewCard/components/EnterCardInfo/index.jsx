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
import { yupResolver } from '@hookform/resolvers/yup';
import useCommonCode from '@hooks/useCommonCode';
import { commonCodeDataToOptions } from '@utilities/convert';
import { moveBack } from '@utilities/index';

import { enterCardFormSchema } from './schema';
import './styles.scss';

const EnterCardInfo = ({ onSubmit }) => {
  const { sendRequest: requestGetCommonCode, data: commonCodeData } = useCommonCode();
  const [showMyAccountsBottom, setShowMyAccountBottom] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState();
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [selectBottom, setSelectBottom] = useState(initSelectBottom);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(enterCardFormSchema),
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

  useEffect(() => {
    if (commonCodeData) {
      const { state_c: provinces } = commonCodeData || {};
      const convertedProvince = commonCodeDataToOptions(provinces);
      setProvinceOptions(convertedProvince);
    }
  }, [commonCodeData]);

  useEffect(() => {
    requestGetCommonCode(getProvinceCode);
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
                value={selectedAccount?.dep_ac_alnm_nm}
              >
                {selectedAccount ? (
                  <div className="text-dropdown__sub">
                    <span>{selectedAccount?.lcl_ac_no_display}</span>
                    <span>${selectedAccount?.def_ac_blc_display}</span>
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
                <span>Way to receive</span>
              </div>
              <Controller
                render={({ field }) => (
                  <Input
                    label="Street Number"
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

export default EnterCardInfo;
