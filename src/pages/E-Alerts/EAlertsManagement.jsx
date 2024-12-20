import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ArrowRight } from '@assets/icons';
import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import Switch from '@common/components/atoms/Switch';
import Toast from '@common/components/atoms/Toast';
import Header from '@common/components/organisms/Header';
import { initAlert } from '@common/constants/bottomsheet';
import { MENU_CODE } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, eAlertLabels as labels, menuLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useMove from '@hooks/useMove';
import { routePaths } from '@routes/paths';
import { isIphone } from '@utilities/deviceDetected';
import getPushToken from '@utilities/gmCommon/getPushToken';
import { moveBack, moveNext } from '@utilities/index';
import { appLanguage } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import CustomerInfoChangeBottom from './components/CustomerInfoChangeBottom';
import { EAlertType } from './constants';
import './styles.scss';

const EAlertsManagement = ({ translate: t }) => {
  const { requestApi } = useApi();
  const currentLanguage = useSelector(appLanguage);
  const [showCustomerInfoChangeBottom, setShowCustomerInfoChangeBottom] = useState(false);
  const [showLoading, setShowLoading] = useState();
  const [tokenPlugin, setTokenPlugin] = useState('');
  const [setting, setSetting] = useState({
    offerEnabled: false,
    customerEmailEnabled: false,
    customerAppPushEnabled: false,
    balanceEnabled: false,
    accountCount: 0,
  });
  const [alert, setAlert] = useState(initAlert);
  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });
  const { moveInitHomeNative } = useMove();

  const isCustomerInfoEnabled = setting.customerEmailEnabled || setting.customerAppPushEnabled;

  const onClickShowCustomerInfoBottom = () => {
    setShowCustomerInfoChangeBottom(true);
  };

  const handleCloseAlert = () => {
    if (alert.requiredLogin) {
      moveInitHomeNative('initHome');
    }
    setAlert(initAlert);
  };

  const handleNavigateBalanceSetting = () => {
    if (!setting.accountCount) {
      return setAlert({
        isShow: true,
        title: t(labels.noAccount),
        content: t(labels.noAccountDesc),
      });
    }
    moveNext(MENU_CODE.E_ALERT_BALANCE, {}, routePaths.eAlertsBalance);
  };

  const requestGetEAlertSetting = async () => {
    setShowLoading(true);
    const { isSuccess, error, data, requiredLogin } = await requestApi(endpoints.getEAlertSetting, {});
    setShowLoading(false);
    if (isSuccess) {
      getPushToken(getTokenCallback);
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
        requiredLogin,
      });
    }
  };

  const requestUpdateSetting = async value => {
    setShowLoading(true);
    const isIphoneDevice = isIphone();
    const payload = {
      ...value,
      push_lang_c: (currentLanguage?.language || 'en').toUpperCase(),
      push_tmn_no: tokenPlugin,
      tmn_d: isIphoneDevice ? 'I' : 'A',
    };
    const { isSuccess, error, data, requiredLogin } = await requestApi(endpoints.updateEAlertSetting, payload);
    setShowLoading(false);
    if (!isSuccess) {
      return setAlert({
        isShow: true,
        content: error,
        requiredLogin,
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
        message = t(labels.alertNotiEnabled);
      } else {
        message = t(labels.alertNotiDisabled);
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
        message = t(labels.offerNotiEnabled);
      } else {
        message = t(labels.offerNotiDisabled);
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

  const getTokenCallback = token => {
    setTokenPlugin(token);
  };

  useEffect(() => {
    requestGetEAlertSetting();
  }, []);

  return (
    <>
      {showLoading && <Spinner />}

      <div className="eAlerts-management__wrapper">
        <Header
          title={t(menuLabels.eAlertManage)}
          onClick={moveBack}
        />
        <div className="eAlerts-management__content">
          <div
            className="alert__item"
            onClick={onClickShowCustomerInfoBottom}
          >
            <div className="item__title">{t(labels.customerInformation)}</div>
            <div className="item__value">
              <span className={isCustomerInfoEnabled ? 'on' : ''}>
                {isCustomerInfoEnabled ? t(labels.on) : t(labels.off)}
              </span>
              <span className="arrow-icon">
                <ArrowRight />
              </span>
            </div>
          </div>
          <div className="alert__item">
            <div className="item__title">{t(labels.offers)}</div>
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
            <div className="item__title">{t(labels.balance)}</div>
            <div className="item__value">
              <span className={setting.balanceEnabled ? 'on' : ''}>
                {setting.balanceEnabled ? t(labels.on) : t(labels.off)}
              </span>
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
            translate={t}
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
          label: t(ctaLabels.confirm),
        }}
      />
    </>
  );
};

export default withHTMLParseI18n(EAlertsManagement);
