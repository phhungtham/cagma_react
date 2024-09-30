import bankBookImg from '@assets/images/bank-book.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import { moveHome } from '@utilities/index';

import './styles.scss';

const OpenAccountInstruction = ({ useCanadaID, onSkipSetUp, onOpenAccount }) => {
  const handleConfirm = () => {
    if (useCanadaID) {
      onOpenAccount();
    } else {
      moveHome();
    }
  };

  return (
    <>
      <div className="open-account-instruction__wrapper page__wrapper">
        <div className="instruction__header">
          <div className="instruction__img">
            <img
              src={bankBookImg}
              alt="Open an account"
            />
          </div>
          <div className="instruction__title">
            <span>Open an Account</span>
          </div>
          <div className="instruction__note">
            <span>
              {useCanadaID
                ? 'Message Message Message'
                : 'Please allow 1 business day for us to review your information'}
            </span>
          </div>
        </div>
        <InfoBox
          variant="informative"
          label={
            useCanadaID
              ? 'You can also open an new account in Product.'
              : 'We will then send an email to you with the instruction on how to open an account.'
          }
        />
      </div>
      <div className="footer__fixed">
        {useCanadaID && (
          <Button
            variant="filled__secondary-blue"
            label="Skip"
            className="btn__cta"
            onClick={onSkipSetUp}
          />
        )}
        <Button
          variant="filled__primary"
          label={useCanadaID ? 'Open' : 'Home'}
          className="btn__cta"
          onClick={handleConfirm}
        />
      </div>
    </>
  );
};

export default OpenAccountInstruction;
