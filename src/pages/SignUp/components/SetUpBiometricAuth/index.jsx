import faceIdImg from '@assets/images/lock-face-id.png';
import touchIdImg from '@assets/images/lock-touch-id.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import { BiometricAuthType } from '@common/constants/common';

import './styles.scss';

const label = {
  [BiometricAuthType.FACE_ID]: 'Face ID',
  [BiometricAuthType.TOUCH_ID]: 'Touch ID',
};

const SetUpBiometricAuth = ({ type, onSkipSetUp }) => {
  const isUsingFaceId = type === BiometricAuthType.FACE_ID;

  const handleSetUpBiometricAuth = () => {
    onSkipSetUp();
    //TODO: Handle setup
  };

  return (
    <>
      <div className="set-up-biometric-auth__wrapper page__wrapper">
        <div className="biometric__header">
          <div className="biometric__img">
            <img
              src={isUsingFaceId ? faceIdImg : touchIdImg}
              alt="Complete"
            />
          </div>
          <div className="biometric__title">
            <span>{`Set Up ${label[type]}`}</span>
          </div>
          <div className="biometric__note">
            <span>{`For easy and fast login, enable ${label[type]}`}</span>
          </div>
        </div>
        <InfoBox
          variant="informative"
          label={`You can also set up ${label[type]} in Menu > Login Method Management`}
        />
      </div>
      <div className="footer__fixed">
        <Button
          variant="filled__secondary-blue"
          label="Skip"
          className="btn__cta"
          onClick={onSkipSetUp}
        />
        <Button
          variant="filled__primary"
          label="Set Up"
          className="btn__cta"
          onClick={handleSetUpBiometricAuth}
        />
      </div>
    </>
  );
};

export default SetUpBiometricAuth;
