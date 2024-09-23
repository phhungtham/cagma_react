import { useEffect, useState } from 'react';

import ReportReleaseCardSuccess from './components/ReportReleaseCardSuccess';
import ReportReleaseDetail from './components/ReportReleaseDetail';
import { REPORT_RELEASE_CARD_STEP } from './constants';

const ReportReleaseCard = () => {
  const [currentStep, setCurrentStep] = useState(REPORT_RELEASE_CARD_STEP.ENTER_INFORMATION);
  const [reportDetail, setReportDetail] = useState();
  const [reportReleaseCardSuccessInfo, setReportReleaseCardSuccessInfo] = useState();

  const handleSubmitForm = () => {
    setReportReleaseCardSuccessInfo({
      cardNumber: '1234********1234',
      accountNo: '700 000 0000000',
      issueDate: 'May 05, 2024',
      status: 'Accident',
    });
    setCurrentStep(REPORT_RELEASE_CARD_STEP.COMPLETED);
  };

  useEffect(() => {
    setReportDetail({
      date: 'Jan 01, 2024',
      accountCode: '(CARD) STOP PAYMENT',
      detail: 'I lost my card.',
    });
  }, []);

  return (
    <div className="report-release-card__wrapper page__wrapper">
      {currentStep === REPORT_RELEASE_CARD_STEP.ENTER_INFORMATION && (
        <ReportReleaseDetail
          reportDetail={reportDetail}
          onSubmit={handleSubmitForm}
        />
      )}
      {currentStep === REPORT_RELEASE_CARD_STEP.COMPLETED && (
        <ReportReleaseCardSuccess cardInfo={reportReleaseCardSuccessInfo} />
      )}
    </div>
  );
};

export default ReportReleaseCard;
