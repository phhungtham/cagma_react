import { useEffect, useState } from 'react';

import { ArrowRight } from '@assets/icons';
import Spinner from '@common/components/atoms/Spinner';
import Switch from '@common/components/atoms/Switch';
import Toast from '@common/components/atoms/Toast';
import Alert from '@common/components/molecules/Alert';
import Header from '@common/components/organisms/Header';
import { MENU_CODE } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { routePaths } from '@routes/paths';
import { moveBack, moveNext } from '@utilities/index';

import CustomerInfoChangeBottom from './components/CustomerInfoChangeBottom';
import { EAlertType } from './constants';
import './styles.scss';

const EAlertsManagement = () => {
  const { requestApi } = useApi();
  const [showCustomerInfoChangeBottom, setShowCustomerInfoChangeBottom] = useState(false);
  const [showLoading, setShowLoading] = useState();
  const [setting, setSetting] = useState({
    offerEnabled: false,
    customerEmailEnabled: false,
    customerAppPushEnabled: false,
    balanceEnabled: false,
    accountCount: 0,
  });
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });

  const isCustomerInfoEnabled = setting.customerEmailEnabled || setting.customerAppPushEnabled;

  const onClickShowCustomerInfoBottom = () => {
    setShowCustomerInfoChangeBottom(true);
  };

  const handleCloseAlert = () => {
    setAlert({
      isShow: false,
      title: '',
      content: '',
    });
  };

  const handleNavigateBalanceSetting = () => {
    if (!setting.accountCount) {
      return setAlert({
        isShow: true,
        title: 'There’s no account',
        content: 'Balance can only be set when there is an account.',
      });
    }
    moveNext(MENU_CODE.E_ALERT_BALANCE, {}, routePaths.eAlertsBalance);
  };

  const requestGetEAlertSetting = async () => {
    setShowLoading(true);
    const { isSuccess, error, data } = await requestApi(endpoints.getEAlertSetting, {});
    setShowLoading(false);
    if (isSuccess) {
      const {
        offers_push_yn: offerEnabled,
        cus_info_email_yn: customerEmailEnabled,
        cus_info_push_yn: customerAppPushEnabled,
        bal_yn: balanceEnabled,
        grid_cnt_01: accountCount,
      } = data || {};
      setSetting({
        offerEnabled: Number(offerEnabled) === 1,
        customerEmailEnabled: Number(customerEmailEnabled) === 1,
        customerAppPushEnabled: Number(customerAppPushEnabled) === 1,
        balanceEnabled: Number(balanceEnabled) === 1,
        accountCount: accountCount,
      });
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestUpdateSetting = async payload => {
    setShowLoading(true);
    const { isSuccess, error, data } = await requestApi(endpoints.updateEAlertSetting, payload);
    setShowLoading(false);
    if (!isSuccess) {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
    return data;
  };

  const handleApplyCustomerInfoChange = async values => {
    setShowCustomerInfoChangeBottom(false);
    const { customerEmailEnabled, customerAppPushEnabled } = values;
    const { result_cd } = await requestUpdateSetting({
      select_d: EAlertType.CUSTOMER_INFO,
      push_yn: customerAppPushEnabled ? '01' : '00',
      email_yn: customerEmailEnabled ? '01' : '00',
    });

    if (Number(result_cd) === 1) {
      let message = '';
      if (customerEmailEnabled || customerAppPushEnabled) {
        message = 'Alerts notifications enabled';
      } else {
        message = 'Alerts notifications disabled';
      }
      setSetting({
        ...setting,
        customerEmailEnabled,
        customerAppPushEnabled,
      });
      setShowToast({
        isShow: true,
        message: message,
        type: 'success',
      });
    }
  };

  const handleChangeOffers = async active => {
    const { result_cd } = await requestUpdateSetting({
      select_d: EAlertType.OFFER,
      push_yn: active ? '01' : '00',
    });

    if (Number(result_cd) === 1) {
      let message = '';
      if (active) {
        message = 'Offers notifications enabled';
      } else {
        message = 'Offers notifications disabled';
      }
      setSetting({
        ...setting,
        offerEnabled: active,
      });
      setShowToast({
        isShow: true,
        message: message,
        type: 'success',
      });
    }
  };

  useEffect(() => {
    requestGetEAlertSetting();
  }, []);

  return (
    <>
      {showLoading && <Spinner />}

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
              <span className={isCustomerInfoEnabled ? 'on' : ''}>{isCustomerInfoEnabled ? 'ON' : 'OFF'}</span>
              <span className="arrow-icon">
                <ArrowRight />
              </span>
            </div>
          </div>
          <div className="alert__item">
            <div className="item__title">Offers</div>
            <div className="item__value">
              <span className="switch-icon">
                <Switch
                  active={!!setting.offerEnabled}
                  onChange={handleChangeOffers}
                />
              </span>
            </div>
          </div>
          <div
            className="alert__item"
            onClick={handleNavigateBalanceSetting}
          >
            <div className="item__title">Balance</div>
            <div className="item__value">
              <span className={setting.balanceEnabled ? 'on' : ''}>{setting.balanceEnabled ? 'ON' : 'OFF'}</span>
              <span className="arrow-icon">
                <ArrowRight />
              </span>
            </div>
          </div>
        </div>
        {showCustomerInfoChangeBottom && (
          <CustomerInfoChangeBottom
            setting={setting}
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
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        textAlign="left"
        onClose={handleCloseAlert}
        firstButton={{
          onClick: handleCloseAlert,
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default EAlertsManagement;
