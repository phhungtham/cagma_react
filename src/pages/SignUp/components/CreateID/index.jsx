import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { isDevelopmentEnv } from '@common/constants/common';
import { yupResolver } from '@hookform/resolvers/yup';
import showSecureKeyboardChar from '@utilities/gmSecure/showSecureKeyboardChar';
import { moveBack } from '@utilities/index';

import { createIdFormSchema } from './schema';

const SignUpCreateID = ({ onConfirm }) => {
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

  const handleOpenSecurityKeyboard = () => {
    if (isDevelopmentEnv) {
      setValue('id', 'test id');
    }
    showSecureKeyboardChar(handleChangeID);
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
        <div className="page__form">
          <div className="page__title">Create your ID</div>
          <div className="mt-4">
            <InfoBox
              variant="informative"
              label="Enter ID with 6-20 characters, include at least one letter, and contain no spaces."
            />
          </div>
          <div className="form__section mt-4">
            <Controller
              render={({ field }) => (
                <Input
                  label="ID"
                  onFocus={handleOpenSecurityKeyboard}
                  {...field}
                />
              )}
              control={control}
              name="id"
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

export default SignUpCreateID;
