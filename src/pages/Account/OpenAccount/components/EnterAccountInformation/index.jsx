import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';
import './styles.scss';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import { useState } from 'react';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import EnterAmountBottom from '@common/components/organisms/bottomSheets/EnterAmountBottom';
import IntendedUseOfAccountBottom from '../IntendedUseOfAccountBottom';

const EnterAccountInformation = () => {
  const [showMyAccountsBottom, setShowMyAccountBottoms] = useState(false);
  const [showEnterAmountBottom, setShowEnterAmountBottoms] = useState(false);
  const [showIntendedUseAccountBottom, setShowIntendedUseAccountBottom] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState();
  const [intendedUseAccount, setIntendedUseAccount] = useState();
  const [selectedAmount, setSelectedAmount] = useState({
    value: '',
    unit: ''
  });

  const onOpenMyAccountBottom = () => {
    setShowMyAccountBottoms(true);
  };

  const onOpenEnterAmountBottom = () => {
    setShowEnterAmountBottoms(true);
  };

  const onOpenIntendedUseAccountBottom = () => {
    setShowIntendedUseAccountBottom(true);
  };

  const onSelectAccount = (account) => {
    setSelectedAccount(account);
    console.log('account :>> ', account);
    setShowMyAccountBottoms(false);
  };

  const onSelectIntendedUseAccount = (intended) => {
    setIntendedUseAccount(intended);
    setShowIntendedUseAccountBottom(false);
  };

  const onChangeAmount = (value) => {
    setSelectedAmount({
      value: value,
      unit: ''
    });
  };

  return (
    <div className='enter-account-information__wrapper'>
      <Header
        title="Open Account"
        onClick={moveBack}
      />
      <div className='enter-account-information__content page__container'>
        <h1 className='page__title'>e-Saving(CAD)</h1>
        <div className='enter-account__form'>
          <section >
            <TextDropdown label="From" placeholder="My Account" onClick={onOpenMyAccountBottom} value={selectedAccount?.name}>
              {selectedAccount ? <div className='enter-account__account-number'>{selectedAccount?.number}</div> : ''}
            </TextDropdown>
          </section>
          <section>
            <TextDropdown label="Amount" placeholder="10.00 ~ 1,000.00 CAD" onClick={onOpenEnterAmountBottom} value={selectedAmount?.value}>
            </TextDropdown>
          </section>
          <section>
            <TextDropdown 
              label="Intended use of account" 
              placeholder="Select" 
              align='vertical' 
              onClick={onOpenIntendedUseAccountBottom} 
              value={intendedUseAccount?.label}>
            </TextDropdown>
          </section>
        </div>
      </div>
      <MyAccountsBottom open={showMyAccountsBottom} onClose={() => setShowMyAccountBottoms(false)} onSelect={onSelectAccount} />
      <IntendedUseOfAccountBottom open={showIntendedUseAccountBottom} onClose={() => setShowIntendedUseAccountBottom(false)} onSelect={onSelectIntendedUseAccount} />
      {showEnterAmountBottom && 
        <EnterAmountBottom 
          onClose={() => setShowEnterAmountBottoms(false)} 
          accountName={selectedAccount?.name}
          accountNumber={selectedAccount?.number}
          accountBalance="Available Balance $300,000.00"
          currency="CAD"
          amount={selectedAmount.value}
          onChangeAmount={onChangeAmount}
        />
      }
      
    </div>
  );
};

export default EnterAccountInformation;