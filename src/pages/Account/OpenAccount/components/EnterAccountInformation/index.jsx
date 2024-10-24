import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import Spinner from '@common/components/atoms/Spinner';
import EnterAmountBottom from '@common/components/organisms/bottomSheets/EnterAmountBottom';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import SelectFrequencyBottom from '@common/components/organisms/bottomSheets/SelectFrequencyBottom';
import SelectTermsBottom from '@common/components/organisms/bottomSheets/SelectTermsBottom';
import Header from '@common/components/organisms/Header';
import { AccountType } from '@common/constants/account';
import { getIntendedUseAccountCode } from '@common/constants/commonCode';
import { CurrencyCode } from '@common/constants/currency';
import { dateFormat } from '@common/constants/dateTime';
import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import {
  PeriodUnitCodeDisplay,
  ProductCode,
  ProductPeriodUnitCode,
  ProductUnitCodeWithTermType,
} from '@common/constants/product';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import useCardCount from '@hooks/useCardCount';
import { commonCodeDataToOptions } from '@utilities/convert';
import { formatCurrencyDisplay } from '@utilities/currency';
import { moveBack } from '@utilities/index';
import dayjs from 'dayjs';

import { UnitCodeWithPeriodType } from '../../constants';
import useOpenAccount from '../../hooks/useOpenAccount';
import { openAccountDefaultValues, termOptionsBaseProductCode } from './constants';
import InterestRateSection from './InterestRateSection';
import ReferralCodeSection from './ReferralCodeSection';
import { openAccountSchema } from './schema';
import './styles.scss';
import ThirdPartyFormSection from './ThirdPartyFormSection';

