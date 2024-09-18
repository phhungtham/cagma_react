import appointmentEmptyImg from '@assets/images/appointment-empty.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { MENU_CODE } from '@configs/global/constants';
import { routePaths } from '@routes/paths';
import { moveNext } from '@utilities/index';

const EmptyAppointment = () => {
  const handleNavigateAppointmentHome = () => {
    moveNext(MENU_CODE.APPOINTMENT_MAIN, {}, routePaths.appointment);
  };

  return (
    <div className="appointment-empty__wrapper">
      <div className="appointment-empty__img">
        <img
          src={appointmentEmptyImg}
          alt="empty appointment"
        />
      </div>
      <div className="appointment-empty__title">Book an Appointment</div>
      <div className="appointment-empty__desc">
        <p>Book an Appointment</p>
        <p>In-person or by Zoom</p>
      </div>
      <div className="appointment-empty__btn">
        <Button
          label="Book"
          variant="filled__secondary-blue"
          size="lg"
          onClick={handleNavigateAppointmentHome}
        />
      </div>
    </div>
  );
};

export default EmptyAppointment;
