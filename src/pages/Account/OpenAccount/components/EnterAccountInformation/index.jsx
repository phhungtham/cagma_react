import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import Spinner from '@common/components/atoms/Spinner';
import EnterAmountBottom from '@common/components/organisms/bottomSheets/EnterAmountBottom';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import SelectFrequencyBottom from '@common/components/organisms/bottomSheets/SelectFrequencyBottom';
import SelectTermsBottom from '@common/components/organisms/bottomSheets/SelectTermsBottom';
import Header from '@common/components/organisms/Header';
import { AccountType } from '@common/constants/account';
import { CurrencyCode } from '@common/constants/currency';
import { dateFormat } from '@common/constants/dateTime';
import { DepositSubjectClass } from '@common/constants/deposit';
import { ProductCode, ProductPeriodUnitCode } from '@common/constants/product';
import { SelectTermDurationTypes } from '@common/constants/terms';
import { getAccountListRequest } from '@common/redux/accounts/action';
import { accountReducer } from '@common/redux/accounts/reducer';
import { accountSaga } from '@common/redux/accounts/saga';
import { accountList, accountLoadState } from '@common/redux/accounts/selector';
import { FeatureName } from '@common/redux/accounts/type';
import { yupResolver } from '@hookform/resolvers/yup';
import useCardCount from '@hooks/useCardCount';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { formatCurrencyDisplay } from '@utilities/currency';
import { moveBack } from '@utilities/index';
import dayjs from 'dayjs';

import IntendedUseOfAccountBottom from '../IntendedUseOfAccountBottom';
import { openAccountDefaultValues, termOptionsBaseProductCode } from './constants';
import InterestRateSection from './InterestRateSection';
import ReferralCodeSection from './ReferralCodeSection';
import { openAccountSchema } from './schema';
import './styles.scss';
import ThirdPartyFormSection from './ThirdPartyFormSection';

const enterAmountMin = 10;
const enterAmountMax = 1000;

