import { useContext, useState } from 'react';

import VerifyId from '@assets/images/icon-fill-idpw-24.png';
import StartOverIcon from '@assets/images/icon_fill_restart_24.png';
import LoadingImg from '@assets/images/signup-spinner.png';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, signUpVerifyIdentityLabels as labels, signUpVerifyUserLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useMove from '@hooks/useMove';
import { SignUpContext } from '@pages/SignUp';
import { VerifyMembershipResultStatus } from '@pages/SignUp/constants';
import clearEkycInfo from '@utilities/gmCommon/clearEkycInfo';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';

import './styles.scss';

const EKYCInProgress = ({ onConfirm, navigateToVerifyResult, onNavigateVerifyMember }) => {
  const { deviceId, translate: t, ekycStepStatus, ekycCached, isNavigateFromLogin } = useContext(SignUpContext);
  const { moveHomeNative } = useMove();
  const [showLoading, setShowLoading] = useState(false);
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });
  const { requestApi } = useApi();

  const handleNavigateHome = () => {
    moveHomeNative();
  };

  const handleStartOver = () => {
    if (isNavigateFromLogin) {
      clearEkycInfo();
      moveHomeNative();
    } else {
      onNavigateVerifyMember();
    }
  };

  const requestRegenerateEkycLink = async () => {
    setShowLoading(true);
    const { email, firstName, lastName, packageId } = ekycCached;
    const payload = {
      cus_email: email,
      uuid_v: deviceId,
      cus_fst_nm: firstName,
      cus_last_nm: lastName,
      e_sgn_trx_id: packageId,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.regenerateEkycLink, payload);
    setShowLoading(false);
    if (isSuccess) {
      const link = data?.signingUrl || '';
      openURLInBrowser(link);
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestRegisterCustomerInfoStep3 = async () => {
    const { ekyc_aplct_stp_c, cusno } = ekycStepStatus || {};
    //Ignore call API, navigate directly to Enter Personal Detail Screen
    if (Number(ekyc_aplct_stp_c) === 3) {
      const isFetchCustomerData = !!cusno;
      return onConfirm(isFetchCustomerData);
    }
    setShowLoading(true);
    const { email, firstName, lastName, packageId } = ekycCached;
    const payload = {
      cus_email: email,
      uuid_v: deviceId,
      cus_fst_nm: firstName,
      cus_last_nm: lastName,
      e_sgn_trx_id: packageId,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.preRegisterCustomerInfoStep3, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { confm_proc_s: processingStatus, cusno } = data || {};
      if (['20', '30'].includes(processingStatus)) {
        setShowRetryBtn(true);
        setShowToast({
          isShow: true,
          message: t(labels.unableToRetrieve),
          type: 'error',
        });
      } else if (processingStatus === '40') {
        const isFetchCustomerData = !!cusno;
        onConfirm(isFetchCustomerData);
      } else if (['50', '60'].includes(processingStatus)) {
        return navigateToVerifyResult(VerifyMembershipResultStatus.FAILED);
      }
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  return (
    <>
      {showLoading && <Spinner />}
      <div className="page-success ekyc-in-progress-page">
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
            <span>{t(labels.identityVerificationProgress)}</span>
          </div>
          <div className="note">{t(labels.pleaseCompleteVerification)}</div>
        </div>

        <div className="d-flex justify-center items-start">
          {showRetryBtn && (
            <>
              <IconButton
                size="lg"
                type="circle"
                label={t(labels.retryIdVerification)}
                icon={<img src={VerifyId} />}
                onClick={requestRegenerateEkycLink}
              />
              <IconButton
                size="lg"
                type="circle"
                className="start-over__icon"
                label={t(signUpVerifyUserLabels.startOver)}
                icon={<img src={StartOverIcon} />}
                onClick={handleStartOver}
              />
            </>
          )}
        </div>
      </div>

      <div className="footer__fixed">
        <Button
          variant="filled__secondary-blue"
          label={t(labels.home)}
          className="btn__cta"
          onClick={handleNavigateHome}
        />
        <Button
          variant="filled__primary"
          label={t(labels.continue)}
          className="btn__cta"
          onClick={requestRegisterCustomerInfoStep3}
        />
      </div>
      <section className="toast__overlay ekyc-in-progress__toast">
        <Toast
          isShowToast={showToast.isShow}
          type={showToast.type}
          onClose={() => setShowToast({ ...showToast, isShow: false })}
          message={showToast.message}
        />
      </section>
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        onClose={handleCloseAlert}
        textAlign="left"
        firstButton={{
          onClick: handleCloseAlert,
          label: t(ctaLabels.confirm),
        }}
      />
    </>
  );
};

export default EKYCInProgress;
