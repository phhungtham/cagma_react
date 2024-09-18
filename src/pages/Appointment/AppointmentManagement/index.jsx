import { Fragment, useEffect, useState } from 'react';

import Spinner from '@common/components/atoms/Spinner';
import Alert from '@common/components/molecules/Alert';
import Tabs from '@common/components/molecules/Tabs';
import Header from '@common/components/organisms/Header';
import { getAppointmentStatus } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import useCommonCode from '@hooks/useCommonCode';
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
    sendRequest: sendRequestGetCommonCode,
    data: commonCodeData,
    isLoading: isLoadingGetCommonCode,
  } = useCommonCode();
  const [tabIndex, setTabIndex] = useState(AppointmentManageTab.UPCOMING);
  const [appointmentResponseData, setAppointmentResponseData] = useState([]);
  const [appointmentByTabList, setAppointmentByTabList] = useState([]);
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

  const handleTabChange = (tabName, tabIndex) => {
    const { previousList = [], upcomingList = [] } = appointmentResponseData;
    const currentTabAppointments = tabIndex === AppointmentManageTab.UPCOMING ? upcomingList : previousList;
    setAppointmentByTabList(currentTabAppointments);
    setTabIndex(tabIndex);
  };

  const handleViewAppointmentDetail = appointment => {
    //TODO: Change Appointment field to mapping with appointment detail
    setShowAppointmentDetailBottom({
      isShow: true,
      appointment,
    });
  };

  const requestGetAppointments = async () => {
    setShowLoading(true);
    const getAppointmentsResponse = await apiCall(endpoints.getAppointments, 'POST', {});
    setShowLoading(false);
    if (getAppointmentsResponse?.data?.elData) {
      const { previousList = [], upcomingList = [] } = getAppointmentsResponse.data.elData;
      const currentTabAppointments = tabIndex === AppointmentManageTab.UPCOMING ? upcomingList : previousList;
      setAppointmentByTabList(currentTabAppointments);
      setAppointmentResponseData(getAppointmentsResponse.data.elData);
      sendRequestGetCommonCode(getAppointmentStatus);
    } else {
      const errorMessage = getAppointmentsResponse?.data?.elHeader?.resMsgVo?.msgText || '';
      setShowAlert({
        isShow: true,
        title: 'Sorry!',
        content: errorMessage,
      });
    }
  };

  useEffect(() => {
    if (commonCodeData?.apint_stat) {
      const convertedStatusList = commonCodeDataToOptions(commonCodeData.apint_stat);
      setStatusList(convertedStatusList);
    }
  }, [commonCodeData]);

  useEffect(() => {
    requestGetAppointments();
  }, []);

  return (
    <>
      {(showLoading || isLoadingGetCommonCode) && <Spinner />}
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
            {appointmentByTabList?.length ? (
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
          </Tabs>
        </div>
      </div>
      <AppointmentDetailBottom
        open={showAppointmentDetailBottom.isShow}
        appointment={showAppointmentDetailBottom.appointment}
        onClose={() => setShowAppointmentDetailBottom({ ...showAppointmentDetailBottom, isShow: false })}
        onConfirmCancel={() => {}}
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
    </>
  );
};

export default AppointmentManagement;
