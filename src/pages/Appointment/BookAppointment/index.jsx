import { useState } from 'react';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { languageMapWithBranchNameField } from '@common/constants/branch';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useLoginInfo from '@hooks/useLoginInfo';
import { buildRequestPayloadBaseMappingFields } from '@utilities/convert';
import { appLanguage, nativeParamsSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import { BookAppointmentType } from '../constants';
import BookAppointmentAgreement from './components/BookAppointmentAgreement';
import BookAppointmentForm from './components/BookAppointmentForm';
import BookAppointmentSuccessful from './components/BookAppointmentSuccessful';
import { bookAppointmentFormMapFields } from './constants';

const BookAppointmentStep = {
  AGREEMENT: 'agreement',
  ENTER_INFO_FORM: 'enterInfo',
  COMPLETED: 'completed',
};

const BookAppointment = ({ translate: t }) => {
  const nativeParams = useSelector(nativeParamsSelector);
  const currentLanguage = useSelector(appLanguage);
  const { isLogin } = useLoginInfo();
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [currentStep, setCurrentStep] = useState(BookAppointmentStep.AGREEMENT);
  const [appointmentSuccessData, setAppointmentSuccessData] = useState();
  const { requestApi } = useApi();
  const langStr = currentLanguage?.language;
  const { type, branchNo } = nativeParams || {};

  const handleAgreeTerms = () => {
    setCurrentStep(BookAppointmentStep.ENTER_INFO_FORM);
  };

  const handleBookAppointment = async formValues => {
    setShowLoading(true);
    const request = buildRequestPayloadBaseMappingFields(formValues, bookAppointmentFormMapFields);
    request.apint_guest_chk = isLogin ? 'N' : 'Y'; //Alway is new customer if user not logged
    request.apint_visit_chk = type === BookAppointmentType.IN_PERSON ? 'Y' : 'N';
    request.apint_brno = branchNo;
    const { data, error, isSuccess } = await requestApi(endpoints.bookAppointment, request);
    setShowLoading(false);
    if (isSuccess) {
      const {
        apint_visit_chk: visitCheck,
        br_adr: address,
        apint_reg_dt_display: date,
        apint_reg_tm_display: time,
        apint_seq: confirmNumber,
        apint_memo: additionalComments,
      } = data;
      const branchName = data[languageMapWithBranchNameField[langStr]] || data.lcl_br_nm;
      const bookAppointmentSuccessData = {
        visitCheck,
        method: visitCheck === 'Y' ? 'In person' : 'Zoom',
        branchName,
        address,
        date,
        time,
        confirmNumber: `#${confirmNumber}`,
        additionalComments,
      };
      setAppointmentSuccessData(bookAppointmentSuccessData);
      setCurrentStep(BookAppointmentStep.COMPLETED);
      return;
    } else {
      setShowAlert({
        isShow: true,
        content: error,
        title: '',
      });
    }
  };

  const handleMoveBack = () => {
    setCurrentStep(BookAppointmentStep.AGREEMENT);
  };

  return (
    <>
      {showLoading && <Spinner />}
      {currentStep === BookAppointmentStep.AGREEMENT && (
        <BookAppointmentAgreement
          onSubmit={handleAgreeTerms}
          translate={t}
        />
      )}
      {currentStep === BookAppointmentStep.ENTER_INFO_FORM && (
        <BookAppointmentForm
          type={type}
          onSubmit={handleBookAppointment}
          translate={t}
          isLogin={isLogin}
          setShowAlert={setShowAlert}
          moveBack={handleMoveBack}
        />
      )}
      {currentStep === BookAppointmentStep.COMPLETED && (
        <BookAppointmentSuccessful
          appointmentInfo={appointmentSuccessData}
          translate={t}
          isLogin={isLogin}
        />
      )}
      <Alert
        isCloseButton={false}
        isShowAlert={showAlert.isShow}
        title={showAlert.title}
        subtitle={showAlert.content}
        textAlign="left"
        onClose={() => setShowAlert({ isShow: false, title: '', content: '' })}
        firstButton={{
          onClick: () => setShowAlert({ isShow: false, title: '', content: '' }),
          label: t(ctaLabels.confirm),
        }}
      />
    </>
  );
};

export default withHTMLParseI18n(BookAppointment);
