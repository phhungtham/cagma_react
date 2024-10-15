import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import reportLostImg from '@assets/images/loud-speaker.png';
import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { loginSelector, nativeParamsSelector } from 'app/redux/selector';

import { ReportLostNotLoggedType } from '../constants';
import { formatCardDateRequest } from '../utils/format';
import EnterReportLostCardInfo from './components/EnterReportLostCardInfo';
import EnterReportLostCustomerInfo from './components/EnterReportLostCustomerInfo';
import EnterReportLostReason from './components/EnterReportLostReason';
import ReportLostCardSuccess from './components/ReportLostCardSuccess';
import { REPORT_LOST_CARD_STEP, ReportLostCardType } from './constants';
import './styles.scss';

const ReportLostCard = () => {
  const [currentStep, setCurrentStep] = useState(REPORT_LOST_CARD_STEP.ENTER_INFORMATION);
  const [notLoggedFormType, setNotLoggedFormType] = useState(ReportLostNotLoggedType.ENTER_CUSTOMER_INFO);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [reportLostCardSuccessInfo, setReportLostCardSuccessInfo] = useState();
  const nativeParams = useSelector(nativeParamsSelector);
  const isLogin = useSelector(loginSelector);
  const [accident, setAccident] = useState();
  const [formValues, setFormValues] = useState();
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
    setAlert({
      isShow: false,
      title: '',
      content: '',
    });
  };

  const requestReportLostLogged = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.reportLostLogged, {
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
      const { accident: cashcd_acdnt_desc, dob: cus_bth_y4mm_dt } = formValues;
      payload = {
        report_type: ReportLostCardType.UNKNOWN_CARD_NO,
        cashcd_acdnt_desc,
        cus_bth_y4mm_dt,
      };
    }
    const { error, isSuccess } = await requestApi(endpoints.reportLostNotLogged, payload);
    setShowLoading(false);
    if (isSuccess) {
      setCurrentStep(REPORT_LOST_CARD_STEP.COMPLETED);
    } else {
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
              <EnterReportLostReason onSubmit={handleSubmitForm} />
            ) : (
              <>
                {notLoggedFormType === ReportLostNotLoggedType.ENTER_CARD_NUMBER ? (
                  <EnterReportLostCardInfo
                    onSubmit={handleSubmitCardInfo}
                    setAlert={setAlert}
                    setShowLoading={setShowLoading}
                    setShowToast={setShowToast}
                  />
                ) : (
                  <EnterReportLostCustomerInfo
                    onSubmit={handleSubmitCustomerInfo}
                    setAlert={setAlert}
                    setShowLoading={setShowLoading}
                    setShowToast={setShowToast}
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
          />
        )}
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={showConfirmAlert}
        onClose={() => setShowConfirmAlert(false)}
        textAlign="center"
        title="Are you sure you want to report the card as lost?"
        subtitle={
          <>
            <p>
              After register the accident report, You will be limited to use your card. You will be able to use after
              you release the accident report. You can release the accident report only if you register by internet
              banking.
            </p>
            <p>Do you want to register the accident report?</p>
          </>
        }
        firstButton={{
          onClick: handleConfirmReport,
          label: 'Confirm',
        }}
        secondButton={{
          onClick: () => setShowConfirmAlert(false),
          label: 'Cancel',
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
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default ReportLostCard;
