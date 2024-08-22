import BottomSheet from '@common/components/templates/BottomSheet';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import apparatusZoomImg from '@assets/images/apparatus_zoom_40.png';
import { appointmentDetailFields } from '../constants';
import './styles.scss';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import { FillDeleteIcon } from '@assets/icons';
import { useState } from 'react';
import Alert from '@common/components/molecules/Alert';

const AppointmentDetailBottom = ({appointmentDetail, onClose, onConfirm}) => {
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  const onShowCancelAppointmentAlert = () => {
    setShowCancelAlert(true);
  };

  const onClickCancelAppointment = () => {
    onConfirm();
  };

  const onCloseCancelAppointment = () => {
    onClose();
  };

  return (
    <>
      <BottomSheet
        open={true}
        onClose={onClose}
        closeIcon={true}
        clazz="appointment-detail-bottom__wrapper"
        type="fit-content"
      >
        <div className="appointment-detail-bottom__content">
          <section className='appointment__header'>
            <div className='appointment__img'>
              <img src={apparatusZoomImg} alt="Zoom" />
            </div>
            <div className='appointment__summary'>
              <div className='appointment__time'>2024.06.20 1PM</div>
              <div className='appointment__method'>zoom appointment</div>
            </div>
          </section>
          <div className='divider__item__black'></div>
          <div className='appointment__detail'>
            {appointmentDetailFields.map(({label, value}) => 
              <div className='appointment__item' key={value}>
                <span className='appointment__label'>{label}</span>
                <span className='appointment__value'>
                  <span>{appointmentDetail[value]}</span>
                </span>
              </div>)
            }
          </div>
          <div className='divider__item__solid'></div>
          <div className='footer__buttons'>
            <div className='btn__icon-delete'>
              <IconButton size="lg" type='circle' label='Cancel' icon={<FillDeleteIcon />} onClick={onShowCancelAppointmentAlert} />
            </div>
          </div>
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
          onClick: onClickCancelAppointment,
          label: 'Cancel'
        }}
        secondButton={{
          onClick: onCloseCancelAppointment,
          label: 'I’ll do it next time'
        }}
      />
    </>
  );
};

export default AppointmentDetailBottom;