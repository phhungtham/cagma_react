import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ArrowRight } from '@assets/icons';
import ChequingIcon from '@assets/images/icon-fill-chequing.png';
import InvestmentIcon from '@assets/images/icon-fill-investment-40.png';
import SavingIcon from '@assets/images/icon-fill-saving-40.png';
import Alert from '@common/components/atoms/Alert';
import Dropdown from '@common/components/atoms/Dropdown';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import Header from '@common/components/organisms/Header';
import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import { eAlertLabels, menuLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import { formatCurrencyDisplay } from '@utilities/currency';
import { isIphone } from '@utilities/deviceDetected';
import getPushToken from '@utilities/gmCommon/getPushToken';
import { moveBack } from '@utilities/index';
import { appLanguage } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import LowBalanceWarningBottom from './components/LowBalanceWarningBottom';
import MoneyIntoAccountBottom from './components/MoneyIntoAccountBottom';
import MoneyLeavingAccountBottom from './components/MoneyLeavingAccountBottom';
import { EAlertType } from './constants';
import './styles.scss';

const EAlertsBalance = ({ translate: t }) => {
  const { requestApi } = useApi();
  const currentLanguage = useSelector(appLanguage);
  const [showMyAccountsBottom, setShowMyAccountBottoms] = useState(false);
  const [showMoneyLeavingAccountBottom, setShowMoneyLeavingAccountBottom] = useState(false);
  const [showMoneyIntoAccountBottom, setShowMoneyIntoAccountBottom] = useState(false);
  const [showLowBalanceWarningBottom, setShowLowBalanceWarningBottom] = useState(false);
  const [showLoading, setShowLoading] = useState();
  const [accounts, setAccounts] = useState();
  const [selectedAccount, setSelectedAccount] = useState();
  const [tokenPlugin, setTokenPlugin] = useState('');
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
    if (isSuccess) {
      const { grid_01: accountList } = data || {};
      const newAccounts = (accountList || []).map(item => {
        return {
          ...item,
          name: item.acno_nm,
          number: item.lcl_ac_no,
          balance: formatCurrencyDisplay(item.pabl_blc),
        };
      });
      setAccounts(newAccounts);
      if (accountList?.length) {
        if (selectedAccount) {
          const account = newAccounts.find(item => item.lcl_ac_no === selectedAccount?.lcl_ac_no);
          setSelectedAccount(account);
        } else {
          setSelectedAccount(accountList[0]);
        }
      }
    } else {
      setServerErrorAlert({
        isShow: true,
        content: error,
      });
    }
    setShowLoading(false);
  };

  const requestUpdateSetting = async (values, type) => {
    setShowLoading(true);
    const { emailEnabled, pushEnabled, amount } = values;
    const isIphoneDevice = isIphone();
    const payload = {
      select_d: type,
      push_yn: pushEnabled ? '01' : '00',
      email_yn: emailEnabled ? '01' : '00',
      ums_ntc_amt: Number(amount),
      ums_ntc_acno: selectedAccount?.lcl_ac_no,
      push_lang_c: (currentLanguage || 'en').toUpperCase(),
      push_tmn_no: tokenPlugin,
      tmn_d: isIphoneDevice ? 'I' : 'A',
    };
    const { isSuccess, error, data } = await requestApi(endpoints.updateEAlertSetting, payload);
    setShowLoading(false);
    if (!isSuccess) {
      return setServerErrorAlert({
        isShow: true,
        content: error,
      });
    }
    const { result_cd } = data;

    if (Number(result_cd) === 1) {
      let message = '';
      let type = '';
      if (pushEnabled || emailEnabled) {
        message = t(eAlertLabels.alertEnabled);
        type = 'success';
      } else {
        message = t(eAlertLabels.alertDisabled);
        type = 'info';
      }
      await requestGetEAlertSetting();
      setShowToast({
        isShow: true,
        message: message,
        type: type,
      });
    }
  };

  const handleSubmitLowBalance = async values => {
    setShowLowBalanceWarningBottom(false);
    await requestUpdateSetting(values, EAlertType.BALANCE);
  };

  const handleSubmitMoneyInto = async values => {
    setShowMoneyIntoAccountBottom(false);
    await requestUpdateSetting(values, EAlertType.DEPOSIT);
  };

  const handleSubmitMoneyLeaving = async values => {
    setShowMoneyLeavingAccountBottom(false);
    await requestUpdateSetting(values, EAlertType.WITHDRAWAL);
  };

  const RenderAccountIcon = () => {
    if (!selectedAccount) {
      return;
    }
    let icon = '';
    const { dep_sjt_class, casol_prdt_c_display } = selectedAccount;
    if (dep_sjt_class === DepositSubjectClass.REGULAR_SAVING) {
      if (casol_prdt_c_display === 'Chequing') {
        icon = ChequingIcon;
      } else {
        icon = SavingIcon;
      }
    } else if ([DepositSubjectClass.INSTALLMENT_SAVING, DepositSubjectClass.TERM_DEPOSIT_GIC].includes(dep_sjt_class)) {
      icon = InvestmentIcon;
    }

    return (
      <div className="account-icon">
        <img
          src={icon}
          alt="account icon"
        />
      </div>
    );
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

  const getTokenCallback = token => {
    setTokenPlugin(token);
  };

  useEffect(() => {
    getPushToken(getTokenCallback);
    requestGetEAlertSetting();
  }, []);
  return (
    <div className="eAlerts-balance__wrapper">
      {showLoading && <Spinner />}
      <Header
        title={t(menuLabels.balance)}
        onClick={moveBack}
      />
      <div className="eAlerts-balance__content">
        <div className="balance__header">
          <div className="balance__title">{t(eAlertLabels.setupAlertActivity)}</div>
          <div className="balance__my-account">
            <Dropdown
              label={t(eAlertLabels.account)}
              clazz="account-dropdown"
              onFocus={onOpenMyAccountBottom}
              value={selectedAccount?.acno_nm}
              startAdornment={<RenderAccountIcon />}
            >
              {selectedAccount ? <div className="account-number">{selectedAccount?.lcl_ac_no}</div> : ''}
            </Dropdown>
          </div>
        </div>
        <div className="divider__group" />
        <div className="balance__setting__wrapper">
          <div
            className="balance__setting-item"
            onClick={onOpenMoneyLeavingAccountBottom}
          >
            <div className="item__title">
              {t(eAlertLabels.moneyLeaving)}
              {isMoneyLeavingEnabled && (
                <div className="item__sub">
                  <span>
                    {t(eAlertLabels.over.replace('%1', `$${formatCurrencyDisplay(setting.moneyLeavingAmount)}`))}
                  </span>
                  {setting.moneyLeavingEmailEnabled && (
                    <>
                      <span className="divider__vertical" />
                      <span>{t(eAlertLabels.email2)}</span>
                    </>
                  )}
                  {setting.moneyLeavingPushEnabled && (
                    <>
                      <span className="divider__vertical" />
                      {/* //TODO: Missing label */}
                      <span>SMS</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="item__value">
              <span className={isMoneyLeavingEnabled ? 'on' : ''}>
                {isMoneyLeavingEnabled ? t(eAlertLabels.on) : t(eAlertLabels.off)}
              </span>
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
              <div>{t(eAlertLabels.moneyInto)}</div>
              {isMoneyIntoEnabled && (
                <div className="item__sub">
                  <span>
                    {t(eAlertLabels.over.replace('%1', `$${formatCurrencyDisplay(setting.moneyIntoAmount)}`))}
                  </span>
                  {setting.moneyIntoEmailEnabled && (
                    <>
                      <span className="divider__vertical" />
                      <span>{t(eAlertLabels.email2)}</span>
                    </>
                  )}
                  {setting.moneyIntoPushEnabled && (
                    <>
                      <span className="divider__vertical" />
                      {/* //TODO: Missing label */}
                      <span>SMS</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="item__value">
              <span className={isMoneyIntoEnabled ? 'on' : ''}>
                {isMoneyIntoEnabled ? t(eAlertLabels.on) : t(eAlertLabels.off)}
              </span>
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
              <div>{t(eAlertLabels.lowBalance)}</div>
              {isLowBalanceEnabled && (
                <div className="item__sub">
                  <span>{t(eAlertLabels.under.replace('%1', `$${formatCurrencyDisplay(setting.balanceAmount)}`))}</span>
                  {setting.balanceEmailEnabled && (
                    <>
                      <span className="divider__vertical" />
                      <span>{t(eAlertLabels.email2)}</span>
                    </>
                  )}
                  {setting.balancePushEnabled && (
                    <>
                      <span className="divider__vertical" />
                      {/* //TODO: Missing label */}
                      <span>SMS</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="item__value">
              <span className={isLowBalanceEnabled ? 'on' : ''}>
                {isLowBalanceEnabled ? t(eAlertLabels.on) : t(eAlertLabels.off)}
              </span>
              <span className="arrow-icon">
                <ArrowRight />
              </span>
            </div>
          </div>
        </div>
      </div>
      {showMoneyLeavingAccountBottom && (
        <MoneyLeavingAccountBottom
          onClose={() => setShowMoneyLeavingAccountBottom(false)}
          data={{
            amount: setting.moneyLeavingAmount,
            emailEnabled: setting.moneyLeavingEmailEnabled,
            pushEnabled: setting.moneyLeavingPushEnabled,
          }}
          translate={t}
          onSubmit={handleSubmitMoneyLeaving}
        />
      )}
      {showMoneyIntoAccountBottom && (
        <MoneyIntoAccountBottom
          onClose={() => setShowMoneyIntoAccountBottom(false)}
          data={{
            amount: setting.moneyIntoAmount,
            emailEnabled: setting.moneyIntoEmailEnabled,
            pushEnabled: setting.moneyIntoPushEnabled,
          }}
          translate={t}
          onSubmit={handleSubmitMoneyInto}
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
          translate={t}
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

export default withHTMLParseI18n(EAlertsBalance);
