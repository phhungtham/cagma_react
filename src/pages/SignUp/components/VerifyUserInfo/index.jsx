import { useEffect, useState } from 'react';
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
import { getProvinceCode } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { CustomerInfoVerifyType } from '@pages/SignUp/constants';
import { commonCodeDataToOptions } from '@utilities/convert';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import setEkycInfo from '@utilities/gmCommon/setEkycInfo';
import { moveBack } from '@utilities/index';

import VerifyIdInfoBottom from '../VerifyIdInfoBottom';
import { CustomerInfoVerifyErrorCode } from './constants';
import { verifyUserInfoFormSchema } from './schema';

const VerifyUserInfo = ({ onConfirm, navigateToVerifyEmail }) => {
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [showLoading, setShowLoading] = useState(false);
  const [showVerifyIdBottom, setShowVerifyIdBottom] = useState(false);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [showSelectProvinceBottom, setShowSelectProvinceBottom] = useState(initSelectBottom);
  const { requestApi } = useApi();
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
    openCalendar(handleSelectDate, { selectDate: dob || undefined });
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
      title: 'Province',
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

  const handleSubmitVerifyIdInfo = values => {
    console.log('values :>> ', values);
    //TODO: Handle submit
    setShowVerifyIdBottom(false);
  };

  const handleSubmitForm = async values => {
    setShowLoading(true);
    const { dob: cus_bth_y4mm_dt, firstName: fst_nm, lastName: lst_nm, province, house_adr_state_c } = values;
    const payload = {
      cus_bth_y4mm_dt,
      fst_nm,
      lst_nm,
      province,
      house_adr_state_c,
      trx_type: CustomerInfoVerifyType.EKYC,
    };
    const { data, error, isSuccess, errorCode } = await requestApi(endpoints.customerInfoVerify, payload);
    setShowLoading(false);
    if (errorCode === CustomerInfoVerifyErrorCode.NEW) {
      setEkycInfo({
        isEkycProcessing: false,
        email: '',
        userId: '',
        lastName: lst_nm,
        firstName: fst_nm,
        packageId: '',
      });
      navigateToVerifyEmail();
    }
    // setShowVerifyIdBottom(true);
  };

  const requestGetProvinces = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, {
      code: getProvinceCode,
    });
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

  useEffect(() => {
    requestGetProvinces();
  }, []);

  return (
    <>
      {showLoading && <Spinner />}
      <div>
        <Header
          title="Sign up"
          onClick={moveBack}
        />
        <div className="page__form">
          <div className="page__title">
            <p>Welcome to</p>
            <p>Shinhan SOL!</p>
          </div>
          <div className="mt-4">
            <InfoBox
              variant="informative"
              label="Please write your name as it is found on your government-issued identification. Note: The Quebec region is not supported."
            />
          </div>
          <div className="form__section mt-4">
            {/* //TODO: Call Character Security Keyboard */}
            <Controller
              render={({ field }) => (
                <Input
                  label="First Name"
                  {...field}
                />
              )}
              control={control}
              name="firstName"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label="Last Name"
                  {...field}
                />
              )}
              control={control}
              name="lastName"
            />
            <Controller
              render={({ field: { value } }) => (
                <InputDate
                  label="Date of birth"
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
                  label="Province"
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
            label="Next"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(handleSubmitForm)}
            disable={!isValid}
          />
        </div>
      </div>
      {showVerifyIdBottom && (
        <VerifyIdInfoBottom
          open={showVerifyIdBottom}
          onClose={() => setShowVerifyIdBottom(false)}
          onSubmit={handleSubmitVerifyIdInfo}
        />
      )}
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        onClose={handleCloseAlert}
        textAlign="left"
        firstButton={{
          onClick: handleCloseAlert,
          label: 'Confirm',
        }}
      />
      <SelectBottom
        open={showSelectProvinceBottom.isShow}
        onClose={handleCloseSelectProvinceBottom}
        onSelect={handleChangeProvince}
        options={showSelectProvinceBottom.options}
        showArrow
        title={showSelectProvinceBottom.title}
      />
    </>
  );
};

export default VerifyUserInfo;
