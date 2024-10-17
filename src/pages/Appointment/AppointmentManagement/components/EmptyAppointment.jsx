import appointmentEmptyImg from '@assets/images/appointment-empty.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { MENU_CODE } from '@common/constants/common';
import { appointmentManageLabels as labels } from '@common/constants/labels';
import { routePaths } from '@routes/paths';
import { moveNext } from '@utilities/index';

const EmptyAppointment = ({ translate: t }) => {
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
      <div className="appointment-empty__title">{t(labels.bookAppointment)}</div>
      <div className="appointment-empty__desc">
        <span>{t(labels.bookAppointmentMethod)}</span>
      </div>
      <div className="appointment-empty__btn">
        <Button
          label={t(labels.book)}
          variant="filled__secondary-blue"
          size="lg"
          onClick={handleNavigateAppointmentHome}
        />
      </div>
    </div>
  );
};

export default EmptyAppointment;
