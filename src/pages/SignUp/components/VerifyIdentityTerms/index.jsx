import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import identityBanner from '@assets/images/verify-identity-banner.png';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import Input from '@common/components/atoms/Input/Input';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { isDevelopmentEnv } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import {
  ctaLabels,
  signUpVerifyIdentityLabels as labels,
  menuLabels,
  signUpWelcomeLabels,
} from '@common/constants/labels';
import { invalidNameRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import useMove from '@hooks/useMove';
import { SignUpContext } from '@pages/SignUp';
import { isIphoneIOS14OrOlder } from '@utilities/deviceDetected';
import clearEkycInfo from '@utilities/gmCommon/clearEkycInfo';
import clearTempLoginInfo from '@utilities/gmCommon/clearTempLoginInfo';

import BranchVisitNoticeBottom from '../BranchVisitNoticeBottom';
import { VerifyIdentityType } from './constants';
import { VerifyIdentityTermsSchema } from './schema';
import './styles.scss';

const VerifyIdentityTerms = ({ onConfirm, onNavigateEnterEmail }) => {
  const { deviceId, ekycCached, setEkycToNativeCache, translate: t, isNavigateFromLogin } = useContext(SignUpContext);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [showAlertRequireVersion, setShowAlertRequireVersion] = useState(false);
  const [showAlertConfirmLogout, setShowAlertConfirmLogout] = useState(false);
  const [showBranchVisitBottom, setShowBranchVisitBottom] = useState(false);
  const { requestApi } = useApi();
  const { moveHomeNative } = useMove();

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

  const requestPreRegisterCustomerStep2 = async values => {
    const { firstName, lastName } = values;
    setShowLoading(true);
    const payload = {
      cus_email: ekycCached.email,
      uuid_v: deviceId,
      cus_fst_nm: firstName,
      cus_last_nm: lastName,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.preRegisterCustomerInfoStep2, payload);
    setShowLoading(false);
    if (isSuccess) {
      setEkycToNativeCache({
        ...ekycCached,
        firstName,
        lastName,
        isEkycProcessing: true,
        packageId: data.e_sgn_trx_id,
      });
      onConfirm(data.signingUrl);
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
      const isIOS14OrOlder = isIphoneIOS14OrOlder();
      if (isIOS14OrOlder) {
        setShowAlertRequireVersion(true);
        return;
      }
      requestPreRegisterCustomerStep2(values);
    }
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  const handleClickBack = () => {
    onNavigateEnterEmail();
  };

  const handleLogout = async () => {
    if (isDevelopmentEnv) {
      localStorage.removeItem('isLogin');
    }
    setShowLoading(true);
    await requestApi(endpoints.logout);
    setShowLoading(false);
  };

  const handleCloseAlertConfirmLogout = async () => {
    setShowAlertConfirmLogout(false);
    await handleLogout();
    clearEkycInfo();
    clearTempLoginInfo();
    moveHomeNative();
  };

  const handleCloseAlertRequireVersion = () => {
    setShowAlertRequireVersion(false);
    if (isNavigateFromLogin) {
      setShowAlertConfirmLogout(true);
      return;
    }
    clearEkycInfo();
    moveHomeNative();
  };

  useEffect(() => {
    if (ekycCached) {
      const { firstName, lastName } = ekycCached;
      setValue('firstName', firstName, { shouldValidate: true });
      setValue('lastName', lastName, { shouldValidate: true });
    }
  }, [ekycCached]);

  return (
    <>
      {showLoading && <Spinner />}
      <div className="verify-identity-terms__wrapper">
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
                      label={t(signUpWelcomeLabels.firstName)}
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
                      label={t(signUpWelcomeLabels.lastName)}
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
      {showAlertRequireVersion && (
        <Alert
          isCloseButton={false}
          isShowAlert={showAlertRequireVersion}
          title={t(labels.signUpRequires)}
          subtitle={t(labels.youNeedtoUpdate)}
          onClose={() => setShowAlertRequireVersion(false)}
          textAlign="left"
          firstButton={{
            onClick: handleCloseAlertRequireVersion,
            label: t(labels.home),
          }}
        />
      )}
      {showAlertConfirmLogout && (
        <Alert
          isCloseButton={false}
          isShowAlert={showAlertConfirmLogout}
          title={t(labels.forSecurityReasons)}
          subtitle=""
          onClose={() => setShowAlertConfirmLogout(false)}
          textAlign="left"
          firstButton={{
            onClick: handleCloseAlertConfirmLogout,
            label: t(labels.confirm),
          }}
        />
      )}
    </>
  );
};

export default VerifyIdentityTerms;
