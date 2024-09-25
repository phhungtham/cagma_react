import { useState } from 'react';
import { useSelector } from 'react-redux';

import Spinner from '@common/components/atoms/Spinner';
import Alert from '@common/components/molecules/Alert';
import { endpoints } from '@common/constants/endpoint';
import { apiCall } from '@shared/api';
import { convertObjectBaseMappingFields } from '@utilities/convert';
import { nativeParamsSelector } from 'app/redux/selector';

import { BookAppointmentType } from '../constants';
import BookAppointmentForm from './components/BookAppointmentForm';
import BookAppointmentSuccessful from './components/BookAppointmentSuccessful';
import { bookAppointmentFormMapFields, CustomerStatusType } from './constants';

const BookAppointmentStep = {
  ENTER_INFO_FORM: 'enterInfo',
  COMPLETED: 'completed',
};

const BookAppointment = () => {
  const nativeParams = useSelector(nativeParamsSelector);
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
    const request = convertObjectBaseMappingFields(
      formValues,
      bookAppointmentFormMapFields,
      true /* ignoreRemainingFields*/
    );
    request.apint_guest_chk = formValues.customerStatusType === CustomerStatusType.EXISTING ? 'Y' : 'N';
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
      } = bookAppointmentResponse.data.elData || {};
      const bookAppointmentSuccessData = {
        visitCheck,
        method: visitCheck === 'Y' ? 'In person' : 'Zoom',
        branchName,
        address,
        date,
        time,
        confirmNumber: `#${confirmNumber}`,
      };
      setAppointmentSuccessData(bookAppointmentSuccessData);
      setCurrentStep(BookAppointmentStep.COMPLETED);
      return;
    }
    const responseErrorMessage = bookAppointmentResponse?.data?.elHeader?.resMsgVo?.msgText;
    if (responseErrorMessage) {
      setShowAlert({
        isShow: true,
        title: 'Sorry!',
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
        />
      )}
      {currentStep === BookAppointmentStep.COMPLETED && (
        <BookAppointmentSuccessful appointmentInfo={appointmentSuccessData} />
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
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default BookAppointment;