const EnterAccountInformation = ({ onSubmit, product }) => {
  const { data: cardCountInfo, isLoading: isLoadingGetCardCount, requestGetCardCount } = useCardCount();
  const [showMyAccountsBottom, setShowMyAccountBottom] = useState(false);
  const [showSelectTermsBottom, setShowSelectTermsBottom] = useState(false);
  const [showEnterAmountBottom, setShowEnterAmountBottom] = useState(false);
  const [showSelectFrequencyBottom, setShowSelectFrequencyBottom] = useState(false);
  const [showIntendedUseAccountBottom, setShowIntendedUseAccountBottom] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState();
  const [showThirdPartyForm, setShowThirdPartyForm] = useState(false);
  const [showInterestRateSection, setShowInterestRateSection] = useState(false);
  const [showReferralCodeSection, setShowReferralCodeSection] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  useReducers([{ key: FeatureName, reducer: accountReducer }]);
  useSagas([{ key: FeatureName, saga: accountSaga }]);

  const accounts = useSelector(accountList);
  const isLoadingGetAccounts = useSelector(accountLoadState);

  const {
    ntfct_intrt: interestRate,
    lcl_prdt_nm: productName,
    dep_sjt_class: productType,
    prdt_psb_trm_unit_c: unitCode,
    prdt_c: productCode,
  } = product || {};

  const isInstallmentSaving = productCode === ProductCode.E_INSTALLMENT_SAVING;

  const methods = useForm({
    defaultValues: openAccountDefaultValues,
    mode: 'onChange',
    resolver: yupResolver(openAccountSchema),
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = methods;

  const [amount, intendedUseAccountDisplay, term, paymentEachSession] = watch([
    'amount',
    'intendedUseAccountDisplay',
    'term',
    'paymentEachSession',
  ]);

  console.log('errors :>> ', errors);

  const onOpenMyAccountBottom = () => {
    setShowMyAccountBottom(true);
  };

  const onOpenSelectTermsBottom = () => {
    setShowSelectTermsBottom(true);
  };

  const onOpenEnterAmountBottom = () => {
    setShowEnterAmountBottom(true);
  };

  const handleOpenSelectFrequencyBottom = () => {
    setShowSelectFrequencyBottom(true);
  };

  const onOpenIntendedUseAccountBottom = () => {
    setShowIntendedUseAccountBottom(true);
  };

  const onSelectAccount = account => {
    setValue('accountNo', account.lcl_ac_no, { shouldValidate: true });
    setSelectedAccount(account);
    setShowMyAccountBottom(false);
  };

  const onSelectIntendedUseAccount = intended => {
    setValue('intendedUseAccount', intended.value, { shouldValidate: true });
    setValue('intendedUseAccountDisplay', intended.label, { shouldValidate: true });
    setShowIntendedUseAccountBottom(false);
  };

  const onChangeAmount = value => {
    setValue('amount', value?.amount || '', { shouldValidate: true });
    setShowEnterAmountBottom(false);
  };

  const onChangeTerms = value => {
    setValue('term', value);
    setShowSelectTermsBottom(false);
    setShowEnterAmountBottom(true);
  };

  const handleSelectFrequency = value => {
    setValue('paymentEachSession', value);
    setShowSelectFrequencyBottom(false);
  };

  const onSubmitOpenAccount = values => {
    onSubmit(values);
  };

  const getMaturityDate = () => {
    const currentDate = dayjs();
    const addType = unitCode === Number(ProductPeriodUnitCode.MONTH) ? 'month' : 'day';
    const maturityDate = currentDate.add(term, addType);
    const formattedDate = maturityDate.format(dateFormat);
    return formattedDate;
  };

  const isBankingAccount = account => {
    if (account?.acno_jiacno_gbn !== '1') {
      return false;
    }
    const acnoPrefix = account?.lcl_ac_no || '';
    if (['700', '701', '702', '703'].includes(acnoPrefix.substring(0, 3))) {
      return true;
    }

    return false;
  };

  const checkShowThirdPartyForm = () => {
    let showThirdParty = false;
    let showInterestRate = false;
    let showReferralCode = false;
    if ([ProductCode.E_SAVING].includes(productCode)) {
      showThirdParty = !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
      showInterestRate = !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
      showReferralCode = !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
    }
    if ([ProductCode.TFSA_E_SAVINGS, ProductCode.TFSA_E_GIC].includes(productCode)) {
      showInterestRate = !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
      showReferralCode = !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
    }
    if ([ProductCode.E_POWER_TERM_DEPOSIT].includes(productCode)) {
      showThirdParty = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
      showInterestRate = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
      showReferralCode = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
    }
    if ([ProductCode.RRSP_E_SAVINGS].includes(productCode)) {
      showInterestRate = !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
    }
    if ([ProductCode.E_SHORT_TERM_GIC, ProductCode.RRSP_E_GIC].includes(productCode)) {
      showInterestRate = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
      showReferralCode = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
    }
    if ([ProductCode.E_INSTALLMENT_SAVING].includes(productCode)) {
      showInterestRate = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount && !!paymentEachSession;
      showReferralCode = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount && !!paymentEachSession;
    }
    setShowThirdPartyForm(showThirdParty);
    setShowInterestRateSection(showInterestRate);
    setShowReferralCodeSection(showReferralCode);
  };

  useEffect(() => {
    if (showReferralCodeSection && !cardCountInfo) {
      const enableGetCardCount = [ProductCode.E_SAVING].includes(productCode);
      if (enableGetCardCount) {
        requestGetCardCount();
      }
    }
  }, [showReferralCodeSection]);

  useEffect(() => {
    if (cardCountInfo && cardCountInfo.count === 0) {
      setValue('debitCardIssuance', true, { shouldValidate: true });
    }
  }, [cardCountInfo]);

  useEffect(() => {
    if (productType) {
      const isShowTerms = productType !== DepositSubjectClass.REGULAR_SAVING;
      setShowTerms(isShowTerms);
    }
  }, [productType]);

  useEffect(() => {
    checkShowThirdPartyForm();
  }, [amount, intendedUseAccountDisplay, selectedAccount, term]);

  useEffect(() => {
    if (accounts?.length) {
      let newAccounts = accounts;
      newAccounts = accounts.filter(account => {
        return isBankingAccount(account);
      });
      setFilteredAccounts(newAccounts);
      const defaultAccount = newAccounts.find(account => String(account.base_ac_t) === '1');
      if (defaultAccount) {
        onSelectAccount(defaultAccount);
      }
    }
  }, [accounts]);

  useEffect(() => {
    getAccountListRequest();
  }, []);

  return (
    <>
      <Header
        title="Open Account"
        onClick={moveBack}
      />
      <div className="enter-account-information__wrapper">
        {(isLoadingGetCardCount || isLoadingGetAccounts) && <Spinner />}
        <div className="enter-account-information__content">
          <FormProvider {...methods}>
            <div className="enter-account__form">
              <div className="page__container">
                <h1 className="page__title">{productName}</h1>
                {showTerms && (
                  <section>
                    <TextDropdown
                      label="Terms"
                      placeholder="Select"
                      onClick={onOpenSelectTermsBottom}
                      value={term ? `${term} Months` : ''}
                    >
                      {term && (
                        <div className="enter-account__term">
                          <span>Maturity date</span>
                          <span>{getMaturityDate()}</span>
                        </div>
                      )}
                    </TextDropdown>
                  </section>
                )}

                <section>
                  <TextDropdown
                    label={isInstallmentSaving ? 'Monthly Installment  Amount' : 'Amount'}
                    placeholder="10.00 ~ 1,000.00 CAD"
                    onClick={onOpenEnterAmountBottom}
                    value={amount ? `${formatCurrencyDisplay(amount)} CAD` : undefined}
                  />
                </section>
                {isInstallmentSaving && (
                  <section>
                    <TextDropdown
                      label="Payment Date Each Session"
                      placeholder="Select"
                      onClick={handleOpenSelectFrequencyBottom}
                      value={paymentEachSession?.value}
                    />
                  </section>
                )}
                <section>
                  <TextDropdown
                    label="Intended use of account"
                    placeholder="Select"
                    align="vertical"
                    onClick={onOpenIntendedUseAccountBottom}
                    value={intendedUseAccountDisplay}
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
                    <InterestRateSection interestRate={interestRate} />
                  </>
                )}
                {showReferralCodeSection && (
                  <>
                    <div className="divider__item__solid" />
                    <ReferralCodeSection productCode={productCode} />
                  </>
                )}
              </div>
              {showThirdPartyForm && (
                <>
                  <div className="divider__group mt-6" />
                  <ThirdPartyFormSection />
                </>
              )}
            </div>
          </FormProvider>
          <div className="footer__fixed">
            <Button
              label="Open"
              variant="filled__primary"
              className="btn__cta"
              // onClick={onSubmitOpenAccount}
              onClick={handleSubmit(onSubmitOpenAccount)}
              disable={!isValid}
            />
          </div>
        </div>
        {showMyAccountsBottom && (
          <MyAccountsBottom
            open={showMyAccountsBottom}
            onClose={() => setShowMyAccountBottom(false)}
            onSelect={onSelectAccount}
            type={AccountType.BANKING}
            accounts={filteredAccounts}
          />
        )}

        <IntendedUseOfAccountBottom
          open={showIntendedUseAccountBottom}
          onClose={() => setShowIntendedUseAccountBottom(false)}
          onSelect={onSelectIntendedUseAccount}
        />

        {showEnterAmountBottom && (
          <EnterAmountBottom
            onClose={() => setShowEnterAmountBottom(false)}
            title={selectedAccount?.dep_ac_alnm_nm}
            subTitle={selectedAccount?.lcl_ac_no_display}
            note={`Available Balance $${selectedAccount?.def_ac_blc_display || '0.00'}`}
            currency={CurrencyCode.CAD}
            amount={amount}
            min={enterAmountMin}
            max={enterAmountMax}
            onChangeAmount={onChangeAmount}
            btnText="Next"
          />
        )}

        {showSelectTermsBottom && (
          <SelectTermsBottom
            onClose={() => setShowSelectTermsBottom(false)}
            type={
              unitCode === Number(ProductPeriodUnitCode.MONTH)
                ? SelectTermDurationTypes.MONTH
                : SelectTermDurationTypes.DATE
            }
            onChange={onChangeTerms}
            value={term}
            max={60}
            min={1}
            options={termOptionsBaseProductCode[productCode] || []}
          />
        )}

        {showSelectFrequencyBottom && (
          <SelectFrequencyBottom
            open={showSelectFrequencyBottom}
            onClose={() => setShowSelectFrequencyBottom(false)}
            onChange={handleSelectFrequency}
            value={paymentEachSession}
          />
        )}
      </div>
    </>
  );
};

export default EnterAccountInformation;
