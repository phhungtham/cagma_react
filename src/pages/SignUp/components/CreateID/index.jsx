import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { endpoints } from '@common/constants/endpoint';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import showCertificationChar from '@utilities/gmSecure/showCertificationChar';
import { moveBack } from '@utilities/index';

import { createIdFormSchema } from './schema';

const SignUpCreateID = ({ onConfirm }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const { requestApi } = useApi();
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

  const handleChangeID = result => {
    setValue('id', result?.uniqueValue?.toLowerCase() || '', { shouldValidate: true });
  };

  const handleOpenSecurityKeyboard = () => {
    showCertificationChar(handleChangeID, { maxLength: 20 });
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  const handleSubmitForm = async values => {
    setShowLoading(true);
    const payload = {
      user_id: values.id,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.verifyIdDuplicate, payload);
    setShowLoading(false);
    if (isSuccess) {
      if (Number(data.cnt) === 0) {
        onConfirm(values.id);
      } else {
        return setAlert({
          isShow: true,
          content: 'ID you entered is already in use.',
        });
      }
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
                  maxLength={20} //TODO: Clarify format and validate
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

export default SignUpCreateID;
