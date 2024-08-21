import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';
import zoomAppointmentImg from '@assets/images/zoom_consultation.png';
import inPersonAppointmentImg from '@assets/images/in_person_consultation.png';
import apparatusZoomImg from '@assets/images/apparatus_zoom_40.png';
import './styles.scss';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { ArrowRight } from '@assets/icons';

const AppointmentHome = () => {
  return (
    <div className='appointment-home__wrapper'>
      <Header
        title="Appointment"
        onClick={moveBack}
      />
      <div className='appointment-home__content'>
        <div className='card__list'>
          <div className='card__item'>
            <div className='card__content'>
              <div className='card__title'>
                <span>Receive a</span>
                <span>financial advice via Zoom</span>
              </div>
              <div className='card__desc'>Zoom Appointment</div>
              <div className='card__btn__wrapper'>
                <Button variant="text__primary" label="Reserve" size="sm" endIcon={<ArrowRight />} />
              </div>
            </div>
            <div className='card__img__wrapper'>
              <img src={zoomAppointmentImg} alt="Zoom Appointment" />
            </div>
          </div>
          <div className='card__item mt-4'>
            <div className='card__content'>
              <div className='card__title'>
                <span>Please visit our branch to </span>
                <span>receive a financial advice</span>
              </div>
              <div className='card__desc'>In-person Appointment</div>
              <div className='card__btn__wrapper'>
                <Button variant="text__primary" label="Reserve" size="sm" endIcon={<ArrowRight />} />
              </div>
            </div>
            <div className='card__img__wrapper'>
              <img src={inPersonAppointmentImg} alt="zoom test" />
            </div>
          </div>
        </div>
        <div className='appointment-details__wrapper'>
          <div className='details__header'>
            <div className='details__header__title'>
              Appointment details
            </div>
            <div className='details__header__icon'>
              <ArrowRight />
            </div>
          </div>
          <div className='details__list'>
            <section className='item-card__wrapper'>
              <div className='item-card__main'>
                <div className='item-card__img'>
                  <img src={apparatusZoomImg} alt="In-person Appointment" />
                </div>
                <div className='item-card__info'>
                  <div className='item-card__id'>#123456</div>
                  <div className='item-card__branch-name'>Mississauge Branch</div>
                  <div className='item-card__time mt-1'>
                    <span className='item-card__date'>2024.06.15</span>
                    <span className='divider__vertical'></span>
                    <span className='item-card__hour'>At 1pm</span>
                  </div>
                </div>
              </div>
              <div className='item-card__status'>

              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentHome;