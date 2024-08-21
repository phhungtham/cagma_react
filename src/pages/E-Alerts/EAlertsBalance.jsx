import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';
import { ArrowRight } from '@assets/icons';
import Switch from '@common/components/atoms/Switch';
import { useState } from 'react';
import CustomerInfoChangeBottom from './components/CustomerInfoChangeBottom';
import Toast from '@common/components/atoms/Toast';
import './styles.scss';
import { Controller, useForm } from 'react-hook-form';
import Dropdown from '@common/components/atoms/Dropdown';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import MoneyLeavingAccountBottom from './components/MoneyLeavingAccountBottom';

const EAlertsBalance = () => {
  const [showCustomerInfoChangeBottom, setShowCustomerInfoChangeBottom] = useState(false);
  const [showMyAccountsBottom, setShowMyAccountBottoms] = useState(false);
  const [showMoneyLeavingAccountBottom, setShowMoneyLeavingAccountBottom] = useState(false);
  const [showMoneyIntoAccountBottom, setShowMoneyIntoAccountBottom] = useState(false);
  const [showLowBalanceWarningBottom, setShowLowBalanceWarningBottom] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState();

  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success'
  });

  const { handleSubmit, control, setValue } = useForm();

  const onOpenMyAccountBottom = () => {
    setShowMyAccountBottoms(true);
  };

  const onOpenMoneyLeavingAccountBottom = () => {
    setShowMoneyLeavingAccountBottom(true);
  };

  const handleApplyCustomerInfoChange = (checkOptions) => {
    setShowCustomerInfoChangeBottom(false);
    setShowToast({
      isShow: true,
      message: 'Alerts  notifications enabled',
      type: 'success'
    });
  };

  const onSelectAccount = (account) => {
    setSelectedAccount(account);
    console.log('account :>> ', account);
    setShowMyAccountBottoms(false);
  };

  return (
    <div className="eAlerts-balance__wrapper">
      <Header
        title="Balance"
        onClick={moveBack}
      />
      <div className="eAlerts-balance__content">
        <div className='balance__header'>
          <div className='balance__title'>
            <p>Set up alerts</p>
            <p>for account activity</p>
          </div>
          <div className='balance__my-account'>
            <Dropdown label='Account' clazz="balance__account-dropdown" onFocus={onOpenMyAccountBottom} value={selectedAccount?.name}>
              {selectedAccount ? <div className='balance__account-number'>{selectedAccount?.number}</div> : ''}
            </Dropdown>
          </div>
        </div>
        <div className='divider__group'></div>
        <div className='balance__setting__wrapper'>
          <div className='balance__setting-item' onClick={onOpenMoneyLeavingAccountBottom}>
            <div className='item__title'>Money leaving your account</div>
            <div className='item__value'>
              <span className=''>OFF</span>
              <span className='arrow-icon'>
                <ArrowRight />
              </span>
            </div>
          </div>
          <div className='balance__setting-item'>
            <div className='item__title'>
              <div>Money into your account</div>
              <div className='item__sub'>
                <span>Over $500.00</span>
                <span className='divider__vertical'></span>
                <span>SMS</span>
              </div>
            </div>
            <div className='item__value'>
              <span className='on'>ON</span>
              <span className='arrow-icon'>
                <ArrowRight />
              </span>
            </div>
          </div>
          <div className='balance__setting-item'>
            <div className='item__title'>
              <div>Low balance</div>
              <div className='item__sub'>
                <span>Under $500.00</span>
                <span className='divider__vertical'></span>
                <span>E-mail</span>
              </div>
            </div>
            <div className='item__value'>
              <span className='on'>ON</span>
              <span className='arrow-icon'>
                <ArrowRight />
              </span>
            </div>
          </div>
        </div>
      </div>
      {showCustomerInfoChangeBottom && 
        <CustomerInfoChangeBottom onClose={() => setShowCustomerInfoChangeBottom(false)} onSubmit={handleApplyCustomerInfoChange} />
      }
      {showMoneyLeavingAccountBottom && 
        <MoneyLeavingAccountBottom onClose={() => setShowMoneyLeavingAccountBottom(false)} onSubmit={handleApplyCustomerInfoChange} />
      }
      <section className="toast__overlay">
        <Toast
          isShowToast={showToast.isShow}
          type={showToast.type}
          onClose={() => setShowToast({...showToast, isShow: false})}
          message={showToast.message}
        />
      </section>
      <MyAccountsBottom open={showMyAccountsBottom} onClose={() => setShowMyAccountBottoms(false)} onSelect={onSelectAccount} />
    </div>
  );
};

export default EAlertsBalance;