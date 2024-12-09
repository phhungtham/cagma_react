import { useState } from 'react';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels } from '@common/constants/labels';
import useLoginInfo from '@hooks/useLoginInfo';
import { apiCall } from '@shared/api';
import { buildRequestPayloadBaseMappingFields } from '@utilities/convert';
import { nativeParamsSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import { BookAppointmentType } from '../constants';
import BookAppointmentForm from './components/BookAppointmentForm';
import BookAppointmentSuccessful from './components/BookAppointmentSuccessful';
import { bookAppointmentFormMapFields } from './constants';

const BookAppointmentStep = {
  ENTER_INFO_FORM: 'enterInfo',
  COMPLETED: 'completed',
};

const BookAppointment = ({ translate: t }) => {
  const nativeParams = useSelector(nativeParamsSelector);
  const { isLogin } = useLoginInfo();
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [currentStep, setCurrentStep] = useState(BookAppointmentStep.ENTER_INFO_FORM);
  const [appointmentSuccessData, setAppointmentSuccessData] = useState();
  const { type, branchNo } = nativeParams || {};

  const handleBookAppointment = async formValues => {
    setShowLoading(true);
    const request = buildRequestPayloadBaseMappingFields(formValues, bookAppointmentFormMapFields);
    request.apint_guest_chk = isLogin ? 'N' : 'Y'; //Alway is new customer if user not logged
    request.apint_visit_chk = type === BookAppointmentType.IN_PERSON ? 'Y' : 'N';
    request.apint_brno = branchNo;
    const bookAppointmentResponse = await apiCall(endpoints.bookAppointment, 'POST', request);
    setShowLoading(false);
    if (bookAppointmentResponse?.data?.elData) {
      const {
        apint_visit_chk: visitCheck,
        lcl_br_nm: branchName,
        br_adr: address,
        apint_reg_dt_display: date,
        apint_reg_tm_display: time,
        apint_seq: confirmNumber,
        apint_memo: additionalComments,
      } = bookAppointmentResponse.data.elData || {};
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
    }
    const responseErrorMessage = bookAppointmentResponse?.data?.elHeader?.resMsgVo?.msgText;
    if (responseErrorMessage) {
      setShowAlert({
        isShow: true,
        title: '',
        content: bookAppointmentResponse.data.elHeader.resMsgVo.msgText,
      });
    }
  };

  return (
    <>
      {showLoading && <Spinner />}
      {currentStep === BookAppointmentStep.ENTER_INFO_FORM && (
        <BookAppointmentForm
          type={type}
          onSubmit={handleBookAppointment}
          translate={t}
          isLogin={isLogin}
          setShowAlert={setShowAlert}
        />
      )}
      {currentStep === BookAppointmentStep.COMPLETED && (
        <BookAppointmentSuccessful
          appointmentInfo={appointmentSuccessData}
          translate={t}
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
