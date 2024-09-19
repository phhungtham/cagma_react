import { useState } from 'react';

import { FillDeleteIcon } from '@assets/icons';
import zoomImg from '@assets/images/apparatus_zoom_40.png';
import inPersonImg from '@assets/images/icon_fill_atm_40.png';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import Alert from '@common/components/molecules/Alert';
import BottomSheet from '@common/components/templates/BottomSheet';

import { appointmentDetailFields } from '../constants';
import './styles.scss';

const AppointmentDetailBottom = ({ open, appointment, onClose, onConfirmCancel }) => {
  console.log('appointment :>> ', appointment);
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  const { isUsingZoom, date, time, isUpcoming, allowCancel } = appointment;

  const onShowCancelAppointmentAlert = () => {
    setShowCancelAlert(true);
  };

  const onClickConfirmCancel = () => {
    setShowCancelAlert(false);
    onConfirmCancel();
  };

  const onCloseCancelAppointment = () => {
    setShowCancelAlert(false);
  };

  return (
    <>
      <BottomSheet
        open={open}
        onClose={onClose}
        closeIcon
        clazz="appointment-detail-bottom__wrapper"
        type="fit-content"
      >
        <div className="appointment-detail-bottom__content">
          <section className="appointment__header">
            <div className="appointment__img">
              <img
                src={isUsingZoom ? zoomImg : inPersonImg}
                alt="Zoom"
              />
            </div>
            <div className="appointment__summary">
              <div className="appointment__time">
                {date} {time}
              </div>
              <div className="appointment__method">{isUsingZoom ? 'Zoom appointment' : 'In person appointment'}</div>
            </div>
          </section>
          <div className="divider__item__black" />
          <div className="appointment__detail">
            {appointmentDetailFields.map(({ label, value }) => (
              <div
                className="appointment__item"
                key={value}
              >
                <span className="appointment__label">{label}</span>
                <span className="appointment__value">
                  <span>{appointment[value]}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="divider__item__solid" />
          {isUpcoming && allowCancel && (
            <div className="footer__buttons">
              <div className="btn__icon-delete">
                <IconButton
                  size="lg"
                  type="circle"
                  label="Cancel"
                  icon={<FillDeleteIcon />}
                  onClick={onShowCancelAppointmentAlert}
                />
              </div>
            </div>
          )}
        </div>
      </BottomSheet>
      <Alert
        isCloseButton={false}
        isShowAlert={showCancelAlert}
        title="Are you sure?"
        subtitle={
          <>
            <span>Are you sure you want to cancel Reservation?</span>
            <span>This action cannot be undone</span>
          </>
        }
        textAlign="left"
        firstButton={{
          onClick: onClickConfirmCancel,
          label: 'Cancel',
        }}
        secondButton={{
          onClick: onCloseCancelAppointment,
          label: 'I’ll do it next time',
        }}
      />
    </>
  );
};

export default AppointmentDetailBottom;
