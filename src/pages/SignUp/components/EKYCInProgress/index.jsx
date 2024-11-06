import { useContext, useEffect, useState } from 'react';

import loading from '@assets/lottie/ekyc-loading.json';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import getEkycInfo from '@utilities/gmCommon/getEkycInfo';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { moveHome } from '@utilities/index';
import Lottie from 'lottie-react';

const EKYCInProgress = ({ onConfirm }) => {
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
      // e_sgn_trx_id: 'gb8VlErDk47oUJRURSFO7XwXspQ=',
    };
    const { data, error, isSuccess } = await requestApi(endpoints.regenerateEkycLink, payload);
    setShowLoading(false);
    if (isSuccess) {
      setShowRetryBtn(false);
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
    const { email, firstName, lastName, packageId } = ekycPluginInfo;
    const payload = {
      cus_email: email,
      uuid_v: deviceId,
      cus_fst_nm: firstName,
      cus_last_nm: lastName,
      e_sgn_trx_id: packageId,
      // e_sgn_trx_id: 'dSnooW1bbYqt4puzYtJRfd3bsM4=',
    };
    const { data, error, isSuccess } = await requestApi(endpoints.preRegisterCustomerInfoStep3, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { confm_proc_s: processingStatus } = data || {};
      //TODO: Handle other case
      if (processingStatus === '30') {
        setShowRetryBtn(true);
        setShowToast({
          isShow: true,
          message: 'Identity verification is incomplete. Please check again.',
          type: 'info',
        });
        //TODO: Just for test
        onConfirm();
      } else if (processingStatus === '10') {
        onConfirm();
      }
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleCheckResult = async () => {
    setShowLoading(true);
    if (showRetryBtn) {
      return requestRegenerateEkycLink();
    } else {
      return requestRegisterCustomerInfoStep3();
    }

    // const success = false;
    // const message = success ? '' : 'Identity verification is incomplete. Please check again.';
    // setShowToast({
    //   isShow: true,
    //   message: message,
    //   type: success ? 'success' : 'info',
    // });

    // //For test
    // setTimeout(() => {
    //   onConfirm();
    // }, 2000);
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  const checkEkycStatus = async email => {
    setShowLoading(true);
    const payload = {
      cus_email: email,
      uuid_v: deviceId,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.checkEkycStatus, payload);
    setShowLoading(false);
    if (isSuccess) {
      // debugger;
      // setEkycInfo({
      //   ...ekycPluginInfo,
      //   firstName,
      //   lastName,
      //   isEkycProcessing: true,
      //   packageId: data.e_sgn_trx_id,
      // });
      // onConfirm(data.signingUrl);
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const getEkycInfoCallback = result => {
    setEkycPluginInfo(result);
    checkEkycStatus(result?.email);
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
            <Lottie
              animationData={loading} //TODO: Change size and color of loading
              loop
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
          label={showRetryBtn ? 'Retry' : 'Done'}
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
