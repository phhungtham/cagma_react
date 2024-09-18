import { Fragment, useEffect, useState } from 'react';

import { ArrowRight } from '@assets/icons';
import inPersonAppointmentImg from '@assets/images/in_person_consultation.png';
import zoomAppointmentImg from '@assets/images/zoom_consultation.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Alert from '@common/components/molecules/Alert';
import Header from '@common/components/organisms/Header';
import { endpoints } from '@common/constants/endpoint';
import { MENU_CODE } from '@configs/global/constants';
import { routePaths } from '@routes/paths';
import { apiCall } from '@shared/api';
import { moveBack, moveNext } from '@utilities/index';

import AppointmentCard from '../components/AppointmentCard';
import AppointmentDetailBottom from '../components/AppointmentDetailBottom';
import { appointmentDetailTest, appointmentListTest, BookAppointmentType } from '../constants';
import './styles.scss';

const AppointmentHome = () => {
  const [showAppointmentDetailBottom, setShowAppointmentDetailBottom] = useState(false);
  const [showAlert, setShowAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });

  const handleNavigateBranchDirectory = type => {
    moveNext(
      MENU_CODE.BRANCH_DIRECTORY,
      {
        param: JSON.stringify({ type }),
      },
      routePaths.branchDirectory
    );
  };

  const handleNavigateAppointmentManagement = e => {
    e.stopPropagation();
    moveNext(MENU_CODE.APPOINTMENT_MANAGEMENT, {}, routePaths.appointmentManagement);
  };

  const onClickViewAppointmentDetail = () => {
    setShowAppointmentDetailBottom(true);
  };

  const requestGetAppointments = async () => {
    const getAppointmentsResponse = await apiCall(endpoints.getAppointments, 'POST', {});
    if (getAppointmentsResponse?.data?.elHeader?.resSuc) {
    } else {
      const errorMessage = getAppointmentsResponse?.data?.elHeader?.resMsg || '';
      setShowAlert({
        isShow: true,
        title: 'Sorry!',
        content: errorMessage,
      });
    }
  };

  useEffect(() => {
    requestGetAppointments();
  }, []);

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
              onClick={() => handleNavigateBranchDirectory(BookAppointmentType.ZOOM)}
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
            <div
              className="card__item mt-4"
              onClick={() => handleNavigateBranchDirectory(BookAppointmentType.IN_PERSON)}
            >
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
              <div
                className="details__header__icon"
                onClick={handleNavigateAppointmentManagement}
              >
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
      </div>
      {showAppointmentDetailBottom && (
        <AppointmentDetailBottom
          appointmentDetail={appointmentDetailTest}
          onClose={() => setShowAppointmentDetailBottom(false)}
          onConfirmCancel={() => {}}
        />
      )}
      <Alert
        isCloseButton={false}
        isShowAlert={showAlert.isShow}
        title={showAlert.title}
        subtitle={showAlert.content}
        textAlign="left"
        firstButton={{
          onClick: () => setShowAlert({ isShow: false, title: '', content: '' }),
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default AppointmentHome;
