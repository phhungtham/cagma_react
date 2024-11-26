import { useContext } from 'react';

import passcodeBanner from '@assets/images/security-passcode-banner.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Header from '@common/components/organisms/Header';
import { signUpCreateMOTPLabels as labels, menuLabels } from '@common/constants/labels';
import { SignUpContext } from '@pages/SignUp';
import clearEkycInfo from '@utilities/gmCommon/clearEkycInfo';
import createSecurityPasscode from '@utilities/gmSecure/createSecurityPasscode';
import { moveBack } from '@utilities/index';

import './styles.scss';

const SignUpCreatePasscode = ({ onConfirm }) => {
  const { translate: t, isNavigateFromLogin } = useContext(SignUpContext);

  const handleCreatePasscodeCallback = ({ isDone, userId }) => {
    if (isDone) {
      clearEkycInfo();
      onConfirm(userId);
    }
  };

  const handleSubmitForm = () => {
    console.log('call Plugin Create Security Passcode Params isNavigateFromLogin :>> ', isNavigateFromLogin);
    createSecurityPasscode(handleCreatePasscodeCallback, {
      isFromLogin: isNavigateFromLogin || false,
    });
  };

  return (
    <>
      <div className="create-passcode__wrapper">
        <Header
          title={t(menuLabels.signUp)}
          onClick={moveBack}
        />
        <div className="page__form px-0">
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
              </ul>
              {/* <div>
                <div className="mt-2 passcode-subs">Cannot include more than 3 consecutive numbers.</div>
                <div className="mt-2 passcode-subs">Cannot include more than 3 repeated numbers.</div>
              </div> */}
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
