import { useContext, useState } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Toast from '@common/components/atoms/Toast';
import { endpoints } from '@common/constants/endpoint';
import { updateEmailLabels as labels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useMove from '@hooks/useMove';
import { UpdateEmailContext } from '@pages/UpdateEmail';
import clearEmailUpdateInfo from '@utilities/gmCommon/clearEmailUpdateInfo';

import IdentityVerifyFailed from './components/IdentityVerifyFailed';
import IdentityVerifyInProgress from './components/IdentityVerifyInProgress';
import IdentityVerifySubmitSuccess from './components/IdentityVerifySubmitSuccess';
import { UpdateEmailVerifyStatus } from './constants';
import './styles.scss';

const LabelsConfirmWithStatus = {
  [UpdateEmailVerifyStatus.IN_PROGRESS]: labels.continue,
  [UpdateEmailVerifyStatus.SUCCESS]: labels.home,
  [UpdateEmailVerifyStatus.FAILED]: labels.close,
};

const IdentityVerifyResult = () => {
  const { translate: t, updateEmailInfo, setShowLoading, setAlert } = useContext(UpdateEmailContext);
  const { moveHomeNative } = useMove();
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(UpdateEmailVerifyStatus.IN_PROGRESS);
  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });
  const { requestApi } = useApi();

  const handleNavigateHome = () => {
    moveHomeNative();
  };

  const checkUpdateEmailStatus = async () => {
    setShowLoading(true);
    const payload = {
      userId: updateEmailInfo.userId,
      cus_email: updateEmailInfo.email,
      cus_fst_nm: updateEmailInfo.firstName,
      cus_last_nm: updateEmailInfo.lastName,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.inquiryUserVerification, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { confm_proc_s: processingStatus, rslt_d: resultStatus } = data || {};
      if (!Number(resultStatus) || ['50', '60'].includes(processingStatus)) {
        clearEmailUpdateInfo();
        setVerifyStatus(UpdateEmailVerifyStatus.FAILED);
        return;
      }
      if (['20', '30'].includes(processingStatus)) {
        setShowRetryBtn(true);
        setShowToast({
          isShow: true,
          message: t(labels.unableToRetrieve),
          type: 'error',
        });
      } else if (['10', '40'].includes(processingStatus)) {
        clearEmailUpdateInfo();
        setVerifyStatus(UpdateEmailVerifyStatus.SUCCESS);
      }
    } else {
      setShowRetryBtn(true);
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleResendEmail = async () => {
    setShowLoading(true);
    const payload = {
      userId: updateEmailInfo.userId,
      cus_email: updateEmailInfo.email,
      cus_fst_nm: updateEmailInfo.firstName,
      cus_last_nm: updateEmailInfo.lastName,
      rsnd_flg: 'Y',
    };
    const { data, error, isSuccess } = await requestApi(endpoints.inquiryUserVerification, payload);
    setShowLoading(false);
    if (isSuccess) {
      //TODO: Show toast
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const onClickConfirmBtn = () => {
    if (verifyStatus === UpdateEmailVerifyStatus.IN_PROGRESS) {
      checkUpdateEmailStatus();
    } else if (verifyStatus === UpdateEmailVerifyStatus.SUCCESS) {
      moveHomeNative();
    } else if (verifyStatus === UpdateEmailVerifyStatus.FAILED) {
      moveHomeNative();
    }
  };

  return (
    <>
      <div
        className={`page-success update-email-in-progress__wrapper ${
          verifyStatus === UpdateEmailVerifyStatus.SUCCESS ? '' : 'page-gradient'
        }`}
      >
        {verifyStatus === UpdateEmailVerifyStatus.IN_PROGRESS && (
          <IdentityVerifyInProgress
            showRetryBtn={showRetryBtn}
            onClickResendEmail={handleResendEmail}
          />
        )}
        {verifyStatus === UpdateEmailVerifyStatus.SUCCESS && <IdentityVerifySubmitSuccess />}
        {verifyStatus === UpdateEmailVerifyStatus.FAILED && <IdentityVerifyFailed />}
      </div>

      <div className="footer__fixed flex-gap-x-8">
        {verifyStatus === UpdateEmailVerifyStatus.IN_PROGRESS && (
          <Button
            variant="filled__secondary-blue"
            label={t(labels.home)}
            className="btn__cta"
            onClick={handleNavigateHome}
          />
        )}
        <Button
          variant="filled__primary"
          label={t(LabelsConfirmWithStatus[verifyStatus])}
          className="btn__cta"
          onClick={onClickConfirmBtn}
        />
      </div>
      <section className="toast__overlay update-email-in-progress__toast">
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

export default IdentityVerifyResult;
