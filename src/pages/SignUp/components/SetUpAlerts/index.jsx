import { useState } from 'react';

import alertBannerImg from '@assets/images/alert-bell.png';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Switch from '@common/components/atoms/Switch';

import './styles.scss';

const SetUpAlerts = ({ onSkipSetUp, onConfirmSetUp }) => {
  const [setting, setSetting] = useState({
    customerInfoChange: true,
    offers: false,
    moneyLeaving: true,
    moneyInto: false,
  });
  const [showEnableNotificationAlert, setShowEnableNotificationAlert] = useState(false);

  const handleToggleSetting = (fieldName, isActive) => {
    setSetting({
      ...setting,
      [fieldName]: isActive,
    });
  };

  const handleConfirm = () => {
    setShowEnableNotificationAlert(true);
  };

  const handleCloseAlert = () => {
    setShowEnableNotificationAlert(false);
  };

  const handleNavigateSettingNotification = () => {
    onConfirmSetUp(setting);
  };

  return (
    <div className="set-up-alerts__wrapper">
      <div className="set-up-alerts__content">
        <div className="alert__header">
          <div className="alert__img">
            <img
              src={alertBannerImg}
              alt="Complete"
            />
          </div>
          <div className="alert__title">
            <span>Set Up SOL Alerts</span>
          </div>
          <div className="alert__note">
            <span>Don’t miss important updates regarding your account, special offers and more</span>
          </div>
        </div>
        <InfoBox
          variant="informative"
          label="You can also set up SOL Alerts in Menu > SOL Alerts Management"
        />
        <div className="mt-3">
          <div className="alert__item">
            <div className="item__label">
              <div className="item__label-main">Customer information changes</div>
              <div className="item__label-sub">App Push</div>
            </div>
            <div className="item__value">
              <span className="switch-icon">
                <Switch
                  active={setting.customerInfoChange}
                  onChange={active => handleToggleSetting('customerInfoChange', active)}
                />
              </span>
            </div>
          </div>
          <div className="alert__item">
            <div className="item__label">
              <div className="item__label-main">Offers</div>
              <div className="item__label-sub">App Push</div>
            </div>
            <div className="item__value">
              <span className="switch-icon">
                <Switch
                  active={setting.offers}
                  onChange={active => handleToggleSetting('offers', active)}
                />
              </span>
            </div>
          </div>
          <div className="alert__item">
            <div className="item__label">
              <div className="item__label-main">Money leaving your account</div>
              <div className="item__label-sub">
                <span>All Transactions</span>
                <span className="divider__vertical" />
                <span>App Push</span>
              </div>
            </div>
            <div className="item__value">
              <span className="switch-icon">
                <Switch
                  active={setting.moneyLeaving}
                  onChange={active => handleToggleSetting('moneyLeaving', active)}
                />
              </span>
            </div>
          </div>
          <div className="alert__item border-0">
            <div className="item__label">
              <div className="item__label-main">Money into your account</div>
              <div className="item__label-sub">
                <span>All Transactions</span>
                <span className="divider__vertical" />
                <span>App Push</span>
              </div>
            </div>
            <div className="item__value">
              <span className="switch-icon">
                <Switch
                  active={setting.moneyInto}
                  onChange={active => handleToggleSetting('moneyInto', active)}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          variant="filled__secondary-blue"
          label="Skip"
          className="btn__cta"
          onClick={onSkipSetUp}
        />
        <Button
          variant="filled__primary"
          label="Set Up"
          className="btn__cta"
          onClick={handleConfirm}
        />
      </div>
      {showEnableNotificationAlert && (
        <Alert
          isCloseButton={false}
          isShowAlert={showEnableNotificationAlert}
          title="Please set up Notifications in Settings app"
          subtitle="App is not allowed to send you Notifications. Please set up Notifications in Setting app."
          textAlign="center"
          onClose={handleCloseAlert}
          firstButton={{
            onClick: handleNavigateSettingNotification,
            label: 'Go to Settings',
          }}
          secondButton={{
            onClick: handleCloseAlert,
            label: 'Cancel',
          }}
        >
          <div className="notification-set-up-alert flex-center">
            <div className="alert__img">
              <img
                src={alertBannerImg}
                alt="Complete"
              />
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default SetUpAlerts;
