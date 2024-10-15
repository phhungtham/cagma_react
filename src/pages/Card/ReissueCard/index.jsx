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
  console.log('reissueCardSuccessInfo :>> ', reissueCardSuccessInfo);
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
  const isLogin = useSelector(loginSelector) || true;

  const handleCloseAlert = () => {
    setAlert({
      isShow: false,
      title: '',
      content: '',
    });
  };

  const requestGetCardInfo = async cardNumber => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCardInfo, { cashcd_no: cardNumber });
    setShowLoading(false);
    if (isSuccess) {
      const {
        cashcd_no_display: cardNumber,
        cashcd_acno1_display: primaryAcNo,
        cashcd_acno2_display: secondAcNo,
        cashcd_s: contactlessTransaction,
        day_cashcd_use_lmt_amt_display: dailyWithdrawalLimit,
        day_pos_use_lmt_amt_display: dailyPOSLimit,
        cashcd_iss_dt_display: issueDate,
        cashcd_vldt_dt_display: expireDate,
      } = data;
      setCardInfo({
        cardNumber,
        primaryAcNo,
        secondAcNo: secondAcNo || '-',
        contactlessTransaction: Number(contactlessTransaction) === 10 ? 'YES' : 'NO',
        dailyWithdrawalLimit: `$${dailyWithdrawalLimit}`,
        dailyPOSLimit: `$${dailyPOSLimit}`,
        issueDate,
        expireDate: expireDate,
      });
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleSubmitCardInfo = async values => {
    setShowLoading(true);
    const { cardNumber, expiryDate } = values;
    const cashcd_vldt_dt = formatCardDateRequest(expiryDate);
    const formattedCardNumber = cardNumber.replace(/\D/g, '');
    const payload = {
      cashcd_vldt_dt,
      cashcd_no: formattedCardNumber,
      dep_trx_dtl_d: '09',
    };
    const { error, isSuccess } = await requestApi(endpoints.cardVerificationStep1, payload);
    setShowLoading(false);
    if (!isSuccess) {
      if (isLogin) {
        await requestGetCardInfo(formattedCardNumber);
        setCurrentStep(REISSUE_CARD_STEP.ENTER_ADDRESS_INFORMATION);
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleSubmitAddressInfo = async values => {
    setShowLoading(true);
    const {
      streetNumber: street_no,
      streetName: street_nm,
      aptNumber: apt_suite_no,
      city,
      province,
      postalCode: post_cd,
      provinceOptions,
    } = values;
    const payload = {
      street_no,
      street_nm,
      apt_suite_no,
      city,
      province,
      post_cd,
    };
    await requestApi(endpoints.inquiryUserInformation);
    const { data, error, isSuccess } = await requestApi(endpoints.reissueCardLogged, payload);
    setShowLoading(false);
    if (!isSuccess) {
      if (isLogin) {
        const {
          street_no: streetNumber,
          street_nm: streetName,
          apt_suite_no: aptNumber,
          cus_city_nm: city,
          state_c: province,
          adr_zipc: postalCode,
          cashcd_iss_dt: issueDate,
        } = data;
        const provinceDisplay = provinceOptions.find(option => option.value === province)?.label || '';
        setReissueCardSuccessInfo({
          streetNumber,
          streetName,
          aptNumber,
          city,
          province: provinceDisplay,
          postalCode,
          issueDate,
        });
        setCurrentStep(REISSUE_CARD_STEP.COMPLETED);
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
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
