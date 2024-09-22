import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import Header from '@common/components/organisms/Header';
import TermConditionChecklist from '@common/components/organisms/TermConditionChecklist';
import { initSelectBottom } from '@common/constants/bottomsheet';
import { getProvinceCode } from '@common/constants/commonCode';
import { yupResolver } from '@hookform/resolvers/yup';
import useCommonCode from '@hooks/useCommonCode';
import { commonCodeDataToOptions } from '@utilities/convert';
import { moveBack } from '@utilities/index';

import { ReissueCardDetails, reissueCardTermsConfig } from '../../constants';
import { reissueCardAddressSchema } from './schema';
import './styles.scss';

const EnterReissueAddressInfo = ({ onSubmit, cardInfo, isLogin }) => {
  const { sendRequest: requestGetCommonCode, data: commonCodeData } = useCommonCode();
  const [provinceOptions, setProvinceOptions] = useState([]);
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
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(reissueCardAddressSchema),
  });

  const [isAgreeEmail] = watch(['isAgreeEmail']);

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

  const handleCheckAgreeEmail = checked => {
    setValue('isAgreeEmail', checked, { shouldValidate: true });
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
      <Header
        title="Cards"
        onClick={moveBack}
      />
      <div className="reissue-card-address__wrapper page__form px-0">
        <div className="page__container">
          <h1 className="page__title">Reissue your Access Card</h1>
          {isLogin && (
            <div className="py-4 mt-3">
              <div className="form__section__title">
                <span>Card details</span>
              </div>
              <div className="card__details mt-3">
                {ReissueCardDetails.map(({ label, value }) => (
                  <div
                    className="card__item"
                    key={label}
                  >
                    <span className="card__label">{label}</span>
                    <span className="card__value">{cardInfo?.[value]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form__section py-4">
            {isLogin && (
              <div className="form__section__title">
                <span>Way to receive</span>
              </div>
            )}

            <Controller
              render={({ field }) => (
                <Input
                  label="Street Number"
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
                  type="number"
                  placeholder="Please input 6numerics"
                  {...field}
                />
              )}
              control={control}
              name="postalCode"
            />
            {!isLogin && (
              <>
                <Controller
                  render={({ field }) => (
                    <Input
                      label="Phone Number"
                      placeholder="Please include the '-'."
                      {...field}
                    />
                  )}
                  control={control}
                  name="phoneNumber"
                />
                <Controller
                  render={({ field }) => (
                    <Input
                      label="Email"
                      placeholder="emailname@email.com"
                      {...field}
                    />
                  )}
                  control={control}
                  name="email"
                />
                <InfoBox
                  variant="informative"
                  label="Your email will only be used to send confirmation notifications."
                />
              </>
            )}
          </div>
          {isLogin && (
            <div className="mt-4">
              <InfoBox
                variant="informative"
                label={
                  <>
                    <p>If all the information above is correct, please continue to Activate.</p>
                    <p>If you have any questions, please contact the branch for more information.</p>
                  </>
                }
              />
            </div>
          )}
        </div>
        <div className={`divider__group ${isLogin ? 'mt-8' : 'mt-4'}`} />
        <div className="term-condition__checklist page__container">
          {!isLogin && (
            <div className="agree-use-email">
              <CheckBox
                size="large"
                label="I agree to the use of the email address for sending confirmation email for replacement of Access Card"
                onChange={handleCheckAgreeEmail}
                checked={isAgreeEmail}
              />
            </div>
          )}

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
          label="Reissue"
          variant="filled__primary"
          className="btn__cta"
          onClick={handleSubmit(onSubmit)}
          disable={!isValid || !isAllOptionChecked}
        />
      </div>
      <SelectBottom
        open={selectBottom.isShow}
        onClose={onCloseSelectBottom}
        onSelect={onChangeSelectBottom}
        options={selectBottom.options}
        showArrow
        title={selectBottom.title}
      />
      <ViewTermBottom
        open={viewTermBottom.open}
        onClose={onCloseViewTermBottom}
        title={viewTermBottom.title}
        pdfFile={viewTermBottom.fileUrl}
        onConfirm={handleConfirmTerm}
      />
    </>
  );
};

export default EnterReissueAddressInfo;
