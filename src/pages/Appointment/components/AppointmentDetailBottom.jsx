import BottomSheet from '@common/components/templates/BottomSheet';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import apparatusZoomImg from '@assets/images/apparatus_zoom_40.png';
import { appointmentDetailFields } from '../constants';
import './styles.scss';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import { FillDeleteIcon } from '@assets/icons';

const AppointmentDetailBottom = ({appointmentDetail, onClose}) => {
  return (
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
            <IconButton size="lg" type='circle' label='Cancel' icon={<FillDeleteIcon />} />
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default AppointmentDetailBottom;