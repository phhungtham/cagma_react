import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FillEyeOffIcon, FillEyeOnIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { isDevelopmentEnv } from '@common/constants/common';
import { yupResolver } from '@hookform/resolvers/yup';
import showSecureKeyboardChar from '@utilities/gmSecure/showSecureKeyboardChar';
import { moveBack } from '@utilities/index';

import { createIdFormSchema } from './schema';
import './styles.scss';

const SignUpCreatePassword = ({ onConfirm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(createIdFormSchema),
  });

  const handleChangeID = value => {
    console.log('value :>> ', value);
  };

  const handleOpenSecurityKeyboard = fieldName => {
    if (isDevelopmentEnv) {
      setValue(fieldName, 'password');
    }
    showSecureKeyboardChar(handleChangeID);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmitForm = values => {
    //TODO: For test
    onConfirm(values);
  };

  return (
    <>
      <div>
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
                      onClick={toggleShowPassword}
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
    </>
  );
};

export default SignUpCreatePassword;
