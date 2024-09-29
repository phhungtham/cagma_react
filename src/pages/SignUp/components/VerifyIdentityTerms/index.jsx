import { useState } from 'react';

import identityBanner from '@assets/images/verify-identity-banner.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import CircleRadio from '@common/components/atoms/RadioButton/CircleRadio';
import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';

import BranchVisitNoticeBottom from '../BranchVisitNoticeBottom';
import { verifyIdentityOptions, VerifyIdentityType } from './constants';
import './styles.scss';

const VerifyIdentityTerms = ({ onConfirm }) => {
  const [selectedType, setSelectedType] = useState(VerifyIdentityType.AVAILABLE);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showBranchVisitBottom, setShowBranchVisitBottom] = useState(false);

  const handleChangeVerifyType = value => {
    setSelectedType(value);
  };

  const handleChangeAgree = checked => {
    setAgreeTerms(checked);
  };

  const handleSubmitForm = () => {
    if (selectedType === VerifyIdentityType.UNAVAILABLE) {
      setShowBranchVisitBottom(true);
    } else {
      onConfirm();
    }
  };

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
            <CircleRadio
              options={verifyIdentityOptions}
              value={selectedType}
              onChange={handleChangeVerifyType}
            />
            <div className="divider__item__solid mt-6" />
            <div className="mt-5">
              <CheckBox
                size="large"
                label="I agree to provide information to third parties"
                checked={agreeTerms}
                onChange={handleChangeAgree}
              />
            </div>
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label="Proceed with ID Verification"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmitForm}
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
