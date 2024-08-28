import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import EnterAmountBottom from '@common/components/organisms/bottomSheets/EnterAmountBottom';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import SelectTermsBottom from '@common/components/organisms/bottomSheets/SelectTermsBottom';
import Header from '@common/components/organisms/Header';
import { CurrencyCode } from '@common/constants/currency';
import { SelectTermDurationTypes } from '@common/constants/terms';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatCurrencyDisplay } from '@utilities/currency';
import { moveBack } from '@utilities/index';

import IntendedUseOfAccountBottom from '../IntendedUseOfAccountBottom';
import { openAccountDefaultValues } from './constants';
import InterestRateSection from './InterestRateSection';
import { openAccountSchema } from './schema';
import './styles.scss';

const enterAmountMin = 10;
const enterAmountMax = 1000;

const EnterAccountInformation = ({ onSubmit, interestRate }) => {
  const [showMyAccountsBottom, setShowMyAccountBottom] = useState(false);
  const [showSelectTermsBottom, setShowSelectTermsBottom] = useState(false);
  const [showEnterAmountBottom, setShowEnterAmountBottom] = useState(false);
  const [showIntendedUseAccountBottom, setShowIntendedUseAccountBottom] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState();
  const [selectedTerm, setSelectedTerm] = useState();

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: openAccountDefaultValues,
    mode: 'onChange',
    resolver: yupResolver(openAccountSchema),
  });

  console.log('errors :>> ', errors);

  const [amount, dep_ac_usag_d_display] = watch(['amount', 'dep_ac_usag_d_display']);
  const showInterestRateSection = !!amount && !!dep_ac_usag_d_display && !!selectedAccount;

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
    setValue('dep_ac_usag_d', intended.value);
    setValue('dep_ac_usag_d_display', intended.label);
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
    console.log('values :>> ', values);
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
              value={amount ? `${formatCurrencyDisplay(amount)} CAD` : undefined}
            />
          </section>
          <section>
            <TextDropdown
              label="Intended use of account"
              placeholder="Select"
              align="vertical"
              onClick={onOpenIntendedUseAccountBottom}
              value={dep_ac_usag_d_display}
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
          {showInterestRateSection && (
            <>
              <div className="divider__item__solid my-2" />
              <InterestRateSection
                control={control}
                interestRate={interestRate}
                watch={watch}
                setValue={setValue}
              />
            </>
          )}
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
