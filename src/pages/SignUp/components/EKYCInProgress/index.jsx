import { useContext, useEffect, useState } from 'react';

import VerifyId from '@assets/images/icon-fill-idpw-24.png';
import LoadingImg from '@assets/images/signup-spinner.png';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, signUpVerifyIdentityLabels as labels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useMove from '@hooks/useMove';
import { SignUpContext } from '@pages/SignUp';
import { VerifyMembershipResultStatus } from '@pages/SignUp/constants';
import getEkycInfo from '@utilities/gmCommon/getEkycInfo';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';

const EKYCInProgress = ({ onConfirm, navigateToVerifyResult }) => {
  const { deviceId, translate: t, ekycStepStatus } = useContext(SignUpContext);
  const { moveHomeNative } = useMove();
  const [ekycPluginInfo, setEkycPluginInfo] = useState({});
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

  const requestRegenerateEkycLink = async () => {
    setShowLoading(true);
    const { email, firstName, lastName, packageId } = ekycPluginInfo;
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
    const { email, firstName, lastName, packageId } = ekycPluginInfo;
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
      if (['20', '30', '40'].includes(processingStatus)) {
        setShowRetryBtn(true);
        setShowToast({
          isShow: true,
          message: t(labels.unableToRetrieve),
          type: 'error',
        });
      } else if (processingStatus === '10') {
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

  const getEkycInfoCallback = result => {
    setEkycPluginInfo(result);
  };

  useEffect(() => {
    getEkycInfo(getEkycInfoCallback);
  }, []);

  return (
    <>
      {showLoading && <Spinner />}
      <div className="page-success">
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
        {showRetryBtn && (
          <div className="flex-center">
            <IconButton
              size="lg"
              type="circle"
              label={t(labels.retryIdVerification)}
              icon={<img src={VerifyId} />}
              onClick={requestRegenerateEkycLink}
            />
          </div>
        )}
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
      <section className="toast__overlay margin-min">
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
