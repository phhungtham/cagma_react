import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import identityBanner from '@assets/images/verify-identity-banner.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { endpoints } from '@common/constants/endpoint';
import { updateEmailLabels as labels, menuLabels } from '@common/constants/labels';
import { invalidNameRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { UpdateEmailContext } from '@pages/UpdateEmail';

import BranchVisitNoticeBottom from '../BranchVisitNoticeBottom';
import { VerifyIdentityType } from './constants';
import { VerifyIdentityTermsSchema } from './schema';
import './styles.scss';

const VerifyIdentityTerms = ({ onConfirm, onNavigateEnterEmail }) => {
  const { translate: t, setShowLoading, setAlert, userId, email } = useContext(UpdateEmailContext);

  const [showBranchVisitBottom, setShowBranchVisitBottom] = useState(false);
  const { requestApi } = useApi();

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyIdentityTermsSchema),
  });

  const [type] = watch(['type']);

  const onChangeType = value => {
    setValue('type', value, { shouldValidate: true });
  };

  const inquiryUserVerification = async values => {
    const { firstName, lastName } = values;
    setShowLoading(true);
    const payload = {
      userId,
      cus_email: email,
      cus_fst_nm: firstName,
      cus_last_nm: lastName,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.inquiryUserVerification, payload);
    setShowLoading(false);
    if (isSuccess) {
      onConfirm();
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleSubmitForm = values => {
    if (type === VerifyIdentityType.UNAVAILABLE) {
      setShowBranchVisitBottom(true);
    } else {
      inquiryUserVerification(values);
    }
  };

  const handleClickBack = () => {
    onNavigateEnterEmail();
  };

  return (
    <>
      <div className="update-email-identification__wrapper">
        <Header
          title={t(menuLabels.signUp)}
          disabledMoveBack
          onClickBack={handleClickBack}
        />
        <div className="h-screen__content px-0 pt-5">
          <div className="page__container">
            <div className="page__title">{t(labels.verifyYourIdentity)}</div>
            <div className="verify-identity-banner">
              <img
                src={identityBanner}
                alt="verify you identity"
              />
            </div>
            <div className="mt-4 pb-6">
              <ul className="verify-identity-instructions">
                <li className="instruction-item">{t(labels.toProtectYourPersonal)}</li>
              </ul>
            </div>
          </div>
          <div className="divider__group" />
          <div className="page__container py-5">
            <div className="circle-radio__wrapper flex-gap-y-16">
              <div
                className="circle-radio__item flex-gap-x-8"
                onClick={() => onChangeType(VerifyIdentityType.AVAILABLE)}
              >
                <input
                  className="circle-radio__input"
                  type="radio"
                  name="radio"
                  value={VerifyIdentityType.AVAILABLE}
                  checked={type === VerifyIdentityType.AVAILABLE}
                />
                <label className="circle-radio__label">{t(labels.iHaveAValidDriver)}</label>
              </div>

              <div className={`${type === VerifyIdentityType.AVAILABLE ? 'form__section flex-gap-y-12' : 'hidden'}`}>
                <Controller
                  render={({ field }) => (
                    <Input
                      label={t(labels.firstName)}
                      type="text"
                      regex={invalidNameRegex}
                      maxLength={20}
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
                      type="text"
                      regex={invalidNameRegex}
                      maxLength={20}
                      {...field}
                    />
                  )}
                  control={control}
                  name="lastName"
                />
              </div>
              <div
                className="circle-radio__item flex-gap-x-8"
                onClick={() => onChangeType(VerifyIdentityType.UNAVAILABLE)}
              >
                <input
                  className="circle-radio__input"
                  type="radio"
                  name="radio"
                  value={VerifyIdentityType.UNAVAILABLE}
                  checked={type === VerifyIdentityType.UNAVAILABLE}
                />
                <label className="circle-radio__label">{t(labels.iDontHave)}</label>
              </div>
            </div>

            {type === VerifyIdentityType.AVAILABLE && (
              <>
                <div className="divider__item__solid mt-6" />
                <div className="mt-5">
                  <Controller
                    render={({ field }) => (
                      <CheckBox
                        size="large"
                        label={t(labels.iAgreeToProvide)}
                        checked={field.value}
                        {...field}
                      />
                    )}
                    control={control}
                    name="agreeTerms"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label={t(labels.proceedWithId)}
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(handleSubmitForm)}
            disable={!isValid}
          />
        </div>
      </div>
      {showBranchVisitBottom && (
        <BranchVisitNoticeBottom
          open={showBranchVisitBottom}
          onClose={() => setShowBranchVisitBottom(false)}
        />
      )}
    </>
  );
};

export default VerifyIdentityTerms;
