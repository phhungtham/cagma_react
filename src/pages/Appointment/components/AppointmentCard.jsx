import zoomImg from '@assets/images/apparatus_zoom_40.png';
import inPersonImg from '@assets/images/icon_fill_atm_40.png';
import Label from '@common/components/atoms/Label';

import { labelStatusWithType, labelStatusWithVariant } from '../constants';
import './styles.scss';

const AppointmentCard = ({ onClick, appointmentInfo, statusList }) => {
  const {
    apint_visit_chk,
    apint_seq: id,
    apint_reg_dt_display: date,
    apint_reg_tm_display: time,
    apint_stat_display: status,
    lcl_br_nm: branchName,
  } = appointmentInfo;
  const isUsingZoom = apint_visit_chk === 'N';
  // const statusDisplay = statusList?.find(item => item.value === status)?.label;

  const onClickViewAppointmentDetail = () => {
    onClick(appointmentInfo);
  };

  return (
    <section
      className="appointment-card__wrapper"
      onClick={onClickViewAppointmentDetail}
    >
      <div className="item-card__main">
        <div className="item-card__img">
          <img
            src={isUsingZoom ? zoomImg : inPersonImg}
            alt="In-person Appointment"
          />
        </div>
        <div className="item-card__info">
          <div className="item-card__id">{id}</div>
          {!isUsingZoom && <div className="item-card__branch-name">{branchName}</div>}
          <div className="item-card__time mt-1">
            <span className="item-card__date">{date}</span>
            <span className="divider__vertical" />
            <span className="item-card__hour">{time}</span>
          </div>
        </div>
      </div>
      <div className="item-card__status">
        <Label
          type={labelStatusWithType[status]}
          label={status}
          variant={labelStatusWithVariant[status]}
        />
      </div>
    </section>
  );
};

export default AppointmentCard;
