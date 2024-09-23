import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import reportLostImg from '@assets/images/loud-speaker.png';
import Alert from '@common/components/molecules/Alert';
import { loginSelector, nativeParamsSelector } from 'app/redux/selector';

import { ReportLostNotLoggedType } from '../constants';
import EnterReportLostCardInfo from './components/EnterReportLostCardInfo';
import EnterReportLostCustomerInfo from './components/EnterReportLostCustomerInfo';
import EnterReportLostReason from './components/EnterReportLostReason';
import ReportLostCardSuccess from './components/ReportLostCardSuccess';
import { REPORT_LOST_CARD_STEP } from './constants';
import './styles.scss';

const ReportLostCard = () => {
  const [currentStep, setCurrentStep] = useState(REPORT_LOST_CARD_STEP.ENTER_INFORMATION);
  const [notLoggedFormType, setNotLoggedFormType] = useState(ReportLostNotLoggedType.ENTER_CUSTOMER_INFO);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [reportLostCardSuccessInfo, setReportLostCardSuccessInfo] = useState();
  const nativeParams = useSelector(nativeParamsSelector);
  const isLogin = useSelector(loginSelector);

  console.log('nativeParams :>> ', nativeParams);

  const handleSubmitForm = () => {
    setShowConfirmAlert(true);
  };

  const handleSubmitCardInfo = () => {
    setShowConfirmAlert(true);
  };

  const handleSubmitCustomerInfo = () => {
    setShowConfirmAlert(true);
  };

  const handleConfirmReport = () => {
    setReportLostCardSuccessInfo({
      cardNumber: '1234********1234',
      accountNo: '700 000 0000000',
      issueDate: 'May 05, 2024',
      status: 'Accident',
    });
    setShowConfirmAlert(false);
    setCurrentStep(REPORT_LOST_CARD_STEP.COMPLETED);
  };

  useEffect(() => {
    if (nativeParams?.type) {
      setNotLoggedFormType(nativeParams.type);
    }
  }, []);

  return (
    <>
      <div className="report-lost-card__wrapper page__wrapper">
        {currentStep === REPORT_LOST_CARD_STEP.ENTER_INFORMATION && (
          <>
            {isLogin ? (
              <EnterReportLostReason onSubmit={handleSubmitForm} />
            ) : (
              <>
                {notLoggedFormType === ReportLostNotLoggedType.ENTER_CARD_NUMBER ? (
                  <EnterReportLostCardInfo onSubmit={handleSubmitCardInfo} />
                ) : (
                  <EnterReportLostCustomerInfo onSubmit={handleSubmitCustomerInfo} />
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
        textAlign="left"
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
    </>
  );
};

export default ReportLostCard;
