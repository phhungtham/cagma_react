import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import identityBanner from '@assets/images/verify-identity-banner.png';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import Input from '@common/components/atoms/Input/Input';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { endpoints } from '@common/constants/endpoint';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import getEkycInfo from '@utilities/gmCommon/getEkycInfo';
import setEkycInfo from '@utilities/gmCommon/setEkycInfo';
import { moveBack } from '@utilities/index';

import BranchVisitNoticeBottom from '../BranchVisitNoticeBottom';
import { VerifyIdentityType } from './constants';
import { VerifyIdentityTermsSchema } from './schema';
import './styles.scss';

const VerifyIdentityTerms = ({ onConfirm }) => {
  const { deviceId } = useContext(SignUpContext);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [showBranchVisitBottom, setShowBranchVisitBottom] = useState(false);
  const [ekycPluginInfo, setEkycPluginInfo] = useState({});
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

  const [type, agreeTerms] = watch(['type', 'agreeTerms']);
  console.log('agreeTerms :>> ', agreeTerms);

  const onChangeType = value => {
    setValue('type', value, { shouldValidate: true });
  };

  const requestPreRegisterCustomerStep2 = async values => {
    const { firstName, lastName } = values;
    setShowLoading(true);
    const payload = {
      cus_email: ekycPluginInfo.email,
      uuid_v: deviceId,
      cus_fst_nm: firstName,
      cus_last_nm: lastName,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.preRegisterCustomerInfoStep2, payload);
    setShowLoading(false);
    if (isSuccess) {
      debugger;
      setEkycInfo({
        ...ekycPluginInfo,
        firstName,
        lastName,
        isEkycProcessing: true,
        packageId: data.ekyc_aplct_stp_c,
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
      requestPreRegisterCustomerStep2(values);
    }
  };

  const getEkycInfoCallback = result => {
    const { firstName, lastName } = result;
    setValue('firstName', firstName, { shouldValidate: true });
    setValue('lastName', lastName, { shouldValidate: true });
    setEkycPluginInfo(result);
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  useEffect(() => {
    getEkycInfo(getEkycInfoCallback);
  }, []);

  return (
    <>
      {showLoading && <Spinner />}
      <div className="verify-identity-terms__wrapper">
        <Header
          title="Sign up"
          onClick={moveBack}
        />
        <div className="page__form px-0">
          <div className="page__container">
            <div className="page__title">Verify your identity</div>
            <div className="verify-identity-banner">
              <img
                src={identityBanner}
                alt="verify you identity"
              />
            </div>
            <div className="mt-4 pb-6">
              <ul className="verify-identity-instructions">
                <li className="instruction-item">
                  To protect your personal information and ensure a secure authentication process, you will be
                  redirected to 000. Please follow the link below to complete the identity verification process.
                </li>
                <li className="instruction-item mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
              </ul>
            </div>
          </div>
          <div className="divider__group" />
          <div className="page__container py-5">
            <div className="circle-radio__wrapper">
              <div
                className="circle-radio__item"
                onClick={() => onChangeType(VerifyIdentityType.AVAILABLE)}
              >
                <input
                  className="circle-radio__input"
                  type="radio"
                  name="radio"
                  value={VerifyIdentityType.AVAILABLE}
                  checked={type === VerifyIdentityType.AVAILABLE}
                />
                <label className="circle-radio__label">I have a valid Driver’s License or Passport</label>
              </div>
              {type === VerifyIdentityType.AVAILABLE && (
                <div className="form__section">
                  <Controller
                    render={({ field }) => (
                      <Input
                        label="First name"
                        type="text"
                        // maxLength={64}
                        {...field}
                      />
                    )}
                    control={control}
                    name="firstName"
                  />
                  <Controller
                    render={({ field }) => (
                      <Input
                        label="Last name"
                        type="text"
                        // maxLength={64}
                        {...field}
                      />
                    )}
                    control={control}
                    name="lastName"
                  />
                </div>
              )}
              <div
                className="circle-radio__item"
                onClick={() => onChangeType(VerifyIdentityType.UNAVAILABLE)}
              >
                <input
                  className="circle-radio__input"
                  type="radio"
                  name="radio"
                  value={VerifyIdentityType.UNAVAILABLE}
                  checked={type === VerifyIdentityType.UNAVAILABLE}
                />
                <label className="circle-radio__label">I don't have or want to submit an ID</label>
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
                        label="I agree to provide information to third parties"
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
            label="Proceed with ID Verification"
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
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default VerifyIdentityTerms;
