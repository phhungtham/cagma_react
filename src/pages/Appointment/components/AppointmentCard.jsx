import Label from '@common/components/atoms/Label';
import './styles.scss';
import { labelStatusWithType, labelStatusWithVariant } from '../constants';

const AppointmentCard = ({onClick, appointmentInfo}) => {
  const {image, id, date, time, status, branchName} = appointmentInfo;
  const onClickViewAppointmentDetail = () => {
    onClick();
  };

  return (
    <section className='appointment-card__wrapper' onClick={onClickViewAppointmentDetail}>
      <div className='item-card__main'>
        <div className='item-card__img'>
          <img src={image} alt="In-person Appointment" />
        </div>
        <div className='item-card__info'>
          <div className='item-card__id'>{id}</div>
          <div className='item-card__branch-name'>{branchName}</div>
          <div className='item-card__time mt-1'>
            <span className='item-card__date'>{date}</span>
            <span className='divider__vertical'></span>
            <span className='item-card__hour'>{time}</span>
          </div>
        </div>
      </div>
      <div className='item-card__status'>
        <Label type={labelStatusWithType[status]} label={status} variant={labelStatusWithVariant[status]} />
      </div>
    </section>
  );
};

export default AppointmentCard;