import { useContext, useState } from 'react';

import VerifyId from '@assets/images/icon-fill-idpw-24.png';
import StartOverIcon from '@assets/images/icon_fill_restart_24.png';
import LoadingImg from '@assets/images/signup-spinner.png';
import Alert from '@common/components/atoms/Alert';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import { updateEmailLabels as labels } from '@common/constants/labels';
import { UpdateEmailContext } from '@pages/UpdateEmail';

const IdentityVerifyInProgress = ({ showRetryBtn, onClickResendEmail }) => {
  const { translate: t, onRestart, updateEmailInfo } = useContext(UpdateEmailContext);
  const [showResendEmailConfirmAlert, setShowResendEmailConfirmAlert] = useState(false);

  const handleCloseConfirmAlert = () => {
    setShowResendEmailConfirmAlert(false);
  };

  const handleShowConfirmAlert = () => {
    setShowResendEmailConfirmAlert(true);
  };

  const handleClickResend = () => {
    setShowResendEmailConfirmAlert(false);
    onClickResendEmail();
  };

  return (
    <>
      <div className="success__header">
        <div className="success__img">
          <div className="spinning">
            <img
              src={LoadingImg}
              alt="Loading"
            />
          </div>
        </div>
        <div className="success__title">
          <span>{t(labels.identityVerifyIsOnProgress)}</span>
        </div>
        <div className="note">{t(labels.weHaveRequestedAnIDV)}</div>
      </div>

      <div className="d-flex justify-center items-start">
        {showRetryBtn && (
          <>
            <IconButton
              size="lg"
              type="circle"
              label={t(labels.resendEmail)}
              icon={<img src={VerifyId} />}
              onClick={handleShowConfirmAlert}
            />
            <IconButton
              size="lg"
              type="circle"
              className="start-over__icon"
              label={t(labels.startOver)}
              icon={<img src={StartOverIcon} />}
              onClick={onRestart}
            />
          </>
        )}
      </div>
      {showResendEmailConfirmAlert && (
        <Alert
          isCloseButton={false}
          isShowAlert={showResendEmailConfirmAlert}
          title={t(labels.emailHasAlreadySent)}
          subtitle={t(labels.aVerificationEmailHas).replace('%1', updateEmailInfo?.email)}
          onClose={handleCloseConfirmAlert}
          textAlign="left"
          firstButton={{
            onClick: handleCloseConfirmAlert,
            label: t(labels.confirm),
          }}
          secondButton={{
            onClick: handleClickResend,
            label: t(labels.resend2),
          }}
        />
      )}
    </>
  );
};

export default IdentityVerifyInProgress;
