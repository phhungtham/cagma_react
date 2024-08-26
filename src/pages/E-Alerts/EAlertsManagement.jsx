import { useState } from 'react';

import { ArrowRight } from '@assets/icons';
import Switch from '@common/components/atoms/Switch';
import Toast from '@common/components/atoms/Toast';
import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';

import CustomerInfoChangeBottom from './components/CustomerInfoChangeBottom';
import './styles.scss';

const EAlertsManagement = () => {
  const [showCustomerInfoChangeBottom, setShowCustomerInfoChangeBottom] = useState(false);

  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });

  const onClickShowCustomerInfoBottom = () => {
    setShowCustomerInfoChangeBottom(true);
  };

  const handleApplyCustomerInfoChange = checkOptions => {
    setShowCustomerInfoChangeBottom(false);
    setShowToast({
      isShow: true,
      message: 'Alerts  notifications enabled',
      type: 'success',
    });
  };

  return (
    <div className="eAlerts-management__wrapper">
      <Header
        title="e-Alerts Management"
        onClick={moveBack}
      />
      <div className="eAlerts-management__content">
        <div
          className="alert__item"
          onClick={onClickShowCustomerInfoBottom}
        >
          <div className="item__title">Customer Information</div>
          <div className="item__value">
            <span className="on">ON</span>
            <span className="arrow-icon">
              <ArrowRight />
            </span>
          </div>
        </div>
        <div className="alert__item">
          <div className="item__title">Offers</div>
          <div className="item__value">
            <span className="switch-icon">
              <Switch />
            </span>
          </div>
        </div>
        <div className="alert__item">
          <div className="item__title">Balance</div>
          <div className="item__value">
            <span className="">OFF</span>
            <span className="arrow-icon">
              <ArrowRight />
            </span>
          </div>
        </div>
      </div>
      {showCustomerInfoChangeBottom && (
        <CustomerInfoChangeBottom
          onClose={() => setShowCustomerInfoChangeBottom(false)}
          onSubmit={handleApplyCustomerInfoChange}
        />
      )}
      <section className="toast__overlay">
        <Toast
          isShowToast={showToast.isShow}
          type={showToast.type}
          onClose={() => setShowToast({ ...showToast, isShow: false })}
          message={showToast.message}
        />
      </section>
    </div>
  );
};

export default EAlertsManagement;
