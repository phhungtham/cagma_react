import completeImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { MENU_CODE } from '@common/constants/common';
import { ctaLabels, bookAppointmentLabels as labels } from '@common/constants/labels';
import useMove from '@hooks/useMove';
import { routePaths } from '@routes/paths';
import { moveNext } from '@utilities/index';

import { bookAppointmentSuccessFields } from '../../constants';
import './styles.scss';

const BookAppointmentSuccessful = ({ appointmentInfo, translate: t, isLogin }) => {
  const { moveHomeNative } = useMove();

  const onClickNavigateAppointmentManagement = () => {
    moveNext(MENU_CODE.APPOINTMENT_MANAGEMENT, {}, routePaths.appointmentManagement);
  };

  const onClickNavigateHome = () => {
    moveHomeNative();
  };

  return (
    <>
      <div className="book-appointment-successful__wrapper page-gradient">
        <div className="book-appointment__header">
          <div className="book-appointment__img">
            <img
              className="img__icon"
              src={completeImg}
              alt="Complete"
            />
          </div>
          <div className="book-appointment__title">
            <div className="complete-message">{t(labels.requestSuccess)}</div>
            {isLogin ? (
              <>{appointmentInfo?.visitCheck === 'N' && <div className="note">{t(labels.zoomSendEmail)}</div>}</>
            ) : (
              <div className="note">{t(labels.youCanCheckTheConsultation)}</div>
            )}
          </div>
        </div>
        <div className="divider__item__black" />
        <div className="book-appointment__info">
          {bookAppointmentSuccessFields.map(({ label, value }) => (
            <div
              className="appointment-item"
              key={value}
            >
              <span className="appointment-label">{t(label)}</span>
              <span className="appointment-value">{appointmentInfo?.[value]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="footer__fixed book-appointment__footer">
        {isLogin && (
          <Button
            variant="filled__secondary-blue"
            label={t(ctaLabels.viewAppointment)}
            className="btn__cta"
            onClick={onClickNavigateAppointmentManagement}
          />
        )}

        <Button
          variant="filled__primary"
          label={t(ctaLabels.done)}
          className="btn__cta"
          onClick={onClickNavigateHome}
        />
      </div>
    </>
  );
};

export default BookAppointmentSuccessful;
