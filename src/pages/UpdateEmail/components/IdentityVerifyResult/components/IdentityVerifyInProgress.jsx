import { useContext } from 'react';

import VerifyId from '@assets/images/icon-fill-idpw-24.png';
import LoadingImg from '@assets/images/signup-spinner.png';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import { updateEmailLabels as labels } from '@common/constants/labels';
import { UpdateEmailContext } from '@pages/UpdateEmail';

const IdentityVerifyInProgress = ({ showRetryBtn, onClickResendEmail }) => {
  const { translate: t } = useContext(UpdateEmailContext);

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
              onClick={onClickResendEmail}
            />
            {/* <IconButton
          size="lg"
          type="circle"
          className="start-over__icon"
          label={t(labels.startOver)}
          icon={<img src={StartOverIcon} />}
          onClick={handleStartOver}
        /> */}
          </>
        )}
      </div>
    </>
  );
};

export default IdentityVerifyInProgress;
