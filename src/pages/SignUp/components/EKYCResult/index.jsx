import { useEffect } from 'react';

import successImg from '@assets/images/complete.png';
import reviewingImg from '@assets/images/reviewing.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import { moveHome } from '@utilities/index';

const EKYCResult = ({ isSuccess, onNavigate }) => {
  useEffect(() => {
    setTimeout(() => {
      onNavigate();
    }, 3000);
  }, []);

  return (
    <>
      <div className="page-success">
        <div className="success__header">
          <div className="success__img">
            <img
              src={isSuccess ? successImg : reviewingImg}
              alt="Complete"
            />
          </div>
          <div className="success__title">
            <span>{isSuccess ? 'Congratulations!' : 'Your details are being reviewed'}</span>
          </div>
          <div className="note">
            {isSuccess
              ? 'Identity verification is complete!'
              : 'Please allow 1 business day for us to review your information'}
          </div>
          {!isSuccess && (
            <div className="mt-6">
              <InfoBox
                variant="informative"
                label="We will then send an email to you with the instruction on how to open an account."
              />
            </div>
          )}
        </div>
      </div>
      {!isSuccess && (
        <div className="footer__fixed">
          <Button
            variant="filled__primary"
            label="Home"
            className="btn__cta"
            onClick={moveHome}
          />
        </div>
      )}
    </>
  );
};

export default EKYCResult;
