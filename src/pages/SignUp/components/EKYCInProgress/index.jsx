import { useState } from 'react';

import reviewingImg from '@assets/images/reviewing.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Toast from '@common/components/atoms/Toast';
import { moveHome } from '@utilities/index';

const EKYCInProgress = ({ onConfirm }) => {
  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });

  const handleNavigateHome = () => {
    moveHome();
  };

  const handleCheckResult = () => {
    const success = false;
    const message = success ? '' : 'Identity verification is incomplete. Please check again.';
    setShowToast({
      isShow: true,
      message: message,
      type: success ? 'success' : 'info',
    });

    //For test
    setTimeout(() => {
      onConfirm();
    }, 2000);
  };

  return (
    <>
      <div className="page-success">
        <div className="success__header">
          <div className="success__img">
            <img
              src={reviewingImg}
              alt="Complete"
            />
          </div>
          <div className="success__title">
            <span>Identity verification is on progress</span>
          </div>
          <div className="note">Please verify yourself</div>
        </div>
      </div>

      <div className="footer__fixed">
        <Button
          variant="filled__secondary-blue"
          label="Home"
          className="btn__cta"
          onClick={handleNavigateHome}
        />
        <Button
          variant="filled__primary"
          label="Done"
          className="btn__cta"
          onClick={handleCheckResult}
        />
      </div>
      <section className="toast__overlay margin-bottom">
        <Toast
          isShowToast={showToast.isShow}
          type={showToast.type}
          onClose={() => setShowToast({ ...showToast, isShow: false })}
          message={showToast.message}
        />
      </section>
    </>
  );
};

export default EKYCInProgress;
