import passcodeBanner from '@assets/images/security-passcode-banner.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';

import './styles.scss';

const SignUpCreatePasscode = ({ onConfirm }) => {
  const handleSubmitForm = () => {
    onConfirm();
  };

  return (
    <>
      <div className="create-passcode__wrapper">
        <Header
          title="Sign up"
          onClick={moveBack}
        />
        <div className="page__form px-0">
          <div className="page__container">
            <div className="page__title">Create Security Passcode for your safe SOL experience</div>
            <div className="passcode-banner">
              <img
                src={passcodeBanner}
                alt="Create security passcode"
              />
            </div>
            <div className="mt-4 pb-6">
              <ul className="passcode-instructions">
                <li className="instruction-item">Security Passcode is a 6 digit number for using app safely. </li>
                <li className="instruction-item mt-2">
                  This number will be used for verifying your identity or make transactions, so be careful not to expose
                  it to others.
                </li>
              </ul>
              <div>
                <div className="mt-2 passcode-subs">Cannot include more than 3 consecutive numbers.</div>
                <div className="mt-2 passcode-subs">Cannot include more than 3 repeated numbers.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label="Next"
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
