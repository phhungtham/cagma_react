import { Fragment, useEffect, useState } from 'react';

import { ArrowRight } from '@assets/icons';
import inPersonAppointmentImg from '@assets/images/in_person_consultation.png';
import zoomAppointmentImg from '@assets/images/zoom_consultation.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import Alert from '@common/components/molecules/Alert';
import Header from '@common/components/organisms/Header';
import { MENU_CODE } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import useGetAppointments from '@hooks/useGetAppointments';
import { routePaths } from '@routes/paths';
import { apiCall } from '@shared/api';
import { moveBack, moveNext } from '@utilities/index';

import AppointmentCard from '../components/AppointmentCard';
import AppointmentDetailBottom from '../components/AppointmentDetailBottom';
import { BookAppointmentType } from '../constants';
import './styles.scss';

const maxAppointmentDisplay = 3;

const AppointmentHome = () => {
  const {
    data: appointmentData,
    isLoading: isLoadingAppointments,
    sendRequest: sendRequestGetAppointments,
    error: getAppointmentsError,
  } = useGetAppointments();
  const [showLoading, setShowLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showAppointmentDetailBottom, setShowAppointmentDetailBottom] = useState({
    isShow: false,
    appointment: {},
  });
  const [showAlert, setShowAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
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

  const handleCancelAppointment = async () => {
    setShowLoading(true);
    const { number, branchNo, status } = showAppointmentDetailBottom.appointment || {};
    const requestCancelPayload = {
      apint_seq: number,
      apint_brno: branchNo,
      apint_stat: status,
    };
    const cancelAppointmentResponse = await apiCall(endpoints.cancelAppointment, 'POST', requestCancelPayload);
    setShowLoading(false);
    if (cancelAppointmentResponse?.data?.elData) {
      setShowAppointmentDetailBottom({
        isShow: false,
        appointment: {},
      });
      setShowToast({
        isShow: true,
        message: 'Successfully canceled',
        type: 'success',
      });
      sendRequestGetAppointments({ inq_cnt: maxAppointmentDisplay });
    } else {
      const errorMessage = cancelAppointmentResponse?.data?.elHeader?.resMsgVo?.msgText || '';
      setShowAlert({
        isShow: true,
        title: 'Sorry!',
        content: errorMessage,
      });
    }
  };

  const handleViewAppointmentDetail = appointment => {
    const {
      apint_visit_chk,
      apint_seq: number,
      apint_reg_dt_display: date,
      apint_reg_tm_display: time,
      apint_stat: status,
      apint_brno: branchNo,
      lcl_br_nm: branchName,
      br_adr: branchAddress,
      cancel_yn,
    } = appointment;
    const appointmentDetail = {
      method: apint_visit_chk === 'N' ? 'Zoom' : 'In person',
      number,
      isUsingZoom: apint_visit_chk === 'N',
      date,
      time,
      status,
      branchName,
      branchAddress,
      isUpcoming: true,
      allowCancel: cancel_yn === 1,
      branchNo,
    };
    setShowAppointmentDetailBottom({
      isShow: true,
      appointment: appointmentDetail,
    });
  };

  useEffect(() => {
    if (getAppointmentsError) {
      setShowAlert({
        isShow: true,
        title: 'Sorry!',
        content: getAppointmentsError,
      });
    }
  }, [getAppointmentsError]);

  useEffect(() => {
    if (appointmentData?.upcomingList || appointmentData?.previousList) {
      const appointmentList = [...(appointmentData?.upcomingList || []), ...(appointmentData?.previousList || [])];
      const appointmentsForDisplay = appointmentList.slice(0, maxAppointmentDisplay);
      setAppointments(appointmentsForDisplay);
    } else {
      setAppointments([]);
    }
  }, [appointmentData]);

  useEffect(() => {
    sendRequestGetAppointments({ inq_cnt: maxAppointmentDisplay });
  }, []);

  return (
    <>
      <div className="appointment-home__wrapper">
        {(isLoadingAppointments || showLoading) && <Spinner />}
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
          {appointments?.length > 0 && (
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
                {appointments.map(appointment => (
                  <Fragment key={appointment.id}>
                    <AppointmentCard
                      appointmentInfo={appointment}
                      onClick={handleViewAppointmentDetail}
                    />
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <AppointmentDetailBottom
        open={showAppointmentDetailBottom.isShow}
        appointment={showAppointmentDetailBottom.appointment}
        onClose={() => setShowAppointmentDetailBottom({ appointment: {}, isShow: false })}
        onConfirmCancel={handleCancelAppointment}
      />
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
      <section className="toast__overlay">
        <Toast
          isShowToast={showToast.isShow}
          type={showToast.type}
          onClose={() => setShowToast({ ...showToast, isShow: false })}
          message={showToast.message}
        />
      </section>
    </>
  );
};

export default AppointmentHome;
