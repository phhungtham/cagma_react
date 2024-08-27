import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FillTooltipIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import Dropdown from '@common/components/atoms/Dropdown';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import EnterAmountBottom from '@common/components/organisms/bottomSheets/EnterAmountBottom';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import SelectTermsBottom from '@common/components/organisms/bottomSheets/SelectTermsBottom';
import Header from '@common/components/organisms/Header';
import { CurrencyCode } from '@common/constants/currency';
import { SelectTermDurationTypes } from '@common/constants/terms';
import { moveBack } from '@utilities/index';

import IntendedUseOfAccountBottom from '../IntendedUseOfAccountBottom';
import { openAccountDefaultValues } from './constants';
import './styles.scss';

const enterAmountMin = 10;
const enterAmountMax = 1000;

const EnterAccountInformation = ({ onSubmit }) => {
  const [showMyAccountsBottom, setShowMyAccountBottom] = useState(false);
  const [showSelectTermsBottom, setShowSelectTermsBottom] = useState(false);
  const [showEnterAmountBottom, setShowEnterAmountBottom] = useState(false);
  const [showIntendedUseAccountBottom, setShowIntendedUseAccountBottom] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState();
  const [intendedUseAccount, setIntendedUseAccount] = useState();
  const [selectedTerm, setSelectedTerm] = useState();

  const { handleSubmit, control, setValue, getValues } = useForm({
    defaultValues: openAccountDefaultValues,
    mode: 'onChange',
  });

  const [amount] = getValues(['amount']);

  const onOpenMyAccountBottom = () => {
    setShowMyAccountBottom(true);
  };

  const onOpenSelectTermsBottom = () => {
    setShowSelectTermsBottom(true);
  };

  const onOpenEnterAmountBottom = () => {
    setShowEnterAmountBottom(true);
  };

  const onOpenIntendedUseAccountBottom = () => {
    setShowIntendedUseAccountBottom(true);
  };

  const onSelectAccount = account => {
    console.log('account :>> ', account);
    setSelectedAccount(account);
    setShowMyAccountBottom(false);
  };

  const onSelectIntendedUseAccount = intended => {
    setIntendedUseAccount(intended);
    setShowIntendedUseAccountBottom(false);
  };

  const onChangeAmount = value => {
    setValue('amount', value?.amount || '');
    setShowEnterAmountBottom(false);
  };

  const onChangeTerms = value => {
    setSelectedTerm(value);
  };

  const onSubmitOpenAccount = values => {
    onSubmit();
  };

  useEffect(() => {
    //Check set show Terms
    setShowTerms(false);
  }, []);

  return (
    <div className="enter-account-information__wrapper">
      <Header
        title="Open Account"
        onClick={moveBack}
      />
      <div className="enter-account-information__content">
        <div className="enter-account__form page__container">
          <h1 className="page__title">e-Saving(CAD)</h1>
          {showTerms && (
            <section>
              <TextDropdown
                label="Terms"
                placeholder="Select"
                onClick={onOpenSelectTermsBottom}
                value={selectedTerm ? `${selectedTerm} Months` : ''}
              >
                <div className="enter-account__term">
                  <span>Maturity date</span>
                  <span>25.05.2024</span>
                </div>
              </TextDropdown>
            </section>
          )}

          <section>
            <TextDropdown
              label="Amount"
              placeholder="10.00 ~ 1,000.00 CAD"
              onClick={onOpenEnterAmountBottom}
              value={amount}
            />
          </section>
          <section>
            <TextDropdown
              label="Intended use of account"
              placeholder="Select"
              align="vertical"
              onClick={onOpenIntendedUseAccountBottom}
              value={intendedUseAccount?.label}
            />
          </section>
          <section>
            <TextDropdown
              label="From"
              placeholder="My Account"
              onClick={onOpenMyAccountBottom}
              value={selectedAccount?.dep_ac_alnm_nm}
            >
              {selectedAccount ? (
                <div className="enter-account__account-number">{selectedAccount?.lcl_ac_no_display}</div>
              ) : (
                <></>
              )}
            </TextDropdown>
          </section>
          <div className="divider__item__solid my-2" />
          <section className="pb-6">
            <TextDropdown
              label="Interest rate"
              placeholder="Interest rate"
              value="0.07% APR"
              disabled
            />
            <InfoBox
              variant="informative"
              label="APR (Annual Percentage Rate)"
            />
          </section>
          <div className="divider__item__solid" />
          <section className="py-5">
            <div className="checklist___options">
              <div className="option-item">
                <CheckBox
                  size="large"
                  label="Debit Card Issuance"
                />
                <div className="item__tooltip">
                  <FillTooltipIcon />
                </div>
              </div>
              <div className="option-item">
                <CheckBox
                  size="large"
                  label="Third Party Determination"
                />
                <div className="item__tooltip">
                  <FillTooltipIcon />
                </div>
              </div>
            </div>
            <section className="third_party-form__wrapper">
              <Controller
                render={({ field }) => (
                  <Input
                    label="Name of the Third Party"
                    {...field}
                  />
                )}
                control={control}
                name="name"
              />
              <Controller
                render={({ field }) => (
                  <InputDate
                    label="Date of Birth"
                    {...field}
                  />
                )}
                control={control}
                name="name"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="Address"
                    {...field}
                  />
                )}
                control={control}
                name="address"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="City"
                    {...field}
                  />
                )}
                control={control}
                name="city"
              />
              <Controller
                render={({ field }) => (
                  <Dropdown
                    label="Province"
                    {...field}
                  />
                )}
                control={control}
                name="province"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="Postal Code"
                    {...field}
                  />
                )}
                control={control}
                name="postalCode"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="Title"
                    {...field}
                  />
                )}
                control={control}
                name="title"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="Occupation/Nature of Business"
                    {...field}
                  />
                )}
                control={control}
                name="occupation"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="Relationship to Applicant(S)"
                    {...field}
                  />
                )}
                control={control}
                name="relationship"
              />
            </section>
          </section>
          <div className="divider__item__solid" />
          <section className="mt-6">
            <Controller
              render={({ field }) => (
                <Input
                  label={'Referral Code (Optional)'}
                  {...field}
                />
              )}
              control={control}
              name="referralCode"
            />
          </section>
        </div>
        <div className="footer__fixed">
          <Button
            label="Open"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(onSubmitOpenAccount)}
          />
        </div>
      </div>
      <MyAccountsBottom
        open={showMyAccountsBottom}
        onClose={() => setShowMyAccountBottom(false)}
        onSelect={onSelectAccount}
      />
      <IntendedUseOfAccountBottom
        open={showIntendedUseAccountBottom}
        onClose={() => setShowIntendedUseAccountBottom(false)}
        onSelect={onSelectIntendedUseAccount}
      />
      {showEnterAmountBottom && (
        <EnterAmountBottom
          onClose={() => setShowEnterAmountBottom(false)}
          account={selectedAccount}
          currency={CurrencyCode.CAD}
          amount={amount}
          min={enterAmountMin}
          max={enterAmountMax}
          onChangeAmount={onChangeAmount}
        />
      )}
      {showSelectTermsBottom && (
        <SelectTermsBottom
          onClose={() => setShowSelectTermsBottom(false)}
          type={SelectTermDurationTypes.MONTH}
          onChange={onChangeTerms}
          value={selectedTerm}
          max={60}
          min={1}
        />
      )}
    </div>
  );
};

export default EnterAccountInformation;
