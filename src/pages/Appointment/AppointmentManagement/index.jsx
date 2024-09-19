import { Fragment, useEffect, useState } from 'react';

import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import Alert from '@common/components/molecules/Alert';
import Tabs from '@common/components/molecules/Tabs';
import Header from '@common/components/organisms/Header';
import { getAppointmentStatus } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import useCommonCode from '@hooks/useCommonCode';
import useGetAppointments from '@hooks/useGetAppointments';
import { apiCall } from '@shared/api';
import { commonCodeDataToOptions } from '@utilities/convert';
import { moveBack } from '@utilities/index';

import AppointmentCard from '../components/AppointmentCard';
import AppointmentDetailBottom from '../components/AppointmentDetailBottom';
import EmptyAppointment from './components/EmptyAppointment';
import { AppointmentManageTab } from './constants';
import './styles.scss';

const AppointmentManagement = () => {
  const {
    data: appointmentData,
    isLoading: isLoadingAppointments,
    sendRequest: sendRequestGetAppointments,
    error: getAppointmentsError,
  } = useGetAppointments();
  const {
    sendRequest: sendRequestGetCommonCode,
    data: commonCodeData,
    isLoading: isLoadingGetCommonCode,
  } = useCommonCode();
  const [tabIndex, setTabIndex] = useState(AppointmentManageTab.UPCOMING);
  const [appointmentResponseData, setAppointmentResponseData] = useState([]);
  const [appointmentByTabList, setAppointmentByTabList] = useState();
  const [statusList, setStatusList] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
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

  const handleTabChange = (tabName, tabIndex) => {
    const { previousList = [], upcomingList = [] } = appointmentResponseData;
    const currentTabAppointments = tabIndex === AppointmentManageTab.UPCOMING ? upcomingList : previousList;
    setAppointmentByTabList(currentTabAppointments);
    setTabIndex(tabIndex);
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
      sendRequestGetAppointments();
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
      isUpcoming: tabIndex === AppointmentManageTab.UPCOMING,
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
    if (appointmentData) {
      const { previousList = [], upcomingList = [] } = appointmentData;
      const currentTabAppointments = tabIndex === AppointmentManageTab.UPCOMING ? upcomingList : previousList;
      setAppointmentByTabList(currentTabAppointments);
      setAppointmentResponseData(appointmentData);
      sendRequestGetCommonCode(getAppointmentStatus);
    }
  }, [appointmentData]);

  useEffect(() => {
    if (commonCodeData?.apint_stat) {
      const convertedStatusList = commonCodeDataToOptions(commonCodeData.apint_stat);
      setStatusList(convertedStatusList);
    }
  }, [commonCodeData]);

  useEffect(() => {
    sendRequestGetAppointments();
  }, []);

  return (
    <>
      {(showLoading || isLoadingAppointments || isLoadingGetCommonCode) && <Spinner />}
      <div className="appointment-management__wrapper">
        <Header
          title="Manage Appointment"
          onClick={moveBack}
        />
        <div className="appointment-management__content">
          <Tabs
            tabList={[
              {
                title: 'Upcoming',
              },
              {
                title: 'Previous',
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
                        />
                      </Fragment>
                    ))}
                  </div>
                ) : (
                  <EmptyAppointment />
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

export default AppointmentManagement;
