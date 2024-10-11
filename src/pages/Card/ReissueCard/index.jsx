import { useState } from 'react';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { loginSelector } from 'app/redux/selector';

import { formatCardDateRequest } from '../utils/format';
import EnterReissueAddressInfo from './components/EnterReissueAddressInfo';
import EnterReissueCardInfo from './components/EnterReissueCardInfo';
import ReissueCardSuccess from './components/ReissueCardSuccess';
import { REISSUE_CARD_STEP } from './constants';

const ReissueCard = () => {
  const [currentStep, setCurrentStep] = useState(REISSUE_CARD_STEP.ENTER_CARD_INFORMATION);
  const [cardInfo, setCardInfo] = useState({});
  const [reissueCardSuccessInfo, setReissueCardSuccessInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);
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
  const isLogin = useSelector(loginSelector) || false;

  const handleCloseAlert = () => {
    setAlert({
      isShow: false,
      title: '',
      content: '',
    });
  };

  const handleSubmitCardInfo = async values => {
    setShowLoading(true);
    const { cardNumber, expiryDate } = values;
    const cashcd_vldt_dt = formatCardDateRequest(expiryDate);
    const formattedCardNumber = cardNumber.replace(/\D/g, '');
    const payload = {
      cusnm: '',
      cashcd_vldt_dt,
      cashcd_no: formattedCardNumber,
      dep_trx_dtl_d: '09',
      dbcd_iss_rsn_c: 'S0351',
    };
    const { data, error, isSuccess } = await requestApi(endpoints.cardVerificationStep1, payload);
    setShowLoading(false);
    if (isSuccess) {
      // enterSecurityPasscode();
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
    // if (isLogin) {
    //   setCardInfo({
    //     cardNumber: '5021 3000 0000 0000',
    //     primaryAcNo: '700 000 00000',
    //     secondAcNo: '-',
    //     contactlessTransaction: 'NO',
    //     dailyWithdrawalLimit: '$5,000.00',
    //     dailyPOSLimit: '$5,000.00',
    //     issueDate: 'Jan 01, 2024',
    //     expireDate: '03/25',
    //   });
    // }
    // setCurrentStep(REISSUE_CARD_STEP.ENTER_ADDRESS_INFORMATION);
  };

  const handleSubmitAddressInfo = values => {
    setReissueCardSuccessInfo({
      streetNumber: '123',
      streetName: 'Young ST',
      aptNumber: '123',
      city: 'Toronto',
      province: 'On-ontrairo',
      postalCode: 'A9A9A9',
      issueDate: 'Jun 09, 2024',
    });
    setCurrentStep(REISSUE_CARD_STEP.COMPLETED);
  };

  return (
    <>
      <div className="reissue-card__wrapper page__wrapper">
        {showLoading && <Spinner />}
        {currentStep === REISSUE_CARD_STEP.ENTER_CARD_INFORMATION && (
          <EnterReissueCardInfo
            onSubmit={handleSubmitCardInfo}
            isLogin={isLogin}
            setShowLoading={setShowLoading}
            requestApi={requestApi}
            setAlert={setAlert}
            setShowToast={setShowToast}
          />
        )}
        {currentStep === REISSUE_CARD_STEP.ENTER_ADDRESS_INFORMATION && (
          <EnterReissueAddressInfo
            onSubmit={handleSubmitAddressInfo}
            cardInfo={cardInfo}
            isLogin={isLogin}
          />
        )}
        {currentStep === REISSUE_CARD_STEP.COMPLETED && (
          <ReissueCardSuccess
            cardInfo={reissueCardSuccessInfo}
            isLogin={isLogin}
          />
        )}
      </div>
      <section className="toast__overlay">
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
        textAlign="left"
        onClose={handleCloseAlert}
        firstButton={{
          onClick: handleCloseAlert,
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default ReissueCard;
