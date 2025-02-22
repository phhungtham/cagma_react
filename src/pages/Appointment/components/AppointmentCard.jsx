import { useSelector } from 'react-redux';

import zoomImg from '@assets/images/apparatus_zoom_40.png';
import inPersonImg from '@assets/images/icon_fill_atm_40.png';
import Label from '@common/components/atoms/Label';
import { languageMapWithBranchNameField } from '@common/constants/branch';
import { appLanguage } from 'app/redux/selector';

import { AppointmentStatusKeyWithLabel, labelStatusWithType, labelStatusWithVariant } from '../constants';
import './styles.scss';

const AppointmentCard = ({ onClick, appointmentInfo, statusList, translate: t }) => {
  const currentLanguage = useSelector(appLanguage);
  const langStr = currentLanguage?.language;

  const {
    apint_visit_chk,
    apint_seq: id,
    apint_reg_dt_display: date,
    apint_reg_tm_display: time,
    apint_stat: status,
  } = appointmentInfo || {};
  const isUsingZoom = apint_visit_chk === 'N';
  //Currently, hardcode instead of using status list from API
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
          <div className="item-card__id">#{id}</div>
          <div className="item-card__branch-name">
            {appointmentInfo[languageMapWithBranchNameField[langStr]] || appointmentInfo.lcl_br_nm}
          </div>
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
          label={t(AppointmentStatusKeyWithLabel[status])}
          variant={labelStatusWithVariant[status]}
        />
      </div>
    </section>
  );
};

export default AppointmentCard;
