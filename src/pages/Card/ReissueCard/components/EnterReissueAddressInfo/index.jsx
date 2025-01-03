import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import Header from '@common/components/organisms/Header';
import TermConditionChecklist from '@common/components/organisms/TermConditionChecklist';
import { addressTypeMapping } from '@common/constants/address';
import { initSelectBottom } from '@common/constants/bottomsheet';
import { reissueCardLabels as labels, menuLabels } from '@common/constants/labels';
import {
  invalidNameRegex,
  notAllowAlphabetRegex,
  notAllowNumberAlphabetRegex,
  postalCodeNotAllowRegex,
} from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import { buildObjectMapFromResponse } from '@utilities/convert';
import { moveBack } from '@utilities/index';

import { mailingAddressFormMapFields, reissueCardDetails, reissueCardTermsConfig } from '../../constants';
import { reissueCardAddressSchema } from './schema';
import './styles.scss';

const EnterReissueAddressInfo = ({ onSubmit, cardInfo, provinceOptions, userInfo, translate: t }) => {
  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const [viewTermBottom, setViewTermBottom] = useState({
    open: false,
    title: '',
    fileUrl: '',
    value: '',
  });
  const [checkedOptions, setCheckedOptions] = useState([]);
  const isAllOptionChecked = checkedOptions?.length === reissueCardTermsConfig.options.length;
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
    reset,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(reissueCardAddressSchema),
  });

  const handleOpenSelectProvinceBottom = () => {
    setSelectBottom({
      type: '',
      options: provinceOptions,
      isShow: true,
      title: t(labels.province),
    });
  };

  const onCloseSelectBottom = () => {
    setSelectBottom(initSelectBottom);
  };

  const onChangeSelectBottom = item => {
    const value = item.value;
    setValue('province', value, { shouldValidate: true });
    onCloseSelectBottom();
  };

  const handleCheckOption = (value, checked) => {
    if (checked) {
      setCheckedOptions([...checkedOptions, value]);
    } else {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    }
  };

  const onClickViewTermDetail = value => {
    const termItem = reissueCardTermsConfig.options.find(item => item.value === value);
    const { fileUrl, title } = termItem;
    setViewTermBottom({
      open: true,
      fileUrl,
      title,
      value,
    });
  };

  const handleCheckAll = checked => {
    if (checked) {
      setCheckedOptions(reissueCardTermsConfig.options.map(option => option.value));
    } else {
      setCheckedOptions([]);
    }
  };

  const handleConfirmTerm = () => {
    const checkedValue = viewTermBottom.value;
    if (!checkedOptions.includes(checkedValue)) {
      setCheckedOptions([...checkedOptions, checkedValue]);
    }
    onCloseViewTermBottom();
  };

  const onCloseViewTermBottom = () => {
    setViewTermBottom({ ...viewTermBottom, open: false });
  };

  const handleSubmitReissue = values => {
    onSubmit({ ...values, provinceOptions });
  };

  useEffect(() => {
    if (userInfo) {
      const defaultAddress = (userInfo?.r_CAME001_1Vo || []).find(
        item => String(item.cus_adr_t) === addressTypeMapping.home
      );
      const mailingAddressDefaultValue = buildObjectMapFromResponse(defaultAddress, mailingAddressFormMapFields);
      reset(mailingAddressDefaultValue);
    }
  }, [userInfo]);

  return (
    <>
      <Header
        title={t(menuLabels.accessCardService)}
        onClick={moveBack}
      />
      <div className="reissue-card-address__wrapper h-screen__content px-0">
        <div className="page__container">
          <h1 className="page__title">{t(labels.reissueYourCard)}</h1>
          <div className="py-4 mt-3">
            <div className="form__section__title">
              <span>{t(labels.cardDetails)}</span>
            </div>
            <div className="card__details mt-3">
              {reissueCardDetails.map(({ label, value }) => (
                <div
                  className="card__item"
                  key={label}
                >
                  <span className="card__label">{t(label)}</span>
                  <span className="card__value">{cardInfo?.[value]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form__section pt-4 flex-gap-y-12">
            <div className="form__section__title">
              <span>{t(labels.mailingAddress)}</span>
            </div>

            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.streetNumber)}
                  placeholder="Please input Detail text"
                  maxLength={60}
                  regex={notAllowNumberAlphabetRegex}
                  {...field}
                />
              )}
              control={control}
              name="streetNumber"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.streetName)}
                  placeholder="Please input Detail text"
                  regex={invalidNameRegex}
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
                    label={t(labels.aptNumber)}
                    placeholder="Please input Detail text"
                    maxLength={40}
                    regex={notAllowNumberAlphabetRegex}
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
                  label={t(labels.city)}
                  placeholder="Please input Detail text"
                  regex={notAllowAlphabetRegex}
                  maxLength={200}
                  {...field}
                />
              )}
              control={control}
              name="city"
            />
            <Controller
              render={({ field }) => (
                <Dropdown
                  label={t(labels.province)}
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
                  label={t(labels.postalCode)}
                  regex={postalCodeNotAllowRegex}
                  placeholder=""
                  maxLength={6}
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
        </div>
        <div className="divider__group mt-8" />
        <div className="term-condition__checklist page__container">
          <TermConditionChecklist
            config={reissueCardTermsConfig}
            onClickViewTerm={onClickViewTermDetail}
            onCheckOption={handleCheckOption}
            onCheckAll={handleCheckAll}
            checkedOptions={checkedOptions}
          />
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label={t(labels.reissueBtn)}
          variant="filled__primary"
          className="btn__cta"
          onClick={handleSubmit(handleSubmitReissue)}
          disable={!isValid || !isAllOptionChecked}
        />
      </div>
      <SelectBottom
        open={selectBottom.isShow}
        onClose={onCloseSelectBottom}
        onSelect={onChangeSelectBottom}
        options={selectBottom.options}
        title={selectBottom.title}
      />
      {viewTermBottom.open && (
        <ViewTermBottom
          open={viewTermBottom.open}
          onClose={onCloseViewTermBottom}
          title={viewTermBottom.title}
          pdfFile={viewTermBottom.fileUrl}
          onConfirm={handleConfirmTerm}
        />
      )}
    </>
  );
};

export default EnterReissueAddressInfo;
