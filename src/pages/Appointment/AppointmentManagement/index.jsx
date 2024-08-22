import Header from '@common/components/organisms/Header';
import './styles.scss';
import { moveBack } from '@utilities/index';
import { Fragment, useState } from 'react';
import { AppointmentManageTab } from './constants';
import Tabs from '@common/components/molecules/Tabs';
import { appointmentDetailTest, appointmentListTest } from '../constants';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentDetailBottom from '../components/AppointmentDetailBottom';

const AppointmentManagement = () => {
  const [tabIndex, setTabIndex] = useState(AppointmentManageTab.UPCOMING);
  const [showAppointmentDetailBottom, setShowAppointmentDetailBottom] = useState(false);

  const handleTabChange = (tabName, tabIndex) => {
    setTabIndex(tabIndex);
  };

  const onClickViewAppointmentDetail = () => {
    setShowAppointmentDetailBottom(true);
  };

  return (
    <>
      <div className='appointment-management__wrapper'>
        <Header
          title="Manage Appointment"
          onClick={moveBack}
        />
        <div className="appointment-management__content">
          <Tabs
            tabList={[
              {
                title: 'Upcoming'
              },
              {
                title: 'Previous'
              },
            ]}
            tabIndex={tabIndex}
            onTabChange={handleTabChange}
          >
            <div className='appointment__list'>
              {appointmentListTest.map(appointment => (
                <Fragment key={appointment.id}>
                  <AppointmentCard appointmentInfo={appointment} onClick={onClickViewAppointmentDetail} />
                </Fragment>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
      {showAppointmentDetailBottom && 
        <AppointmentDetailBottom 
          appointmentDetail={appointmentDetailTest} 
          onClose={() => setShowAppointmentDetailBottom(false)}
          onConfirmCancel={() => {}} 
        />
      }
    </>
  );
};

export default AppointmentManagement;