import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import identityBanner from '@assets/images/verify-identity-banner.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { yupResolver } from '@hookform/resolvers/yup';
import getEkycInfo from '@utilities/gmCommon/getEkycInfo';
import { moveBack } from '@utilities/index';

import BranchVisitNoticeBottom from '../BranchVisitNoticeBottom';
import { VerifyIdentityType } from './constants';
import { VerifyIdentityTermsSchema } from './schema';
import './styles.scss';

const VerifyIdentityTerms = ({ onConfirm }) => {
  const [showBranchVisitBottom, setShowBranchVisitBottom] = useState(false);

  const {
    control,
    watch,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyIdentityTermsSchema),
  });

  const [type] = watch(['type']);

  const onChangeType = value => {
    setValue('type', value, { shouldValidate: true });
  };

  const handleSubmitForm = () => {
    // if (selectedType === VerifyIdentityType.UNAVAILABLE) {
    //   setShowBranchVisitBottom(true);
    // } else {
    //   onConfirm();
    // }
  };

  const getEkycInfoCallback = result => {
    const { firstName, lastName } = result;
    setValue('firstName', firstName, { shouldValidate: true });
    setValue('lastName', lastName, { shouldValidate: true });
  };

  useEffect(() => {
    getEkycInfo(getEkycInfoCallback);
  }, []);

  return (
    <>
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
            onClick={handleSubmitForm}
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
