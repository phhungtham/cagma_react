import { useState } from 'react';

import BookAppointmentForm from './components/BookAppointmentForm';
import BookAppointmentSuccessful from './components/BookAppointmentSuccessful';
import { appointmentSuccessInfoTest } from './constants';

const BookAppointmentStep = {
  ENTER_INFO_FORM: 'enterInfo',
  COMPLETED: 'completed',
};

const BookAppointment = ({ type }) => {
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
