/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import Spinner from '@common/components/atoms/Spinner';
import EnterAmountBottom from '@common/components/organisms/bottomSheets/EnterAmountBottom';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import SelectDateBottom from '@common/components/organisms/bottomSheets/SelectDateBottom';
import SelectFrequencyBottom from '@common/components/organisms/bottomSheets/SelectFrequencyBottom';
import { frequencyTypeOptions } from '@common/components/organisms/bottomSheets/SelectFrequencyBottom/constants';
import SelectTermsBottom from '@common/components/organisms/bottomSheets/SelectTermsBottom';
import Header from '@common/components/organisms/Header';
import { AccountType } from '@common/constants/account';
import { FrequencyType } from '@common/constants/bottomsheet';
import { getIntendedUseAccountCode } from '@common/constants/commonCode';
import { CurrencyCode } from '@common/constants/currency';
import { selectType } from '@common/constants/dateTime';
import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import {
  commonLabels,
  ctaLabels,
  openAccountLabels as labels,
  menuLabels,
  openAccountLabels,
} from '@common/constants/labels';
import { PeriodUnitCodeDisplay, ProductCode, ProductUnitCodeWithTermType } from '@common/constants/product';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { commonCodeDataToOptions } from '@utilities/convert';
import { formatCurrencyDisplay } from '@utilities/currency';
import { moveBack } from '@utilities/index';
import dayjs from 'dayjs';

import { UnitCodeWithPeriodType } from '../../constants';
import useOpenAccount from '../../hooks/useOpenAccount';
import { openAccountDefaultValues } from './constants';
import InterestRateSection from './InterestRateSection';
import ReferralCodeSection from './ReferralCodeSection';
import { openAccountSchema } from './schema';
import './styles.scss';
import ThirdPartyFormSection from './ThirdPartyFormSection';

