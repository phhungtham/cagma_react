import { useState } from 'react';

import reportLostImg from '@assets/images/loud-speaker.png';
import Alert from '@common/components/molecules/Alert';

import EnterReportLostInfo from './components/EnterReportLostInfo';
import ReportLostCardSuccess from './components/ReportLostCardSuccess';
import { REPORT_LOST_CARD_STEP } from './constants';
import './styles.scss';

const ReportLostCard = () => {
  const [currentStep, setCurrentStep] = useState(REPORT_LOST_CARD_STEP.ENTER_INFORMATION);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [reportLostCardSuccessInfo, setReportLostCardSuccessInfo] = useState();

  const handleSubmitForm = () => {
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

  return (
    <>
      <div className="report-lost-card__wrapper">
        {currentStep === REPORT_LOST_CARD_STEP.ENTER_INFORMATION && <EnterReportLostInfo onSubmit={handleSubmitForm} />}
        {currentStep === REPORT_LOST_CARD_STEP.COMPLETED && (
          <ReportLostCardSuccess cardInfo={reportLostCardSuccessInfo} />
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
