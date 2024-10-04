import { useEffect, useState } from 'react';

import { ArrowRight } from '@assets/icons';
import Dropdown from '@common/components/atoms/Dropdown';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import Alert from '@common/components/molecules/Alert';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import Header from '@common/components/organisms/Header';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { formatCurrencyDisplay } from '@utilities/currency';
import { moveBack } from '@utilities/index';

import CustomerInfoChangeBottom from './components/CustomerInfoChangeBottom';
import LowBalanceWarningBottom from './components/LowBalanceWarningBottom';
import MoneyIntoAccountBottom from './components/MoneyIntoAccountBottom';
import MoneyLeavingAccountBottom from './components/MoneyLeavingAccountBottom';
import './styles.scss';

const EAlertsBalance = () => {
  const { requestApi } = useApi();
  const [showCustomerInfoChangeBottom, setShowCustomerInfoChangeBottom] = useState(false);
  const [showMyAccountsBottom, setShowMyAccountBottoms] = useState(false);
  const [showMoneyLeavingAccountBottom, setShowMoneyLeavingAccountBottom] = useState(false);
  const [showMoneyIntoAccountBottom, setShowMoneyIntoAccountBottom] = useState(false);
  const [showLowBalanceWarningBottom, setShowLowBalanceWarningBottom] = useState(false);
  const [showLoading, setShowLoading] = useState();
  const [accounts, setAccounts] = useState();
  const [selectedAccount, setSelectedAccount] = useState();
  const [setting, setSetting] = useState({
    moneyLeavingEmailEnabled: false,
    moneyLeavingPushEnabled: false,
    moneyLeavingAmount: 0,
    moneyIntoEmailEnabled: false,
    moneyIntoPushEnabled: false,
    moneyIntoAmount: 0,
    balanceEmailEnabled: false,
    balancePushEnabled: false,
    balanceAmount: 0,
  });
  const [serverErrorAlert, setServerErrorAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });

  const isMoneyLeavingEnabled = setting.moneyLeavingEmailEnabled || setting.moneyLeavingPushEnabled;
  const isMoneyIntoEnabled = setting.moneyIntoEmailEnabled || setting.moneyIntoPushEnabled;
  const isLowBalanceEnabled = setting.balanceEmailEnabled || setting.balancePushEnabled;

  // const { handleSubmit, control, setValue } = useForm();

  const onOpenMyAccountBottom = () => {
    setShowMyAccountBottoms(true);
  };

  const onOpenMoneyLeavingAccountBottom = () => {
    setShowMoneyLeavingAccountBottom(true);
  };

  const onOpenMoneyIntoAccountBottom = () => {
    setShowMoneyIntoAccountBottom(true);
  };

  const onOpenLowBalanceWarningBottom = () => {
    setShowLowBalanceWarningBottom(true);
  };

  // const handleApplyMoneyLeavingAccount = checkOptions => {
  //   setShowCustomerInfoChangeBottom(false);
  //   setShowToast({
  //     isShow: true,
  //     message: 'Alerts notifications enabled',
  //     type: 'success',
  //   });
  // };

  const onSelectAccount = account => {
    setSelectedAccount(account);
    setShowMyAccountBottoms(false);
  };

  const handleCloseServerAlert = () => {
    setServerErrorAlert({
      isShow: false,
      title: '',
      content: '',
    });
  };

  const requestGetEAlertSetting = async () => {
    setShowLoading(true);
    const { isSuccess, error, data } = await requestApi(endpoints.getEAlertSetting, {});
    setShowLoading(false);
    if (isSuccess) {
      const { grid_01: accounts } = data || {};
      setAccounts(accounts);
      if (accounts?.length) {
        setSelectedAccount(accounts[0]);
      }
    } else {
      setServerErrorAlert({
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
      return setServerErrorAlert({
        isShow: true,
        content: error,
      });
    }
    return data;
  };
  //TODO: Handle call API
  const handleSubmitLowBalance = async (values, type) => {
    setShowLowBalanceWarningBottom(false);
    const { emailEnabled, pushEnabled, amount } = values;
    const { result_cd } = await requestUpdateSetting({
      select_d: type,
      push_yn: pushEnabled ? '01' : '00',
      email_yn: emailEnabled ? '01' : '00',
    });

    if (Number(result_cd) === 1) {
      let message = '';
      // if (customerEmailEnabled || customerAppPushEnabled) {
      //   message = 'Alerts notifications enabled';
      // } else {
      //   message = 'Alerts notifications disabled';
      // }
      // setSetting({
      //   ...setting,
      //   customerEmailEnabled,
      //   customerAppPushEnabled,
      // });
      // setShowToast({
      //   isShow: true,
      //   message: message,
      //   type: 'success',
      // });
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      const {
        withd_email_yn: moneyLeavingEmailEnabled,
        withd_push_yn: moneyLeavingPushEnabled,
        withd_ums_ntc_amt: moneyLeavingAmount,
        dep_email_yn: moneyIntoEmailEnabled,
        dep_push_yn: moneyIntoPushEnabled,
        dep_ums_ntc_amt: moneyIntoAmount,
        bal_email_yn: balanceEmailEnabled,
        bal_push_yn: balancePushEnabled,
        bal_ums_ntc_amt: balanceAmount,
      } = selectedAccount;

      setSetting({
        moneyLeavingEmailEnabled: Number(moneyLeavingEmailEnabled) === 1,
        moneyLeavingPushEnabled: Number(moneyLeavingPushEnabled) === 1,
        moneyLeavingAmount,
        moneyIntoEmailEnabled: Number(moneyIntoEmailEnabled) === 1,
        moneyIntoPushEnabled: Number(moneyIntoPushEnabled) === 1,
        moneyIntoAmount,
        balanceEmailEnabled: Number(balanceEmailEnabled) === 1,
        balancePushEnabled: Number(balancePushEnabled) === 1,
        balanceAmount,
      });
    }
  }, [selectedAccount]);

  useEffect(() => {
    requestGetEAlertSetting();
  }, []);

  return (
    <div className="eAlerts-balance__wrapper">
      {showLoading && <Spinner />}
      <Header
        title="Balance"
        onClick={moveBack}
      />
      <div className="eAlerts-balance__content">
        <div className="balance__header">
          <div className="balance__title">
            <p>Set up alerts</p>
            <p>for account activity</p>
          </div>
          <div className="balance__my-account">
            <Dropdown
              label="Account"
              clazz="balance__account-dropdown"
              onFocus={onOpenMyAccountBottom}
              value={selectedAccount?.acno_nm}
              hiddenLabel
            >
              {selectedAccount ? <div className="balance__account-number">{selectedAccount?.lcl_ac_no}</div> : ''}
            </Dropdown>
          </div>
        </div>
        <div className="divider__group" />
        <div className="balance__setting__wrapper">
          <div
            className="balance__setting-item"
            onClick={onOpenMoneyLeavingAccountBottom}
          >
            <div className="item__title">Money leaving your account</div>
            <div className="item__value">
              <span className={isMoneyLeavingEnabled ? 'on' : ''}>{isMoneyLeavingEnabled ? 'ON' : 'OFF'}</span>
              <span className="arrow-icon">
                <ArrowRight />
              </span>
            </div>
          </div>
          <div
            className="balance__setting-item"
            onClick={onOpenMoneyIntoAccountBottom}
          >
            <div className="item__title">
              <div>Money into your account</div>
              {isMoneyIntoEnabled && (
                <div className="item__sub">
                  <span>Over $500.00</span>
                  <span className="divider__vertical" />
                  <span>SMS</span>
                </div>
              )}
            </div>
            <div className="item__value">
              <span className={isMoneyIntoEnabled ? 'on' : ''}>{isMoneyIntoEnabled ? 'ON' : 'OFF'}</span>
              <span className="arrow-icon">
                <ArrowRight />
              </span>
            </div>
          </div>
          <div
            className="balance__setting-item"
            onClick={onOpenLowBalanceWarningBottom}
          >
            <div className="item__title">
              <div>Low balance</div>
              {isLowBalanceEnabled && (
                <div className="item__sub">
                  {/* TODO: Check Under or Over (Figma) */}
                  <span>${formatCurrencyDisplay(setting.balanceAmount)}</span>
                  {setting.balanceEmailEnabled && (
                    <>
                      <span className="divider__vertical" />
                      <span>E-mail</span>
                    </>
                  )}
                  {setting.balancePushEnabled && (
                    <>
                      <span className="divider__vertical" />
                      <span>SMS</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="item__value">
              <span className={isLowBalanceEnabled ? 'on' : ''}>{isLowBalanceEnabled ? 'ON' : 'OFF'}</span>
              <span className="arrow-icon">
                <ArrowRight />
              </span>
            </div>
          </div>
        </div>
      </div>
      {showCustomerInfoChangeBottom && (
        <CustomerInfoChangeBottom
          onClose={() => setShowCustomerInfoChangeBottom(false)}
          onSubmit={() => {}}
        />
      )}
      {showMoneyLeavingAccountBottom && (
        <MoneyLeavingAccountBottom
          onClose={() => setShowMoneyLeavingAccountBottom(false)}
          onSubmit={() => {}}
        />
      )}
      {showMoneyIntoAccountBottom && (
        <MoneyIntoAccountBottom
          onClose={() => setShowMoneyIntoAccountBottom(false)}
          onSubmit={() => {}}
        />
      )}
      {showLowBalanceWarningBottom && (
        <LowBalanceWarningBottom
          onClose={() => setShowLowBalanceWarningBottom(false)}
          data={{
            amount: setting.balanceAmount,
            emailEnabled: setting.balanceEmailEnabled,
            pushEnabled: setting.balancePushEnabled,
          }}
          onSubmit={handleSubmitLowBalance}
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
      {showMyAccountsBottom && (
        <MyAccountsBottom
          open={showMyAccountsBottom}
          onClose={() => setShowMyAccountBottoms(false)}
          onSelect={onSelectAccount}
          accounts={accounts}
        />
      )}
      <Alert
        isCloseButton={false}
        isShowAlert={serverErrorAlert.isShow}
        title={serverErrorAlert.title}
        subtitle={serverErrorAlert.content}
        textAlign="left"
        onClose={handleCloseServerAlert}
        firstButton={{
          onClick: handleCloseServerAlert,
          label: 'Confirm',
        }}
      />
    </div>
  );
};

export default EAlertsBalance;
