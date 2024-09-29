import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Alert from '@common/components/molecules/Alert';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { initSelectBottom } from '@common/constants/bottomsheet';
import { isDevelopmentEnv } from '@common/constants/common';
import { getProvinceCode } from '@common/constants/commonCode';
import { yupResolver } from '@hookform/resolvers/yup';
import useCommonCode from '@hooks/useCommonCode';
import { commonCodeDataToOptions } from '@utilities/convert';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import { moveBack } from '@utilities/index';

import VerifyIdInfoBottom from '../VerifyIdInfoBottom';
import { verifyUserInfoFormSchema } from './schema';

const VerifyUserInfo = ({ onConfirm }) => {
  const { sendRequest: requestGetCommonCode, data: commonCodeData } = useCommonCode();
  const [showAlert, setShowAlert] = useState({
    isShow: false,
    title: '',
    subTitle: '',
  });
  const [showVerifyIdBottom, setShowVerifyIdBottom] = useState(false);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [showSelectProvinceBottom, setShowSelectProvinceBottom] = useState(initSelectBottom);
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
    if (isDevelopmentEnv) {
      //For dummy data because it call native calendar
      setValue('dob', '19980523', { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay('19980523'), { shouldValidate: true });
    }
    openCalendar(handleSelectDate, { selectDate: dob || undefined });
  };

  const handleCloseAlert = () => {
    setShowAlert({
      ...showAlert,
      isShow: false,
    });
    onConfirm();
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
    onConfirm(values);
  };

  const handleSubmitForm = values => {
    //TODO: Check date valid or not
    //TODO: Just for test Publishing
    setShowVerifyIdBottom(true);
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
        isShowAlert={showAlert.isShow}
        title={showAlert.title}
        subtitle={showAlert.subTitle}
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
