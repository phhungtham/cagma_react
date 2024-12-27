import { useContext, useState } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
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
  const { translate: t, userId, email, setShowLoading, setAlert } = useContext(UpdateEmailContext);
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

  const handleStartOver = () => {
    // if (isNavigateFromLogin) {
    //   clearEkycInfo();
    //   moveHomeNative();
    // } else {
    //   onNavigateVerifyMember();
    // }
  };

  const requestRegenerateEkycLink = async () => {
    // setShowLoading(true);
    // const { email, firstName, lastName, packageId } = ekycCached;
    // const payload = {
    //   cus_email: email,
    //   uuid_v: deviceId,
    //   cus_fst_nm: firstName,
    //   cus_last_nm: lastName,
    //   e_sgn_trx_id: packageId,
    // };
    // const { data, error, isSuccess } = await requestApi(endpoints.regenerateEkycLink, payload);
    // setShowLoading(false);
    // if (isSuccess) {
    //   const link = data?.signingUrl || '';
    //   openURLInBrowser(link, true);
    // } else {
    //   return setAlert({
    //     isShow: true,
    //     content: error,
    //   });
    // }
  };

  const requestRegisterCustomerInfoStep3 = async () => {
    // const { ekyc_aplct_stp_c, cusno } = ekycStepStatus || {};
    // //Ignore call API, navigate directly to Enter Personal Detail Screen
    // if (Number(ekyc_aplct_stp_c) === 3) {
    //   const isFetchCustomerData = !!cusno;
    //   return onConfirm(isFetchCustomerData);
    // }
    // setShowLoading(true);
    // const { email, firstName, lastName, packageId } = ekycCached;
    // const payload = {
    //   cus_email: email,
    //   uuid_v: deviceId,
    //   cus_fst_nm: firstName,
    //   cus_last_nm: lastName,
    //   e_sgn_trx_id: packageId,
    // };
    // const { data, error, isSuccess } = await requestApi(endpoints.preRegisterCustomerInfoStep3, payload);
    // setShowLoading(false);
    // if (isSuccess) {
    //   const { confm_proc_s: processingStatus, cusno } = data || {};
    //   if (['20', '30'].includes(processingStatus)) {
    //     setShowRetryBtn(true);
    //     setShowToast({
    //       isShow: true,
    //       message: t(labels.unableToRetrieve),
    //       type: 'error',
    //     });
    //   } else if (processingStatus === '40') {
    //     const isFetchCustomerData = !!cusno;
    //     onConfirm(isFetchCustomerData);
    //   } else if (['50', '60'].includes(processingStatus)) {
    //     return navigateToVerifyResult(VerifyMembershipResultStatus.FAILED);
    //   }
    // } else {
    //   return setAlert({
    //     isShow: true,
    //     content: error,
    //   });
    // }
  };

  const checkUpdateEmailStatus = async () => {
    setShowLoading(true);
    const payload = {
      userId,
      cus_email: email,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.inquiryUserVerification, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { confm_proc_s: processingStatus } = data || {};
      if (['20', '30'].includes(processingStatus)) {
        setShowRetryBtn(true);
        // setShowToast({
        //   isShow: true,
        //   message: t(labels.unableToRetrieve),
        //   type: 'error',
        // });
      } else if (processingStatus === '40') {
        clearEmailUpdateInfo();
        setVerifyStatus(UpdateEmailVerifyStatus.SUCCESS);
      } else if (['50', '60'].includes(processingStatus)) {
        clearEmailUpdateInfo();
        setVerifyStatus(UpdateEmailVerifyStatus.FAILED);
      }
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleResendEmail = async () => {
    //TODO: Handle resend email
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
      {/* <section className="toast__overlay ekyc-in-progress__toast">
        <Toast
          isShowToast={showToast.isShow}
          type={showToast.type}
          onClose={() => setShowToast({ ...showToast, isShow: false })}
          message={showToast.message}
        />
      </section> */}
    </>
  );
};

export default IdentityVerifyResult;