const EnterAccountInformation = ({ onSubmit, product, setAlert, provinces, termOptions, translate: t }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showMyAccountsBottom, setShowMyAccountBottom] = useState(false);
  const [showSelectTermsBottom, setShowSelectTermsBottom] = useState(false);
  const [showEnterAmountBottom, setShowEnterAmountBottom] = useState(false);
  const [showSelectFrequencyBottom, setShowSelectFrequencyBottom] = useState(false);
  const [showTaxYearBottom, setShowTaxYearBottom] = useState(false);
  const [showIntendedUseAccountBottom, setShowIntendedUseAccountBottom] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState();
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [allowSelectTaxYear, setAllowSelectTaxYear] = useState(false);
  const [accounts, setAccounts] = useState();
  const [intendedUseAccountOptions, setIntendedUseAccountOptions] = useState();
  const [interestData, setInterestData] = useState();
  const { getFilteredBasedProductCode } = useOpenAccount({ product });

  const { requestApi } = useApi();

  const {
    lcl_prdt_nm,
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

  const selectFrequencyOptions = frequencyTypeOptions.filter(item => item.value === FrequencyType.MONTHLY);

  const isChequing = productCode === ProductCode.CHEQUING;
  const isInstallmentSaving = productCode === ProductCode.E_INSTALLMENT_SAVING;
  const isRRSPESaving = productCode === ProductCode.RRSP_E_SAVINGS;
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

  const [amount, intendedUseAccountDisplay, term, paymentDate, maturityDateDisplay, taxYear] = watch([
    'amount',
    'intendedUseAccountDisplay',
    'term',
    'paymentDate',
    'maturityDateDisplay',
    'taxYear',
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

  const handleOpenIntendedUseAccountBottom = () => {
    setShowIntendedUseAccountBottom(true);
  };

  const handleOpenTaxYearBottom = () => {
    setShowTaxYearBottom(true);
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
    setValue('amount', value?.amount.replace(/,/g, '') || '', { shouldValidate: true });
    setShowEnterAmountBottom(false);
  };

  const onChangeTerms = result => {
    const { termValue, maturityDate, maturityDateDisplay } = result || {};
    setValue('term', termValue);
    setValue('maturityDate', maturityDate);
    setValue('maturityDateDisplay', maturityDateDisplay);
    setShowSelectTermsBottom(false);
    // setShowEnterAmountBottom(true); //This logic not good when choose enter amount before select terms
  };

  const handleSelectFrequency = value => {
    setValue('paymentDate', value?.value, { shouldValidate: true });
    setShowSelectFrequencyBottom(false);
  };

  const handleChangeTaxYear = year => {
    setValue('taxYear', year, { shouldValidate: true });
    setShowTaxYearBottom(false);
  };

  const onSubmitOpenAccount = values => {
    onSubmit({ ...values, ...interestData });
  };

  const getMaturityDate = async term => {
    if (!term) {
      return '';
    }
    setShowLoading(true);
    const payload = {
      prdt_c: productCode,
      ctrt_trm_d: ProductUnitCodeWithTermType[unitCode],
      ctrt_trm_cnt: term,
    };
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.inquiryProductDueDate, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { biz_dt: maturityDate, biz_dt_display: maturityDateDisplay } = data;
      return {
        maturityDate,
        maturityDateDisplay,
      };
    } else {
      setAlert({
        isShow: true,
        content: error,
        requiredLogin,
      });
    }
    return '';
  };

  const checkShowThirdPartyForm = () => {
    let showMoreInfo = false;
    if (productType === DepositSubjectClass.REGULAR_SAVING) {
      if (productCode === ProductCode.CHEQUING) {
        showMoreInfo = !!intendedUseAccountDisplay;
      } else {
        showMoreInfo = !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
        if (productCode === ProductCode.E_SAVING && Number(amount || '') === 0) {
          showMoreInfo = !!amount && !!intendedUseAccountDisplay; //Allow create e-Saving account if amount = 0
        }
        if (productCode === ProductCode.RRSP_E_SAVINGS && showMoreInfo) {
          showMoreInfo = !!taxYear;
        }
      }
    } else if (productType === DepositSubjectClass.TERM_DEPOSIT_GIC) {
      showMoreInfo = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
    } else if (productType === DepositSubjectClass.INSTALLMENT_SAVING) {
      showMoreInfo = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount && !!paymentDate;
    }
    setShowMoreInfo(showMoreInfo);
  };

  //Allow select tax year with RRSP e-Saving if current date between beginning of year until 60 days
  const checkAllowSelectTaxYear = () => {
    const startOfYear = dayjs().startOf('year');
    const day60 = startOfYear.add('60', 'day');
    const now = dayjs();
    const allow = !now.isAfter(day60);
    if (!allow) {
      const currentYear = dayjs().year();
      setValue('taxYear', currentYear, { shouldValidate: true });
    }
    setAllowSelectTaxYear(allow);
  };

  const requestGetAccounts = async () => {
    setShowLoading(true);
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.getAccountList);
    setShowLoading(false);
    if (isSuccess) {
      const { cus_acno_list: accountList } = data || {};
      let newAccounts = (accountList || []).map(item => {
        return {
          ...item,
          name: item.dep_prdt_nm,
          number: item.lcl_ac_no_display,
          balance: item.pabl_blc_display,
        };
      });
      const filteredAccounts = getFilteredBasedProductCode(newAccounts);
      if (filteredAccounts?.length) {
        const defaultAccount = filteredAccounts.find(account => String(account.base_ac_t) === '1');
        if (defaultAccount) {
          handleSelectAccount(defaultAccount);
        } else {
          handleSelectAccount(filteredAccounts[0]);
        }
      }
      setAccounts(filteredAccounts);
      //Request get interest rate only one time if is open banking account
      if (productType === DepositSubjectClass.REGULAR_SAVING) {
        requestGetInterestRate();
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
        requiredLogin,
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
    };
    if ([DepositSubjectClass.TERM_DEPOSIT_GIC, DepositSubjectClass.INSTALLMENT_SAVING].includes(productType)) {
      payload.period_type = UnitCodeWithPeriodType[unitCode];
      payload.period_count = Number(term);
      payload.product_amount = amount;
    }
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.inquiryProductInterestRate, payload);
    setShowLoading(false);
    if (isSuccess) {
      setInterestData(data);
    } else {
      setAlert({
        isShow: true,
        content: error,
        requiredLogin,
      });
    }
  };

  const requestGetCardCount = async () => {
    setShowLoading(true);
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.getCardList);
    setShowLoading(false);
    if (isSuccess) {
      let isShowDebitCardIssuanceOption = false;
      //Only display debit card issuance checkbox when there is no card exist and not card in progress add new
      if (data && !data.card_cnt) {
        isShowDebitCardIssuanceOption = true;
      }
      if (isShowDebitCardIssuanceOption) {
        setShowLoading(true);
        const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.checkCardIssuanceProgress);
        setShowLoading(false);
        if (isSuccess) {
          if (data && Number(data.cnt) > 0) {
            isShowDebitCardIssuanceOption = false;
          }
        } else {
          setAlert({
            isShow: true,
            content: error,
            requiredLogin,
          });
        }
      }
      if (isShowDebitCardIssuanceOption) {
        setValue('isShowDebitCardIssuance', true, { shouldValidate: true });
      }
      if (productCode === ProductCode.CHEQUING) {
        requestGetInterestRate(); //Get interest rate for chequing account after get card count
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
        requiredLogin,
      });
    }
  };

  useEffect(() => {
    if (showMoreInfo) {
      if ([DepositSubjectClass.TERM_DEPOSIT_GIC, DepositSubjectClass.INSTALLMENT_SAVING].includes(productType)) {
        if (term && amount) {
          requestGetInterestRate();
        }
      }
    }
  }, [term, amount, showMoreInfo]);

  useEffect(() => {
    setValue('productCode', productCode);
  }, [productCode]);

  useEffect(() => {
    if ([ProductCode.E_SAVING, ProductCode.CHEQUING].includes(productCode) && showMoreInfo) {
      requestGetCardCount();
    }
  }, [showMoreInfo]);

  useEffect(() => {
    checkShowThirdPartyForm();
  }, [amount, intendedUseAccountDisplay, selectedAccount, term, paymentDate, taxYear]);

  useEffect(() => {
    if (showIntendedUseAccountBottom && !intendedUseAccountOptions) {
      requestGetIntendedUseAccount();
    }
  }, [showIntendedUseAccountBottom]);

  useEffect(() => {
    if (productCode !== ProductCode.CHEQUING) {
      requestGetAccounts();
    }
    if (productCode === ProductCode.RRSP_E_SAVINGS) {
      checkAllowSelectTaxYear();
    }
  }, []);

  return (
    <>
      <Header
        title={t(menuLabels.openAccount)}
        onClick={moveBack}
      />
      <div
        className={`enter-account-information__wrapper ${
          productCode === ProductCode.E_INSTALLMENT_SAVING ? 'installment-saving' : ''
        }`}
      >
        {showLoading && <Spinner />}
        <div className="enter-account-information__content">
          <FormProvider {...methods}>
            <div className="enter-account__form">
              <div className="page__container">
                <h1 className="page__title">{productName || lcl_prdt_nm}</h1>

                {showTerms && (
                  <section>
                    <TextDropdown
                      label={t(labels.terms)}
                      placeholder="Select"
                      onClick={onOpenSelectTermsBottom}
                      value={term ? `${term} ${t(PeriodUnitCodeDisplay[unitCode])}` : ''}
                    >
                      {term && (
                        <div className="enter-account__term">
                          <span>{t(labels.maturityDate)}</span>
                          <span>{maturityDateDisplay}</span>
                        </div>
                      )}
                    </TextDropdown>
                  </section>
                )}
                {!isChequing && (
                  <section>
                    <TextDropdown
                      label={isInstallmentSaving ? t(labels.monthlyInstallmentAmount) : t(labels.amount)}
                      placeholder={`${amountMinDisplay} ~ ${amountMaxDisplay} ${productCurrencyCode}`}
                      onClick={onOpenEnterAmountBottom}
                      value={amount ? `${formatCurrencyDisplay(amount)} ${productCurrencyCode}` : undefined}
                    />
                  </section>
                )}

                {isInstallmentSaving && (
                  <section>
                    <TextDropdown
                      label={t(labels.paymentDateEachSession)}
                      placeholder="Select"
                      onClick={handleOpenSelectFrequencyBottom}
                      value={paymentDate}
                    />
                  </section>
                )}
                <section>
                  <TextDropdown
                    label={t(labels.intendedUseAccount)}
                    placeholder="Select"
                    align="vertical"
                    onClick={handleOpenIntendedUseAccountBottom}
                    value={intendedUseAccountDisplay}
                  />
                </section>
                {isChequing && (
                  <section>
                    <TextDropdown
                      label={t(labels.numberOfTransactions)}
                      placeholder="Select"
                      value="Unlimited"
                      readonly
                    />
                  </section>
                )}
                {isRRSPESaving && (
                  <section>
                    <TextDropdown
                      label={t(labels.taxationYear)}
                      placeholder="Select"
                      onClick={handleOpenTaxYearBottom}
                      value={allowSelectTaxYear ? taxYear : ''}
                      disabled={!allowSelectTaxYear}
                    />
                  </section>
                )}
                {!isChequing && (
                  <section>
                    <TextDropdown
                      label={t(labels.from)}
                      placeholder="My Account"
                      onClick={onOpenMyAccountBottom}
                      value={selectedAccount?.dep_prdt_nm}
                    >
                      {selectedAccount ? (
                        <div className="enter-account__account-number">{selectedAccount?.lcl_ac_no_display}</div>
                      ) : (
                        <></>
                      )}
                    </TextDropdown>
                  </section>
                )}

                {showMoreInfo && (
                  <>
                    <div className="divider__item__solid my-2" />
                    <InterestRateSection
                      interestRate={interestData?.apply_intrt_display}
                      translate={t}
                    />
                    <div className="divider__item__solid" />
                    <ReferralCodeSection
                      productCode={productCode}
                      translate={t}
                    />
                  </>
                )}
              </div>
              {showMoreInfo && (
                <>
                  <div className="divider__group mt-6" />
                  <ThirdPartyFormSection
                    provinces={provinces}
                    translate={t}
                  />
                </>
              )}
            </div>
          </FormProvider>
          <div className="footer__fixed">
            <Button
              label={t(labels.open)}
              variant="filled__primary"
              className="btn__cta"
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
            title={t(labels.intendedUseAccount)}
          />
        )}

        {showEnterAmountBottom && (
          <EnterAmountBottom
            onClose={() => setShowEnterAmountBottom(false)}
            title={selectedAccount?.dep_prdt_nm}
            subTitle={selectedAccount?.lcl_ac_no_display}
            note={t(openAccountLabels.availableBalance).replace(
              '%1',
              `$${selectedAccount?.pabl_blc_display || '0.00'}`
            )}
            currency={CurrencyCode.CAD}
            amount={amount}
            min={enterAmountMin}
            max={enterAmountMax}
            onChangeAmount={onChangeAmount}
            btnText={t(ctaLabels.next)}
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
            disabled={isInstallmentSaving}
            options={termOptions}
            inquiryMaturityDate={getMaturityDate}
          />
        )}

        {showSelectFrequencyBottom && (
          <SelectFrequencyBottom
            open={showSelectFrequencyBottom}
            onClose={() => setShowSelectFrequencyBottom(false)}
            onChange={handleSelectFrequency}
            value={{
              type: FrequencyType.MONTHLY,
              value: paymentDate,
            }}
            typeOptions={selectFrequencyOptions}
          />
        )}

        {showTaxYearBottom && (
          <SelectDateBottom
            open={showTaxYearBottom}
            maxYear={dayjs().year()}
            minYear={dayjs().subtract(1, 'year').year()}
            onClose={() => setShowTaxYearBottom(false)}
            onDateChange={handleChangeTaxYear}
            defaultDate={taxYear}
            type={selectType.year}
            title={t(commonLabels.selectDate)}
          />
        )}
      </div>
    </>
  );
};

export default EnterAccountInformation;
