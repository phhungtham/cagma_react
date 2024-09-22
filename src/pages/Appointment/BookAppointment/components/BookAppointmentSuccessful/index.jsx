import completeImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { MENU_CODE } from '@common/constants/common';
import { routePaths } from '@routes/paths';
import { moveHome, moveNext } from '@utilities/index';

import { bookAppointmentSuccessFields } from '../../constants';
import './styles.scss';

const BookAppointmentSuccessful = ({ appointmentInfo }) => {
  const onClickNavigateAppointmentManagement = () => {
    moveNext(MENU_CODE.APPOINTMENT_MANAGEMENT, {}, routePaths.appointmentManagement);
  };

  const onClickNavigateHome = () => {
    moveHome();
  };

  return (
    <>
      <div className="book-appointment-successful__wrapper">
        <div className="book-appointment__header">
          <div className="book-appointment__img">
            <img
              src={completeImg}
              alt="Complete"
            />
          </div>
          <div className="book-appointment__title">
            <div className="complete-message">Your appointment is requested successfully</div>
            {appointmentInfo?.visitCheck === 'N' && <div className="note">Zoom link will be sent via email</div>}
          </div>
        </div>
        <div className="divider__item__black" />
        <div className="book-appointment__info">
          {bookAppointmentSuccessFields.map(({ label, value }) => (
            <div
              className="appointment-item"
              key={value}
            >
              <span className="appointment-label">{label}</span>
              <span className="appointment-value">
                <span>{appointmentInfo?.[value]}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="footer__fixed book-appointment__footer">
        <Button
          variant="filled__secondary-blue"
          label="View Appointment"
          className="btn__cta"
          onClick={onClickNavigateAppointmentManagement}
        />
        <Button
          variant="filled__primary"
          label="Done"
          className="btn__cta"
          onClick={onClickNavigateHome}
        />
      </div>
    </>
  );
};

export default BookAppointmentSuccessful;
