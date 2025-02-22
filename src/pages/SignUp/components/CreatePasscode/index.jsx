import { useContext } from 'react';

import passcodeBanner from '@assets/images/security-passcode-banner.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Header from '@common/components/organisms/Header';
import { signUpCreateMOTPLabels as labels, menuLabels } from '@common/constants/labels';
import { SignUpContext } from '@pages/SignUp';
import clearEkycInfo from '@utilities/gmCommon/clearEkycInfo';
import createSecurityPasscode from '@utilities/gmSecure/createSecurityPasscode';

import './styles.scss';

const SignUpCreatePasscode = ({ onConfirm, onNavigatePasscodeAgreeTerms }) => {
  const { translate: t, isNavigateFromLogin } = useContext(SignUpContext);

  const handleCreatePasscodeCallback = ({ isDone, userId }) => {
    if (isDone) {
      clearEkycInfo();
      onConfirm(userId);
    }
  };

  const handleSubmitForm = () => {
    createSecurityPasscode(handleCreatePasscodeCallback, {
      isFromLogin: isNavigateFromLogin || false,
    });
  };

  const handleClickBack = async () => {
    onNavigatePasscodeAgreeTerms();
  };

  return (
    <>
      <div className="create-passcode__wrapper">
        <Header
          title={t(menuLabels.security)}
          disabledMoveBack
          onClickBack={handleClickBack}
        />
        <div className="h-screen__content pt-5 px-0">
          <div className="page__container">
            <div className="page__title">{t(labels.createSecurityPasscode)}</div>
            <div className="passcode-banner">
              <img
                src={passcodeBanner}
                alt="Create security passcode"
              />
            </div>
            <div className="mt-4 pb-6">
              <ul className="passcode-instructions">
                <li className="instruction-item">{t(labels.descriptions)}</li>
                <li className="instruction-item mt-2">{t(labels.thisNumberWillBeUsed)}</li>
              </ul>
              <div>
                <div className="mt-2 passcode-subs">{t(labels.cannotIncludeMoreConsecutive)}</div>
                <div className="mt-2 passcode-subs">{t(labels.cannotIncludedMoreRepeated)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label={t(labels.next)}
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmitForm}
          />
        </div>
      </div>
    </>
  );
};

export default SignUpCreatePasscode;
