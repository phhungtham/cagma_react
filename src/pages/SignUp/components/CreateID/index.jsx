import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, signUpCreateIdLabels as labels, menuLabels } from '@common/constants/labels';
import { notAllowNumberAlphabetRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';

import { createIdFormSchema } from './schema';

const SignUpCreateID = ({ onConfirm, onClickBack }) => {
  const { translate: t } = useContext(SignUpContext);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const { requestApi } = useApi();
  const {
    control,
    handleSubmit,
    formState: { isValid },
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

  const handleSubmitForm = async values => {
    setShowLoading(true);
    const payload = {
      user_id: values.id?.toUpperCase() || '',
    };
    const { data, error, isSuccess } = await requestApi(endpoints.verifyIdDuplicate, payload);
    setShowLoading(false);
    if (isSuccess) {
      if (Number(data.cnt) === 0) {
        onConfirm(values.id?.toUpperCase() || '');
      } else {
        return setAlert({
          isShow: true,
          content: t(labels.idAlreadyUse),
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
          title={t(menuLabels.signUp)}
          disabledMoveBack
          onClickBack={onClickBack}
        />
        <div className="h-screen__content pt-5">
          <div className="page__title">{t(labels.createYourId)}</div>
          <div className="mt-4">
            <InfoBox
              variant="informative"
              label={t(labels.enterIdWith)}
            />
          </div>
          <div className="form__section mt-4 flex-gap-y-12">
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.id)}
                  regex={notAllowNumberAlphabetRegex}
                  maxLength={20}
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
    </>
  );
};

export default SignUpCreateID;
