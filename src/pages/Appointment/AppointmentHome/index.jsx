import { Fragment, useEffect, useState } from 'react';

import { ArrowRight } from '@assets/icons';
import inPersonAppointmentImg from '@assets/images/in_person_consultation.png';
import zoomAppointmentImg from '@assets/images/zoom_consultation.png';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import Header from '@common/components/organisms/Header';
import { initAlert } from '@common/constants/bottomsheet';
import { MENU_CODE } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, appointmentHomeLabels as labels, menuLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useLoginInfo from '@hooks/useLoginInfo';
import useMove from '@hooks/useMove';
import { routePaths } from '@routes/paths';
import { moveBack, moveNext } from '@utilities/index';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import AppointmentCard from '../components/AppointmentCard';
import AppointmentDetailBottom from '../components/AppointmentDetailBottom';
import { BookAppointmentType } from '../constants';
import './styles.scss';

const maxAppointmentDisplay = 3;

const AppointmentHome = ({ translate: t }) => {
  const { isLogin } = useLoginInfo();
  const [showLoading, setShowLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showAppointmentDetailBottom, setShowAppointmentDetailBottom] = useState({
    isShow: false,
    appointment: {},
  });
  const [showAlert, setShowAlert] = useState(initAlert);
  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });
  const { moveInitHomeNative } = useMove();
  const { requestApi } = useApi();

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

  const handleCloseAlert = () => {
    if (showAlert.requiredLogin) {
      moveInitHomeNative('initHome');
    }
    setShowAlert(initAlert);
  };

  const handleCancelAppointment = async () => {
    setShowLoading(true);
    const { number, branchNo, status } = showAppointmentDetailBottom.appointment || {};
    const requestCancelPayload = {
      apint_seq: number,
      apint_brno: branchNo,
      apint_stat: status,
    };
    const { error, isSuccess, requiredLogin } = await requestApi(endpoints.cancelAppointment, requestCancelPayload);
    setShowLoading(false);
    if (isSuccess) {
      setShowAppointmentDetailBottom({
        isShow: false,
        appointment: {},
      });
      setShowToast({
        isShow: true,
        message: t(labels.cancelSuccess),
        type: 'success',
      });
      requestGetAppointments();
    } else {
      setShowAlert({
        isShow: true,
        title: '',
        content: error,
        requiredLogin,
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

  const requestGetAppointments = async () => {
    setShowLoading(true);
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.getAppointments, {
      inq_cnt: maxAppointmentDisplay,
    });
    setShowLoading(false);
    if (isSuccess) {
      if (data?.upcomingList || data?.previousList) {
        const appointmentList = [...(data?.upcomingList || []), ...(data?.previousList || [])];
        const appointmentsForDisplay = appointmentList.slice(0, maxAppointmentDisplay);
        setAppointments(appointmentsForDisplay);
      } else {
        setAppointments([]);
      }
    } else {
      setShowAlert({
        isShow: true,
        title: '',
        content: error,
        requiredLogin,
      });
    }
  };

  useEffect(() => {
    if (isLogin) {
      requestGetAppointments();
    }
  }, [isLogin]);

  return (
    <>
      <div className="appointment-home__wrapper">
        {showLoading && <Spinner />}
        <Header
          title={t(menuLabels.appointment)}
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
                  <span>{t(labels.receiveAdviceZoom)}</span>
                </div>
                <div className="card__desc">{t(labels.zoomAppointment)}</div>
                <div className="card__btn__wrapper">
                  <Button
                    variant="text__primary"
                    label={t(labels.reserve)}
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
                  <span>{t(labels.visitBranch)}</span>
                </div>
                <div className="card__desc">{t(labels.inPersonAppointment)}</div>
                <div className="card__btn__wrapper">
                  <Button
                    variant="text__primary"
                    label={t(labels.reserve)}
                    size="sm"
                    endIcon={<ArrowRight />}
                  />
                </div>
              </div>
              <div className="card__img__wrapper">
                <img
                  src={inPersonAppointmentImg}
                  alt=""
                />
              </div>
            </div>
          </div>
          {appointments?.length > 0 && (
            <div className="appointment-details__wrapper">
              <div className="details__header">
                <div className="details__header__title">{t(labels.appointmentDetails)}</div>
                <div
                  className="details__header__icon"
                  onClick={handleNavigateAppointmentManagement}
                >
                  <ArrowRight />
                </div>
              </div>
              <div className="details__list">
                {appointments.map(appointment => (
                  <Fragment key={appointment.apint_seq}>
                    <AppointmentCard
                      appointmentInfo={appointment}
                      onClick={handleViewAppointmentDetail}
                      translate={t}
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
        translate={t}
      />
      <Alert
        isCloseButton={false}
        isShowAlert={showAlert.isShow}
        title={showAlert.title}
        subtitle={showAlert.content}
        onClose={handleCloseAlert}
        textAlign="left"
        firstButton={{
          onClick: handleCloseAlert,
          label: t(ctaLabels.confirm),
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

export default withHTMLParseI18n(AppointmentHome);
