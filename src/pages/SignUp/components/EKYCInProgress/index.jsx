import { useContext, useEffect, useState } from 'react';

import VerifyId from '@assets/images/icon-fill-idpw-24.png';
import LoadingImg from '@assets/images/signup-spinner.png';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import { VerifyMembershipResultStatus } from '@pages/SignUp/constants';
import getEkycInfo from '@utilities/gmCommon/getEkycInfo';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { moveHome } from '@utilities/index';

const EKYCInProgress = ({ onConfirm, navigateToVerifyResult }) => {
  const { deviceId } = useContext(SignUpContext);
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
    moveHome();
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
    setShowLoading(true);
    const { email, firstName, lastName, packageId } = ekycPluginInfo;
    const payload = {
      cus_email: email,
      uuid_v: deviceId || 'deviceId',
      cus_fst_nm: firstName,
      cus_last_nm: lastName,
      e_sgn_trx_id: packageId,
      // e_sgn_trx_id: 'dSnooW1bbYqt4puzYtJRfd3bsM4=',
    };
    const { data, error, isSuccess } = await requestApi(endpoints.preRegisterCustomerInfoStep3, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { confm_proc_s: processingStatus, cusno } = data || {};
      if (['20', '30', '40'].includes(processingStatus)) {
        setShowRetryBtn(true);
        setShowToast({
          isShow: true,
          message: 'Unable to retrieve the verification result. Please check again.',
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
            <span>Identity verification is on progress</span>
          </div>
          <div className="note">
            Please complete verification on the external link, then return to the app to continue.
          </div>
        </div>
        {showRetryBtn && (
          <div className="flex-center">
            <IconButton
              size="lg"
              type="circle"
              label="Retry ID Verification"
              icon={<img src={VerifyId} />}
              onClick={requestRegenerateEkycLink}
            />
          </div>
        )}
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
          label="Continue"
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
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default EKYCInProgress;