const EnterAccountInformation = ({ onSubmit, product, setAlert, provinces }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showMyAccountsBottom, setShowMyAccountBottom] = useState(false);
  const [showSelectTermsBottom, setShowSelectTermsBottom] = useState(false);
  const [showEnterAmountBottom, setShowEnterAmountBottom] = useState(false);
  const [showSelectFrequencyBottom, setShowSelectFrequencyBottom] = useState(false);
  const [showIntendedUseAccountBottom, setShowIntendedUseAccountBottom] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState();
  const [showThirdPartyForm, setShowThirdPartyForm] = useState(false);
  const [showInterestRateSection, setShowInterestRateSection] = useState(false);
  const [showReferralCodeSection, setShowReferralCodeSection] = useState(false);
  const [accounts, setAccounts] = useState();
  const [intendedUseAccountOptions, setIntendedUseAccountOptions] = useState();
  const [interestData, setInterestData] = useState();
  const { getFilteredBasedProductCode } = useOpenAccount({ product });

  const { requestApi } = useApi();
  const { data: cardCountInfo, isLoading: isLoadingGetCardCount, requestGetCardCount } = useCardCount();

  const {
    prdt_c_display: productName,
    dep_sjt_class: productType,
    prdt_psb_trm_unit_c: unitCode,
    prdt_c: productCode,
    prdt_st_trm_unit_cnt: minTerms,
    prdt_close_trm_unit_cnt: maxTerms,
    product_ccy: productCurrencyCode,
    product_min_amount: enterAmountMin,
    product_max_amount: enterAmountMax,
    product_min_amount_display: amountMinDisplay,
    product_max_amount_display: amountMaxDisplay,
  } = product || {};

  const isInstallmentSaving = productCode === ProductCode.E_INSTALLMENT_SAVING;
  const showTerms = productType !== DepositSubjectClass.REGULAR_SAVING;

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

  const [amount, intendedUseAccountDisplay, term, paymentEachSession, interestRateDisplay] = watch([
    'amount',
    'intendedUseAccountDisplay',
    'term',
    'paymentEachSession',
    'interestRateDisplay',
  ]);

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

  const handleSelectAccount = account => {
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
    // setShowEnterAmountBottom(true); //This logic not good when choose enter amount before select terms
  };

  const handleSelectFrequency = value => {
    setValue('paymentEachSession', value);
    setShowSelectFrequencyBottom(false);
  };

  const onSubmitOpenAccount = values => {
    onSubmit({ ...values, ...interestData });
  };

  const getMaturityDate = () => {
    //TODO: Check as-is to get maturity date
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
    if (productType === DepositSubjectClass.TERM_DEPOSIT_GIC) {
      showThirdParty = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
      showInterestRate = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
      showReferralCode = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
    }
    if ([ProductCode.RRSP_E_SAVINGS].includes(productCode)) {
      showInterestRate = !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
    }
    if ([ProductCode.RRSP_E_GIC].includes(productCode)) {
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

  const requestGetAccounts = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getAccountList);
    setShowLoading(false);
    if (isSuccess) {
      const { cus_acno_list: accountList } = data || {};
      let newAccounts = (accountList || []).map(item => {
        return {
          ...item,
          name: item.dep_ac_alnm_nm,
          number: item.lcl_ac_no_display,
          balance: item.def_ac_blc_display,
        };
      });
      const filteredAccounts = getFilteredBasedProductCode(newAccounts);
      if (filteredAccounts?.length) {
        const defaultAccount = filteredAccounts.find(account => String(account.base_ac_t) === '1');
        if (defaultAccount) {
          handleSelectAccount(defaultAccount);
        }
      }
      setAccounts(filteredAccounts);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestGetIntendedUseAccount = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, {
      code: getIntendedUseAccountCode,
    });
    setShowLoading(false);
    if (isSuccess) {
      const { dep_ac_usag_d: intendedList } = data || {};
      const convertedIntendedList = commonCodeDataToOptions(intendedList);
      setIntendedUseAccountOptions(convertedIntendedList);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestGetInterestRate = async () => {
    setShowLoading(true);
    const payload = {
      prdt_c: productCode,
      product_ccy: productCurrencyCode,
      period_type: UnitCodeWithPeriodType[unitCode],
      period_count: Number(term),
      product_amount: amount,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.inquiryProductInterestRate, payload);
    setShowLoading(false);
    if (isSuccess) {
      setInterestData(data);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  useEffect(() => {
    if (showInterestRateSection) {
      if (productType === DepositSubjectClass.TERM_DEPOSIT_GIC) {
        if (term && amount) {
          requestGetInterestRate();
        }
      }
    }
  }, [term, amount, showInterestRateSection]);

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
    checkShowThirdPartyForm();
  }, [amount, intendedUseAccountDisplay, selectedAccount, term]);

  useEffect(() => {
    if (showIntendedUseAccountBottom && !intendedUseAccountOptions) {
      requestGetIntendedUseAccount();
    }
  }, [showIntendedUseAccountBottom]);

  useEffect(() => {
    requestGetAccounts();
  }, []);

  return (
    <>
      <Header
        title="Open Account"
        onClick={moveBack}
      />
      <div className="enter-account-information__wrapper">
        {(isLoadingGetCardCount || showLoading) && <Spinner />}
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
                      value={term ? `${term} ${PeriodUnitCodeDisplay[unitCode]}` : ''}
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
                    placeholder={`${amountMinDisplay} ~ ${amountMaxDisplay} ${productCurrencyCode}`}
                    onClick={onOpenEnterAmountBottom}
                    value={amount ? `${formatCurrencyDisplay(amount)} ${productCurrencyCode}` : undefined}
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
                    <InterestRateSection interestRate={interestData?.apply_intrt_display} />
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
                  <ThirdPartyFormSection provinces={provinces} />
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
            onSelect={handleSelectAccount}
            type={AccountType.BANKING}
            accounts={accounts}
          />
        )}

        {showIntendedUseAccountBottom && !!intendedUseAccountOptions && (
          <SelectBottom
            open={showIntendedUseAccountBottom}
            onClose={() => setShowIntendedUseAccountBottom(false)}
            onSelect={onSelectIntendedUseAccount}
            options={intendedUseAccountOptions}
            showArrow={false}
            title={'Intended use of account'}
          />
        )}

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
            type={ProductUnitCodeWithTermType[unitCode]}
            onChange={onChangeTerms}
            value={term}
            max={maxTerms}
            min={minTerms}
            options={termOptionsBaseProductCode[productCode] || []} //TODO: Get options base SD
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
