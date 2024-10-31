import { useEffect, useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import { getProvinceCode } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import useLoginInfo from '@hooks/useLoginInfo';
import { commonCodeDataToOptions } from '@utilities/convert';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import { formatCardDateRequest } from '../utils/format';
import EnterReissueAddressInfo from './components/EnterReissueAddressInfo';
import EnterReissueCardInfo from './components/EnterReissueCardInfo';
import ReissueCardSuccess from './components/ReissueCardSuccess';
import { REISSUE_CARD_STEP } from './constants';

const ReissueCard = ({ translate: t }) => {
  const [currentStep, setCurrentStep] = useState(REISSUE_CARD_STEP.ENTER_CARD_INFORMATION);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cardInfo, setCardInfo] = useState({});
  const [email, setEmail] = useState();
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
  const { isLogin } = useLoginInfo();

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
        expireDate,
      });
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestVerifyStep2NotLogged = async formValues => {
    const { postalCode: adr_zipc, dob: cus_bth_y4mm_dt } = formValues;
    const payload = {
      adr_zipc,
      cus_bth_y4mm_dt,
    };
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.cardVerificationStep2, payload);
    setShowLoading(false);
    if (isSuccess) {
      if (Number(data?.result_cd) === 1) {
        setCurrentStep(REISSUE_CARD_STEP.ENTER_ADDRESS_INFORMATION);
      }
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
      cusnm: '',
      dbcd_iss_rsn_c: 'S0351',
    };
    const { data, error, isSuccess } = await requestApi(endpoints.cardVerificationStep1, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { result_cd } = data || {};
      if (Number(result_cd) === 1) {
        if (isLogin) {
          await requestGetCardInfo(formattedCardNumber);
          setCurrentStep(REISSUE_CARD_STEP.ENTER_ADDRESS_INFORMATION);
        } else {
          const { cus_email } = data;
          setEmail(cus_email);
          requestVerifyStep2NotLogged(values);
        }
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestReissueCardLogged = async values => {
    setShowLoading(true);
    const {
      streetNumber: street_no,
      streetName: street_nm,
      aptNumber: apt_suite_no,
      city,
      province,
      postalCode: post_cd,
    } = values;
    const payload = {
      street_no,
      street_nm,
      apt_suite_no,
      city,
      province,
      post_cd,
    };
    await requestApi(endpoints.inquiryUserInformation); //Require by BE, do nothing
    const { data, error, isSuccess } = await requestApi(endpoints.reissueCardLogged, payload);
    setShowLoading(false);
    if (isSuccess) {
      if (Number(data?.result_cd) === 1) {
        const {
          street_no: streetNumber,
          street_nm: streetName,
          apt_suite_no: aptNumber,
          cus_city_nm: city,
          state_c_display: province,
          adr_zipc: postalCode,
          cashcd_iss_dt_display: issueDate,
        } = data;
        setReissueCardSuccessInfo({
          streetNumber,
          streetName,
          aptNumber,
          city,
          province,
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

  const requestReissueCardNotLogged = async values => {
    setShowLoading(true);
    await requestApi(endpoints.getCardReplacement); //Require by BE, do nothing
    const {
      streetNumber: street_no,
      streetName: street_nm,
      aptNumber: apt_suite_no,
      city,
      province,
      postalCode: post_cd,
      phoneNumber: cell_telno,
    } = values;
    const payload = {
      street_no,
      street_nm,
      apt_suite_no,
      city,
      province,
      post_cd,
      cell_telno,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.reissueCardNotLogged, payload);
    setShowLoading(false);
    if (isSuccess) {
      if (Number(data?.result_cd) === 1) {
        const {
          street_no: streetNumber,
          street_nm: streetName,
          apt_suite_no: aptNumber,
          cus_city_nm: city,
          state_c_display: province,
          adr_zipc: postalCode,
          cashcd_iss_dt_display: issueDate,
        } = data;
        setReissueCardSuccessInfo({
          streetNumber,
          streetName,
          aptNumber,
          city,
          province,
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

  const handleSubmitAddressInfo = async values => {
    if (isLogin) {
      requestReissueCardLogged(values);
    } else {
      requestReissueCardNotLogged(values);
    }
  };

  const requestGetProvinces = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, {
      code: getProvinceCode,
    });
    setShowLoading(false);
    if (isSuccess) {
      const { state_c: provinces } = data || {};
      const convertedProvince = commonCodeDataToOptions(provinces);
      setProvinceOptions(convertedProvince);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  useEffect(() => {
    requestGetProvinces();
  }, []);

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
            translate={t}
          />
        )}
        {currentStep === REISSUE_CARD_STEP.ENTER_ADDRESS_INFORMATION && (
          <EnterReissueAddressInfo
            onSubmit={handleSubmitAddressInfo}
            cardInfo={cardInfo}
            email={email}
            isLogin={isLogin}
            provinceOptions={provinceOptions}
            translate={t}
          />
        )}
        {currentStep === REISSUE_CARD_STEP.COMPLETED && (
          <ReissueCardSuccess
            cardInfo={reissueCardSuccessInfo}
            isLogin={isLogin}
            translate={t}
          />
        )}
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

export default withHTMLParseI18n(ReissueCard);
