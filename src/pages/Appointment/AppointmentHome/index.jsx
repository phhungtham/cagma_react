import { Fragment, useState } from 'react';

import { ArrowRight } from '@assets/icons';
import inPersonAppointmentImg from '@assets/images/in_person_consultation.png';
import zoomAppointmentImg from '@assets/images/zoom_consultation.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Alert from '@common/components/molecules/Alert';
import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';

import AppointmentCard from '../components/AppointmentCard';
import AppointmentDetailBottom from '../components/AppointmentDetailBottom';
import { appointmentDetailTest, appointmentListTest } from '../constants';
import './styles.scss';

const AppointmentHome = () => {
  const [showLocationAccessPermissionAlert, setShowLocationAccessPermissionAlert] = useState(false);
  const [showAppointmentDetailBottom, setShowAppointmentDetailBottom] = useState(false);

  const onClickAppointmentCard = () => {
    //TODO: Check have the permission or not
    setShowLocationAccessPermissionAlert(true);
  };

  const handleAllowAccessLocation = () => {
    alert('allow');
  };

  const onCloseAccessLocationAlert = () => {
    setShowLocationAccessPermissionAlert(false);
  };

  const onClickViewAppointmentDetail = () => {
    setShowAppointmentDetailBottom(true);
  };

  return (
    <>
      <div className="appointment-home__wrapper">
        <Header
          title="Appointment"
          onClick={moveBack}
        />
        <div className="appointment-home__content">
          <div className="card__list">
            <div
              className="card__item"
              onClick={onClickAppointmentCard}
            >
              <div className="card__content">
                <div className="card__title">
                  <span>Receive a</span>
                  <span>financial advice via Zoom</span>
                </div>
                <div className="card__desc">Zoom Appointment</div>
                <div className="card__btn__wrapper">
                  <Button
                    variant="text__primary"
                    label="Reserve"
                    size="sm"
                    endIcon={<ArrowRight />}
                  />
                </div>
              </div>
              <div className="card__img__wrapper">
                <img
                  src={zoomAppointmentImg}
                  alt="Zoom Appointment"
                />
              </div>
            </div>
            <div className="card__item mt-4">
              <div className="card__content">
                <div className="card__title">
                  <span>Please visit our branch to </span>
                  <span>receive a financial advice</span>
                </div>
                <div className="card__desc">In-person Appointment</div>
                <div className="card__btn__wrapper">
                  <Button
                    variant="text__primary"
                    label="Reserve"
                    size="sm"
                    endIcon={<ArrowRight />}
                  />
                </div>
              </div>
              <div className="card__img__wrapper">
                <img
                  src={inPersonAppointmentImg}
                  alt="zoom test"
                />
              </div>
            </div>
          </div>
          <div className="appointment-details__wrapper">
            <div className="details__header">
              <div className="details__header__title">Appointment details</div>
              <div className="details__header__icon">
                <ArrowRight />
              </div>
            </div>
            <div className="details__list">
              {appointmentListTest.map(appointment => (
                <Fragment key={appointment.id}>
                  <AppointmentCard
                    appointmentInfo={appointment}
                    onClick={onClickViewAppointmentDetail}
                  />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        <Alert
          isCloseButton={false}
          isShowAlert={showLocationAccessPermissionAlert}
          title={
            <span>
              Allow <span className="text-primary">“Shinhan SOL”</span> to access your location?
            </span>
          }
          textAlign="center"
          firstButton={{
            onClick: handleAllowAccessLocation,
            label: 'Allow',
          }}
          secondButton={{
            onClick: onCloseAccessLocationAlert,
            label: 'I’ll do it next time',
          }}
        />
      </div>
      {showAppointmentDetailBottom && (
        <AppointmentDetailBottom
          appointmentDetail={appointmentDetailTest}
          onClose={() => setShowAppointmentDetailBottom(false)}
          onConfirmCancel={() => {}}
        />
      )}
    </>
  );
};

export default AppointmentHome;
