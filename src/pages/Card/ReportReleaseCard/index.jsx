import { useEffect, useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { initAlert } from '@common/constants/bottomsheet';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useMove from '@hooks/useMove';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import authSecurityMedia from '@utilities/gmSecure/authSecurityMedia';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import { CardAccidentType } from '../CardMain/constants';
import ReportReleaseCardSuccess from './components/ReportReleaseCardSuccess';
import ReportReleaseDetail from './components/ReportReleaseDetail';
import { REPORT_RELEASE_CARD_STEP } from './constants';

const ReportReleaseCard = ({ translate: t }) => {
  const [currentStep, setCurrentStep] = useState(REPORT_RELEASE_CARD_STEP.ENTER_INFORMATION);
  const [reportDetail, setReportDetail] = useState();
  const [reportReleaseCardSuccessInfo, setReportReleaseCardSuccessInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState(initAlert);
  const { moveInitHomeNative } = useMove();
  const { requestApi } = useApi();

  const handleRequestReleaseCard = async values => {
    setShowLoading(true);
    const payload = {
      glb_id: reportDetail.globalId,
      cashcd_acdnt_c: reportDetail.cardAccountCode,
      cashcd_acdnt_rls_desc: values.accident,
    };
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.reportReleaseCard, payload);
    setShowLoading(false);
    if (isSuccess) {
      const {
        result_cd,
        mask_cashcd_no: cardNumber,
        cashcd_acno: accountNo,
        cashcd_acno_display: accountNoDisplay,
        issue_dt: issueDate,
        acdnt_cnt: accidentCount,
      } = data || {};
      if (Number(result_cd) === 1) {
        setReportReleaseCardSuccessInfo({
          cardNumber: cardNumber,
          accountNo: accountNoDisplay || accountNo,
          issueDate: issueDate,
          status: accidentCount === CardAccidentType.REPORTED ? 'Accident' : 'Normal',
        });
        setCurrentStep(REPORT_RELEASE_CARD_STEP.COMPLETED);
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
        title: '',
        requiredLogin,
      });
    }
  };

  const handleSubmitForm = async values => {
    authSecurityMedia(() => handleRequestReleaseCard(values));
  };

  const handleCloseAlert = () => {
    if (alert.requiredLogin) {
      moveInitHomeNative('initHome');
    }
    setAlert(initAlert);
  };

  const requestGetReportDetail = async () => {
    setShowLoading(true);
    await requestApi(endpoints.getCardList);
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.getReportCardDetail);
    setShowLoading(false);
    if (isSuccess) {
      const { r_GIBD2111_1Vo: reportDetails } = data || {};
      if (reportDetails?.length) {
        const {
          cashcd_acdnt_c: cardAccountCode,
          regis_trx_dt: date,
          cashcd_acdnt_c_display: accountCode,
          cashcd_acdnt_desc: detail,
          glb_id: globalId,
        } = reportDetails[0];
        setReportDetail({
          date: formatYYYYMMDDToDisplay(date),
          accountCode,
          detail,
          globalId,
          cardAccountCode,
        });
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
        requiredLogin,
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
            translate={t}
          />
        )}
        {currentStep === REPORT_RELEASE_CARD_STEP.COMPLETED && (
          <ReportReleaseCardSuccess
            cardInfo={reportReleaseCardSuccessInfo}
            translate={t}
          />
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
          label: t(ctaLabels.confirm),
        }}
      />
    </>
  );
};

export default withHTMLParseI18n(ReportReleaseCard);
