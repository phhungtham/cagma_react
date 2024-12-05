import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Spinner from '@common/components/atoms/Spinner';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { initSelectBottom } from '@common/constants/bottomsheet';
import { getCanadaProvinceCode } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, signUpWelcomeLabels as labels, menuLabels } from '@common/constants/labels';
import { invalidNameRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import useMove from '@hooks/useMove';
import { SignUpContext } from '@pages/SignUp';
import { CustomerInfoVerifyType, VerifyMembershipResultStatus } from '@pages/SignUp/constants';
import { commonCodeDataToOptions } from '@utilities/convert';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import clearEkycInfo from '@utilities/gmCommon/clearEkycInfo';
import openCalendar from '@utilities/gmCommon/openCalendar';
import dayjs from 'dayjs';

import { CustomerInfoVerifyErrorCode } from './constants';
import { verifyUserInfoFormSchema } from './schema';

const VerifyUserInfo = ({ navigateToVerifyResult, navigateToVerifyEmail }) => {
  const { ekycCached, setEkycToNativeCache, translate: t } = useContext(SignUpContext);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [showLoading, setShowLoading] = useState(false);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [showSelectProvinceBottom, setShowSelectProvinceBottom] = useState(initSelectBottom);
  const { requestApi } = useApi();
  const { moveBackNative } = useMove();
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(verifyUserInfoFormSchema),
  });
  const [dob] = watch(['dob']);

  const handleSelectDate = selectedDate => {
    if (selectedDate) {
      setValue('dob', selectedDate, { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay(selectedDate), { shouldValidate: true });
    }
  };

  const handleOpenCalendar = () => {
    const maxDate = dayjs().subtract(1, 'day').format('YYYYMMDD');
    openCalendar(handleSelectDate, { selectDate: dob || maxDate, endDate: maxDate });
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  const handleOpenSelectProvinceBottom = () => {
    setShowSelectProvinceBottom({
      type: '',
      options: provinceOptions,
      isShow: true,
      title: t(labels.province),
    });
  };

  const handleCloseSelectProvinceBottom = () => {
    setShowSelectProvinceBottom(initSelectBottom);
  };

  const handleChangeProvince = item => {
    const value = item.value;
    setValue('province', value, { shouldValidate: true });
    handleCloseSelectProvinceBottom();
  };

  const handleSubmitForm = async values => {
    setShowLoading(true);
    const { dob: cus_bth_y4mm_dt, firstName: fst_nm, lastName: lst_nm, province } = values;
    const payload = {
      cus_bth_y4mm_dt,
      fst_nm,
      lst_nm,
      house_adr_state_c: province,
      trx_type: CustomerInfoVerifyType.EKYC,
    };
    const { errorCode, data, isSuccess, error } = await requestApi(endpoints.customerInfoVerify, payload);
    setShowLoading(false);
    setEkycToNativeCache({
      ...ekycCached,
      isEkycProcessing: false,
      email: '',
      userId: '',
      lastName: lst_nm,
      firstName: fst_nm,
      packageId: '',
    });
    if (isSuccess) {
      const { result_cd, intbnk_reg_yn: isRegisterInternetBanking } = data;
      if (Number(result_cd) === 1) {
        if (isRegisterInternetBanking === 'Y') {
          return navigateToVerifyResult(VerifyMembershipResultStatus.ALREADY_INDIVIDUAL);
        } else {
          return navigateToVerifyEmail();
        }
      }
    }
    if (errorCode === CustomerInfoVerifyErrorCode.NEW) {
      return navigateToVerifyEmail();
    } else if (errorCode === CustomerInfoVerifyErrorCode.CORPORATE_CUSTOMER) {
      return navigateToVerifyResult(VerifyMembershipResultStatus.ALREADY_CORPORATE);
    } else if (errorCode === CustomerInfoVerifyErrorCode.ERROR) {
      return navigateToVerifyResult(VerifyMembershipResultStatus.FAILED);
    } else {
      setAlert({
        isShow: true,
        title: '',
        content: error,
      });
    }
  };

  const requestGetProvinces = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, {
      code: getCanadaProvinceCode,
    });
    setShowLoading(false);
    if (isSuccess) {
      const { ca_state_c: provinces } = data || {};
      const convertedProvince = commonCodeDataToOptions(provinces);
      setProvinceOptions(convertedProvince);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };
  const handleClickBack = () => {
    clearEkycInfo();
    moveBackNative();
  };

  useEffect(() => {
    requestGetProvinces();
  }, []);

  return (
    <>
      {showLoading && <Spinner />}
      <div>
        <Header
          title={t(menuLabels.signUp)}
          disabledMoveBack
          onClickBack={handleClickBack}
        />
        <div className="page__form">
          <div className="page__title">
            <p>{t(labels.welcome)}</p>
          </div>
          <div className="mt-4">
            <InfoBox
              variant="informative"
              label={t(labels.pleaseWriteYourName)}
            />
          </div>
          <div className="form__section mt-4">
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.firstName)}
                  maxLength={20}
                  regex={invalidNameRegex}
                  {...field}
                />
              )}
              control={control}
              name="firstName"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.lastName)}
                  maxLength={20}
                  regex={invalidNameRegex}
                  {...field}
                />
              )}
              control={control}
              name="lastName"
            />
            <Controller
              render={({ field: { value } }) => (
                <InputDate
                  label={t(labels.dob)}
                  onFocus={handleOpenCalendar}
                  value={value}
                />
              )}
              control={control}
              name="dob_display"
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
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label={t(labels.next)}
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(handleSubmitForm)}
            disable={!isValid}
          />
        </div>
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        onClose={handleCloseAlert}
        textAlign="left"
        firstButton={{
          onClick: handleCloseAlert,
          label: t(ctaLabels.confirm),
        }}
      />
      <SelectBottom
        open={showSelectProvinceBottom.isShow}
        onClose={handleCloseSelectProvinceBottom}
        onSelect={handleChangeProvince}
        options={showSelectProvinceBottom.options}
        title={showSelectProvinceBottom.title}
      />
    </>
  );
};

export default VerifyUserInfo;
