import { useState } from 'react';
import { useSelector } from 'react-redux';

import { nativeParamsSelector } from 'app/redux/selector';

import BookAppointmentForm from './components/BookAppointmentForm';
import BookAppointmentSuccessful from './components/BookAppointmentSuccessful';
import { appointmentSuccessInfoTest } from './constants';

const BookAppointmentStep = {
  ENTER_INFO_FORM: 'enterInfo',
  COMPLETED: 'completed',
};

const BookAppointment = () => {
  const nativeParams = useSelector(nativeParamsSelector);
  const { type } = nativeParams || {};

  console.log('nativeParams :>> ', nativeParams);
  const [currentStep, setCurrentStep] = useState(BookAppointmentStep.ENTER_INFO_FORM);

  const handleBookAppointment = formValues => {
    //TODO: Handle book appointment
    setCurrentStep(BookAppointmentStep.COMPLETED);
  };

  return (
    <>
      {currentStep === BookAppointmentStep.ENTER_INFO_FORM && (
        <BookAppointmentForm
          type={type}
          onSubmit={handleBookAppointment}
        />
      )}
      {currentStep === BookAppointmentStep.COMPLETED && (
        <BookAppointmentSuccessful appointmentInfo={appointmentSuccessInfoTest} />
      )}
    </>
  );
};

export default BookAppointment;
