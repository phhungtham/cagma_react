import { useEffect, useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';

import ReportReleaseCardSuccess from './components/ReportReleaseCardSuccess';
import ReportReleaseDetail from './components/ReportReleaseDetail';
import { REPORT_RELEASE_CARD_STEP } from './constants';

const ReportReleaseCard = () => {
  const [currentStep, setCurrentStep] = useState(REPORT_RELEASE_CARD_STEP.ENTER_INFORMATION);
  const [reportDetail, setReportDetail] = useState();
  const [reportReleaseCardSuccessInfo, setReportReleaseCardSuccessInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const { requestApi } = useApi();

  const handleSubmitForm = () => {
    setReportReleaseCardSuccessInfo({
      cardNumber: '1234********1234',
      accountNo: '700 000 0000000',
      issueDate: 'May 05, 2024',
      status: 'Accident',
    });
    setCurrentStep(REPORT_RELEASE_CARD_STEP.COMPLETED);
  };

  const handleCloseAlert = () => {
    setAlert({
      isShow: false,
      title: '',
      content: '',
    });
  };

  const requestGetReportDetail = async () => {
    setShowLoading(true);
    await requestApi(endpoints.getCardList);
    const { data, error, isSuccess } = await requestApi(endpoints.getReportCardDetail);
    setShowLoading(false);
    if (isSuccess) {
      const { r_GIBD2111_1Vo: reportDetails } = data || {};
      if (reportDetails?.length) {
        const { regis_trx_dt: date, cashcd_acdnt_c_display: accountCode, cashcd_acdnt_desc: detail } = reportDetails[0];
        setReportDetail({
          date: formatYYYYMMDDToDisplay(date),
          accountCode,
          detail,
        });
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  useEffect(() => {
    requestGetReportDetail();
  }, []);

  return (
    <>
      <div className="report-release-card__wrapper page__wrapper">
        {showLoading && <Spinner />}
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

export default ReportReleaseCard;
