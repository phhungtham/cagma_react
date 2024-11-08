import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FillEyeOffIcon, FillEyeOnIcon } from '@assets/icons';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { endpoints } from '@common/constants/endpoint';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import showCertificationChar from '@utilities/gmSecure/showCertificationChar';
import { moveBack } from '@utilities/index';

import { createIdFormSchema } from './schema';
import './styles.scss';

const SignUpCreatePassword = ({ onConfirm }) => {
  const { deviceId, userId, setEkycToNativeCache, ekycCached } = useContext(SignUpContext);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [currentFieldName, setCurrentFieldName] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { requestApi } = useApi();
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(createIdFormSchema),
  });

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  const handleChangePassword = result => {
    const { uniqueValue: value, e2e } = result;
    setValue(currentFieldName, value, { shouldValidate: true });
    setValue('e2e', e2e, { shouldValidate: true });
  };

  const handleOpenSecurityKeyboard = fieldName => {
    setCurrentFieldName(fieldName);
    showCertificationChar(handleChangePassword);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmitForm = async values => {
    setShowLoading(true);
    const payload = {
      uuid_v: deviceId,
      cus_email: ekycCached.email,
      user_id: userId,
      userscno: values.e2e, //TODO: Check e2e return from plugin
    };
    const { data, error, isSuccess } = await requestApi(endpoints.registerElectricFinancial, payload);
    setShowLoading(false);
    if (isSuccess) {
      //TODO: Check response
      setEkycToNativeCache({
        ...ekycCached,
        userId,
      });
      onConfirm();
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  return (
    <>
      <div>
        {showLoading && <Spinner />}
        <Header
          title="Sign up"
          onClick={moveBack}
        />
        <div className="create-password__wrapper page__form">
          <div className="page__title">Create your login password</div>
          <div className="mt-4">
            <InfoBox
              variant="informative"
              label="Enter a password with 8-12 characters, including uppercase, lowercase, and numbers."
            />
          </div>
          <div className="form__section mt-4">
            <Controller
              render={({ field }) => (
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  onFocus={() => handleOpenSecurityKeyboard('password')}
                  endAdornment={
                    <div
                      className="input__icon password__icon"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <FillEyeOnIcon /> : <FillEyeOffIcon />}
                    </div>
                  }
                  {...field}
                />
              )}
              control={control}
              name="password"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  onFocus={() => handleOpenSecurityKeyboard('confirmPassword')}
                  endAdornment={
                    <div
                      className="input__icon password__icon"
                      onClick={toggleShowConfirmPassword}
                    >
                      {showConfirmPassword ? <FillEyeOnIcon /> : <FillEyeOffIcon />}
                    </div>
                  }
                  {...field}
                />
              )}
              control={control}
              name="confirmPassword"
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
    </>
  );
};

export default SignUpCreatePassword;
