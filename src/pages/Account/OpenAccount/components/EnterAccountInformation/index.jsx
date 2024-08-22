import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';
import './styles.scss';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import { useState } from 'react';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import EnterAmountBottom from '@common/components/organisms/bottomSheets/EnterAmountBottom';
import IntendedUseOfAccountBottom from '../IntendedUseOfAccountBottom';
import InfoBox from '@common/components/atoms/InfoBox';
import CheckBox from '@common/components/atoms/Checkbox';
import { FillTooltipIcon } from '@assets/icons';
import { Controller, useForm } from 'react-hook-form';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Dropdown from '@common/components/atoms/Dropdown';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import SelectTermsBottom from '@common/components/organisms/bottomSheets/SelectTermsBottom';
import { SelectTermDurationTypes } from '@common/constants/terms';

const EnterAccountInformation = ({onSubmit}) => {
  const [showMyAccountsBottom, setShowMyAccountBottoms] = useState(false);
  const [showSelectTermsBottom, setShowSelectTermsBottom] = useState(false);
  const [showEnterAmountBottom, setShowEnterAmountBottoms] = useState(false);
  const [showIntendedUseAccountBottom, setShowIntendedUseAccountBottom] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState();
  const [intendedUseAccount, setIntendedUseAccount] = useState();
  const [selectedTerm, setSelectedTerm] = useState();
  const [selectedAmount, setSelectedAmount] = useState({
    value: '',
    unit: ''
  });

  const { handleSubmit, control, setValue } = useForm();

  const onOpenMyAccountBottom = () => {
    setShowMyAccountBottoms(true);
  };

  const onOpenSelectTermsBottom = () => {
    setShowSelectTermsBottom(true);
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

  const onChangeTerms = (value) => {
    setSelectedTerm(value);
  };

  const onSubmitOpenAccount = (values) => {
    onSubmit();
  };

  return (
    <div className='enter-account-information__wrapper'>
      <Header
        title="Open Account"
        onClick={moveBack}
      />
      <div className='enter-account-information__content'>
        <div className='enter-account__form page__container'>
          <h1 className='page__title'>e-Saving(CAD)</h1>
          <section >
            <TextDropdown label="From" placeholder="My Account" onClick={onOpenMyAccountBottom} value={selectedAccount?.name}>
              {selectedAccount ? <div className='enter-account__account-number'>{selectedAccount?.number}</div> : ''}
            </TextDropdown>
          </section>
          <section >
            <TextDropdown label="Terms" placeholder="Select" onClick={onOpenSelectTermsBottom} value={selectedTerm ? `${selectedTerm} Months` : ''}>
              <div className='enter-account__term'>
                <span>Maturity date</span>
                <span>25.05.2024</span>
              </div>
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
          <div className='divider__item__solid my-2'></div>
          <section className='pb-6'>
            <TextDropdown 
              label="Interest rate" 
              placeholder="Interest rate" 
              value="0.07% APR"
              disabled={true}
            />
            <InfoBox variant="informative" label="APR (Annual Percentage Rate)"/>
          </section>
          <div className='divider__item__solid'></div>
          <section className='py-5'>
            <div className='checklist___options'>
              <div className='option-item'>
                <CheckBox
                  size="large"
                  label="Debit Card Issuance"
                />
                <div className='item__tooltip'>
                  <FillTooltipIcon />
                </div>
              </div>
              <div className='option-item'>
                <CheckBox
                  size="large"
                  label="Third Party Determination"
                />
                <div className='item__tooltip'>
                  <FillTooltipIcon />
                </div>
              </div>
            </div>
            <section className='third_party-form__wrapper'>
              <Controller
                render={({ field }) => <Input label="Name of the Third Party" {...field} />}
                control={control}
                name="name"
              />
              <Controller
                render={({ field }) => <InputDate label="Date of Birth" {...field} />}
                control={control}
                name="name"
              />
              <Controller
                render={({ field }) => <Input label="Address" {...field} />}
                control={control}
                name="address"
              />
              <Controller
                render={({ field }) => <Input label="City" {...field} />}
                control={control}
                name="city"
              />
              <Controller
                render={({ field }) => <Dropdown label="Province" {...field} />}
                control={control}
                name="province"
              />
              <Controller
                render={({ field }) => <Input label="Postal Code" {...field} />}
                control={control}
                name="postalCode"
              />
              <Controller
                render={({ field }) => <Input label="Title" {...field} />}
                control={control}
                name="title"
              />
              <Controller
                render={({ field }) => <Input label="Occupation/Nature of Business" {...field} />}
                control={control}
                name="occupation"
              />
              <Controller
                render={({ field }) => <Input label="Relationship to Applicant(S)" {...field} />}
                control={control}
                name="relationship"
              />
            </section>
          </section>
          <div className='divider__item__solid'></div>
          <section className='mt-6'>
            <Controller
              render={({ field }) => <Input label={'Referral Code (Optional)'} {...field} />}
              control={control}
              name="referralCode"
            />
          </section>
        </div>
        <div className="footer__fixed">
          <Button label="Open" variant="filled__primary" className="btn__cta" onClick={handleSubmit(onSubmitOpenAccount)}></Button>
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
      {showSelectTermsBottom && 
        <SelectTermsBottom 
          onClose={() => setShowSelectTermsBottom(false)} 
          type={SelectTermDurationTypes.MONTH}
          onChange={onChangeTerms}
          value={selectedTerm}
          max={60}
          min={1}
        />
      }
    </div>
  );
};

export default EnterAccountInformation;