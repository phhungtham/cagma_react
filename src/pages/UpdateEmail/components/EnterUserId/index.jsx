/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { endpoints } from '@common/constants/endpoint';
import { updateEmailLabels as labels, menuLabels } from '@common/constants/labels';
import { notAllowNumberAlphabetRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import useMove from '@hooks/useMove';
import { UpdateEmailContext } from '@pages/UpdateEmail';

import { EnterUserIdSchema } from './schema';

const EnterUserId = ({ onConfirm }) => {
  const { translate: t, setShowLoading, setAlert } = useContext(UpdateEmailContext);
  const { moveHomeNative } = useMove();

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(EnterUserIdSchema),
  });

  const {
    control,
    watch,
    setValue,
    clearErrors,
    setError,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  const { requestApi } = useApi();

  const handleSubmitForm = async values => {
    setShowLoading(true);
    const { userId } = values;
    const payload = { userId: userId ? userId.toUpperCase() : '' };
    const { data, isSuccess, error } = await requestApi(endpoints.inquiryByUserId, payload);
    setShowLoading(false);
    if (isSuccess) {
      onConfirm({ userId: userId ? userId.toUpperCase() : '' });
    } else {
      setAlert({
        isShow: true,
        title: '',
        content: error,
      });
    }
  };

  const handleClickBack = () => {
    moveHomeNative();
  };

  return (
    <>
      <div>
        <Header
          title={t(menuLabels.manageLogin)}
          disabledMoveBack
          onClickBack={handleClickBack}
        />
        <div className="page__form">
          <div className="page__title">{t(labels.updateYourEmail)}</div>
          <div className="form__section mt-4 flex-gap-y-12">
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.userId)}
                  type="text"
                  lang="en"
                  inputMode="latin"
                  maxLength="20"
                  regex={notAllowNumberAlphabetRegex}
                  {...field}
                />
              )}
              control={control}
              name="userId"
            />
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label={t(labels.next)}
            variant="filled__primary"
            className="btn__cta"
            disable={!isValid}
            onClick={handleSubmit(handleSubmitForm)}
          />
        </div>
      </div>
    </>
  );
};

export default EnterUserId;
