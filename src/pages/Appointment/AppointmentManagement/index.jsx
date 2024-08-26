import { Fragment, useState } from 'react';

import appointmentEmptyImg from '@assets/images/appointment-empty.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Tabs from '@common/components/molecules/Tabs';
import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';

import AppointmentCard from '../components/AppointmentCard';
import AppointmentDetailBottom from '../components/AppointmentDetailBottom';
import { appointmentDetailTest, appointmentListTest } from '../constants';
import { AppointmentManageTab } from './constants';
import './styles.scss';

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
            {tabIndex === AppointmentManageTab.UPCOMING && (
              <div className="appointment__list">
                {appointmentListTest.map(appointment => (
                  <Fragment key={appointment.id}>
                    <AppointmentCard
                      appointmentInfo={appointment}
                      onClick={onClickViewAppointmentDetail}
                    />
                  </Fragment>
                ))}
              </div>
            )}
            {tabIndex === AppointmentManageTab.PREVIOUS && (
              <div className="appointment-empty__wrapper">
                <div className="appointment-empty__img">
                  <img
                    src={appointmentEmptyImg}
                    alt="empty appointment"
                  />
                </div>
                <div className="appointment-empty__title">Book an Appointment</div>
                <div className="appointment-empty__desc">
                  <p>Book an Appointment</p>
                  <p>In-person or by Zoom</p>
                </div>
                <div className="appointment-empty__btn">
                  <Button
                    label="Book"
                    variant="filled__secondary-blue"
                    size="lg"
                  />
                </div>
              </div>
            )}
          </Tabs>
        </div>
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

export default AppointmentManagement;
