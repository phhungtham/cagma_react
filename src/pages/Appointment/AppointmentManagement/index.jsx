/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import Tabs from '@common/components/atoms/Tabs';
import Toast from '@common/components/atoms/Toast';
import Header from '@common/components/organisms/Header';
import { initAlert } from '@common/constants/bottomsheet';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, appointmentManageLabels as labels, menuLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useMove from '@hooks/useMove';
import { moveBack } from '@utilities/index';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import AppointmentCard from '../components/AppointmentCard';
import AppointmentDetailBottom from '../components/AppointmentDetailBottom';
import EmptyAppointment from './components/EmptyAppointment';
import { AppointmentManageTab } from './constants';
import './styles.scss';

const AppointmentManagement = ({ translate: t }) => {
  const [tabIndex, setTabIndex] = useState(AppointmentManageTab.UPCOMING);
  const [appointmentResponseData, setAppointmentResponseData] = useState([]);
  const [appointmentByTabList, setAppointmentByTabList] = useState();
  const [statusList, setStatusList] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
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

  const handleTabChange = (tabName, tabIndex) => {
    const { previousList = [], upcomingList = [] } = appointmentResponseData;
    const currentTabAppointments = tabIndex === AppointmentManageTab.UPCOMING ? upcomingList : previousList;
    setAppointmentByTabList(currentTabAppointments);
    setTabIndex(tabIndex);
  };

  const handleCloseAlert = () => {
    if (showAlert.requiredLogin) {
      moveInitHomeNative('initHome');
    }
    setShowAlert(initAlert);
  };

  //Currently, hardcode instead of using status list from API
  // const requestGetCommonCode = async () => {
  //   setShowLoading(true);
  //   const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, {
  //     code: getAppointmentStatus,
  //   });
  //   setShowLoading(false);
  //   if (isSuccess) {
  //     const { [getAppointmentStatus]: status } = data || {};
  //     const convertedStatusList = commonCodeDataToOptions(status);
  //     setStatusList(convertedStatusList);
  //   } else {
  //     setShowAlert({
  //       isShow: true,
  //       content: error,
  //     });
  //   }
  // };

  const requestGetAppointments = async () => {
    setShowLoading(true);
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.getAppointments);
    setShowLoading(false);
    if (isSuccess) {
      const { previousList = [], upcomingList = [] } = data;
      const currentTabAppointments = tabIndex === AppointmentManageTab.UPCOMING ? upcomingList : previousList;
      setAppointmentByTabList(currentTabAppointments);
      setAppointmentResponseData(data);
      // requestGetCommonCode();
    } else {
      setShowAlert({
        isShow: true,
        title: '',
        content: error,
        requiredLogin,
      });
    }
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
      apint_memo: additionalComments,
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
      isUpcoming: tabIndex === AppointmentManageTab.UPCOMING,
      allowCancel: cancel_yn === 1,
      branchNo,
      additionalComments,
    };
    setShowAppointmentDetailBottom({
      isShow: true,
      appointment: appointmentDetail,
    });
  };

  const handleClickBack = () => {
    moveBack();
  };

  useEffect(() => {
    requestGetAppointments();
  }, []);

  return (
    <>
      {showLoading && <Spinner />}
      <div className="appointment-management__wrapper">
        <Header
          title={t(menuLabels.manageAppointment)}
          disabledMoveBack
          onClickBack={handleClickBack}
        />
        <div className="appointment-management__content">
          <Tabs
            tabList={[
              {
                title: t(labels.upcoming),
              },
              {
                title: t(labels.previous),
              },
            ]}
            tabIndex={tabIndex}
            onTabChange={handleTabChange}
          >
            {appointmentByTabList && (
              <>
                {appointmentByTabList.length ? (
                  <div className="appointment__list">
                    {appointmentByTabList.map(appointment => (
                      <Fragment key={appointment.id}>
                        <AppointmentCard
                          appointmentInfo={appointment}
                          onClick={handleViewAppointmentDetail}
                          statusList={statusList}
                          translate={t}
                        />
                      </Fragment>
                    ))}
                  </div>
                ) : (
                  <EmptyAppointment translate={t} />
                )}
              </>
            )}
          </Tabs>
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
        textAlign="left"
        onClose={handleCloseAlert}
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

export default withHTMLParseI18n(AppointmentManagement);
