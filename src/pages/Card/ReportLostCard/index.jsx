import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import reportLostImg from '@assets/images/loud-speaker.png';
import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import { initAlert } from '@common/constants/bottomsheet';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, reportLostCardLabels as labels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useLoginInfo from '@hooks/useLoginInfo';
import useMove from '@hooks/useMove';
import { nativeParamsSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import { ReportLostNotLoggedType } from '../constants';
import { formatCardDateRequest } from '../utils/format';
import EnterReportLostCardInfo from './components/EnterReportLostCardInfo';
import EnterReportLostCustomerInfo from './components/EnterReportLostCustomerInfo';
import EnterReportLostReason from './components/EnterReportLostReason';
import ReportLostCardSuccess from './components/ReportLostCardSuccess';
import { REPORT_LOST_CARD_STEP, ReportLostCardType } from './constants';
import './styles.scss';

const ReportLostCard = ({ translate: t }) => {
  const [currentStep, setCurrentStep] = useState(REPORT_LOST_CARD_STEP.ENTER_INFORMATION);
  const [notLoggedFormType, setNotLoggedFormType] = useState(ReportLostNotLoggedType.ENTER_CUSTOMER_INFO);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [reportLostCardSuccessInfo, setReportLostCardSuccessInfo] = useState();
  const nativeParams = useSelector(nativeParamsSelector);
  const { isLogin } = useLoginInfo();
  const [accident, setAccident] = useState();
  const [formValues, setFormValues] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState(initAlert);
  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });
  const [showIdentificationUnknownCard, setShowIdentificationUnknownCard] = useState(false);
  const { moveInitHomeNative } = useMove();
  const { requestApi } = useApi();

  const handleSubmitForm = values => {
    setAccident(values.accident);
    setShowConfirmAlert(true);
  };

  const handleSubmitCardInfo = values => {
    setFormValues(values);
    setShowConfirmAlert(true);
  };

  const handleSubmitCustomerInfo = values => {
    setFormValues(values);
    setShowConfirmAlert(true);
  };

  const handleCloseAlert = () => {
    if (alert.requiredLogin) {
      moveInitHomeNative('initHome');
    }
    setAlert(initAlert);
  };

  const requestReportLostLogged = async () => {
    setShowLoading(true);
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.reportLostLogged, {
      cashcd_acdnt_c: '74', //Default account code
      cashcd_acdnt_desc: accident,
    });
    setShowLoading(false);
    if (isSuccess) {
      setReportLostCardSuccessInfo({
        cardNumber: data?.mask_cashcd_no,
        accountNo: data?.cashcd_acno,
        issueDate: data?.issue_dt,
        status: Number(data?.acdnt_cnt) === 1 ? 'Accident' : 'Normal',
      });
      setCurrentStep(REPORT_LOST_CARD_STEP.COMPLETED);
    } else {
      setAlert({
        isShow: true,
        content: error,
        title: '',
        requiredLogin,
      });
    }
  };

  const requestReportLostNotLogged = async () => {
    setShowLoading(true);
    let payload = {};
    if (notLoggedFormType === ReportLostNotLoggedType.ENTER_CARD_NUMBER) {
      const { cardNumber, expiryDate, accident: cashcd_acdnt_desc } = formValues;
      const cashcd_vldt_dt = formatCardDateRequest(expiryDate);
      const formattedCardNumber = cardNumber.replace(/\D/g, '');
      payload = {
        report_type: ReportLostCardType.KNOW_CARD_NO,
        cashcd_no: formattedCardNumber,
        cashcd_vldt_dt,
        cashcd_acdnt_desc,
      };
    } else {
      const {
        accident: cashcd_acdnt_desc,
        dob: cus_bth_y4mm_dt,
        firstName: cus_fst_nm,
        lastName: cus_last_nm,
        phoneNumber: cus_adr_telno,
        postalCode: cus_adr_zipc,
        identification: lcl_cus_rlnm_no,
      } = formValues;

      payload = {
        report_type: ReportLostCardType.UNKNOWN_CARD_NO,
        cashcd_acdnt_desc,
        cus_bth_y4mm_dt,
        cus_fst_nm,
        cus_last_nm,
        cus_adr_telno,
        cus_adr_zipc,
        lcl_cus_rlnm_no,
      };
    }
    const { data, error, isSuccess, errorCode } = await requestApi(endpoints.reportLostNotLogged, payload);
    setShowLoading(false);
    if (isSuccess) {
      if (Number(data?.result_cd) === 1) {
        setCurrentStep(REPORT_LOST_CARD_STEP.COMPLETED);
      }
    } else {
      setShowIdentificationUnknownCard(true);
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleConfirmReport = async () => {
    setShowConfirmAlert(false);
    if (isLogin) {
      requestReportLostLogged();
    } else {
      requestReportLostNotLogged();
    }
  };

  useEffect(() => {
    if (nativeParams?.type) {
      setNotLoggedFormType(nativeParams.type);
    }
  }, []);

  return (
    <>
      <div className="report-lost-card__wrapper page__wrapper">
        {showLoading && <Spinner />}

        {currentStep === REPORT_LOST_CARD_STEP.ENTER_INFORMATION && (
          <>
            {isLogin ? (
              <EnterReportLostReason
                onSubmit={handleSubmitForm}
                translate={t}
              />
            ) : (
              <>
                {notLoggedFormType === ReportLostNotLoggedType.ENTER_CARD_NUMBER ? (
                  <EnterReportLostCardInfo
                    onSubmit={handleSubmitCardInfo}
                    setAlert={setAlert}
                    setShowLoading={setShowLoading}
                    setShowToast={setShowToast}
                    translate={t}
                  />
                ) : (
                  <EnterReportLostCustomerInfo
                    onSubmit={handleSubmitCustomerInfo}
                    setAlert={setAlert}
                    setShowLoading={setShowLoading}
                    setShowToast={setShowToast}
                    translate={t}
                    showIdentification={showIdentificationUnknownCard}
                  />
                )}
              </>
            )}
          </>
        )}
        {currentStep === REPORT_LOST_CARD_STEP.COMPLETED && (
          <ReportLostCardSuccess
            cardInfo={reportLostCardSuccessInfo}
            isLogin={isLogin}
            translate={t}
          />
        )}
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={showConfirmAlert}
        onClose={() => setShowConfirmAlert(false)}
        textAlign="center"
        title={t(labels.areYouSure)}
        subtitle={
          <>
            <p>{t(labels.afterRegisterAccident)}</p>
          </>
        }
        firstButton={{
          onClick: handleConfirmReport,
          label: t(labels.confirm),
        }}
        secondButton={{
          onClick: () => setShowConfirmAlert(false),
          label: t(labels.cancel),
        }}
      >
        <div className="report-lost-card__img">
          <img
            src={reportLostImg}
            alt="Report lost card"
          />
        </div>
      </Alert>
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
          label: t(ctaLabels.confirm),
        }}
      />
    </>
  );
};

export default withHTMLParseI18n(ReportLostCard);
