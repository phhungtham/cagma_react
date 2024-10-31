import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import Spinner from '@common/components/atoms/Spinner';
import EnterAmountBottom from '@common/components/organisms/bottomSheets/EnterAmountBottom';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import SelectFrequencyBottom from '@common/components/organisms/bottomSheets/SelectFrequencyBottom';
import { frequencyTypeOptions } from '@common/components/organisms/bottomSheets/SelectFrequencyBottom/constants';
import SelectTermsBottom from '@common/components/organisms/bottomSheets/SelectTermsBottom';
import Header from '@common/components/organisms/Header';
import { AccountType } from '@common/constants/account';
import { FrequencyType } from '@common/constants/bottomsheet';
import { getIntendedUseAccountCode } from '@common/constants/commonCode';
import { CurrencyCode } from '@common/constants/currency';
import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import { PeriodUnitCodeDisplay, ProductCode, ProductUnitCodeWithTermType } from '@common/constants/product';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { commonCodeDataToOptions } from '@utilities/convert';
import { formatCurrencyDisplay } from '@utilities/currency';
import { moveBack } from '@utilities/index';

import { UnitCodeWithPeriodType } from '../../constants';
import useOpenAccount from '../../hooks/useOpenAccount';
import { openAccountDefaultValues } from './constants';
import InterestRateSection from './InterestRateSection';
import ReferralCodeSection from './ReferralCodeSection';
import { openAccountSchema } from './schema';
import './styles.scss';
import ThirdPartyFormSection from './ThirdPartyFormSection';

const EnterAccountInformation = ({ onSubmit, product, setAlert, provinces, termOptions }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [showMyAccountsBottom, setShowMyAccountBottom] = useState(false);
  const [showSelectTermsBottom, setShowSelectTermsBottom] = useState(false);
  const [showEnterAmountBottom, setShowEnterAmountBottom] = useState(false);
  const [showSelectFrequencyBottom, setShowSelectFrequencyBottom] = useState(false);
  const [showIntendedUseAccountBottom, setShowIntendedUseAccountBottom] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState();
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [accounts, setAccounts] = useState();
  const [intendedUseAccountOptions, setIntendedUseAccountOptions] = useState();
  const [interestData, setInterestData] = useState();
  const { getFilteredBasedProductCode } = useOpenAccount({ product });

  const { requestApi } = useApi();

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

  const selectFrequencyOptions = frequencyTypeOptions.filter(item => item.value === FrequencyType.MONTHLY);

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

  const [amount, intendedUseAccountDisplay, term, paymentDate, interestRateDisplay, tfsaTerm, maturityDateDisplay] =
    watch([
      'amount',
      'intendedUseAccountDisplay',
      'term',
      'paymentDate',
      'interestRateDisplay',
      'tfsaTerm',
      'maturityDateDisplay',
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

  const onChangeTerms = result => {
    const { termValue, maturityDate, maturityDateDisplay } = result || {};
    setValue('term', termValue);
    setValue('maturityDate', maturityDate);
    setValue('maturityDateDisplay', maturityDateDisplay);
    setShowSelectTermsBottom(false);
    // setShowEnterAmountBottom(true); //This logic not good when choose enter amount before select terms
  };

  const handleSelectFrequency = value => {
    setValue('paymentDate', value?.value);
    setShowSelectFrequencyBottom(false);
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
    const { data, error, isSuccess } = await requestApi(endpoints.inquiryProductDueDate, payload);
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
      });
    }
    return '';
  };

  const checkShowThirdPartyForm = () => {
    let showMoreInfo = false;
    if (productType === DepositSubjectClass.REGULAR_SAVING) {
      showMoreInfo = !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
    }
    if (productType === DepositSubjectClass.TERM_DEPOSIT_GIC) {
      showMoreInfo = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount;
    }
    if (productType === DepositSubjectClass.INSTALLMENT_SAVING) {
      showMoreInfo = !!term && !!amount && !!intendedUseAccountDisplay && !!selectedAccount && !!paymentDate;
    }
    setShowMoreInfo(showMoreInfo);
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
      //Request get interest rate only one time if is open banking account
      if (productType === DepositSubjectClass.REGULAR_SAVING) {
        requestGetInterestRate();
      }
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
    };
    if ([DepositSubjectClass.TERM_DEPOSIT_GIC, DepositSubjectClass.INSTALLMENT_SAVING].includes(productType)) {
      payload.period_type = UnitCodeWithPeriodType[unitCode];
      payload.period_count = Number(term);
      payload.product_amount = amount;
    }
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

  const requestGetCardCount = async () => {
    setShowLoading(true);
    //TODO: Update using other endpoint. CACA009
    const { data, error, isSuccess } = await requestApi(endpoints.getCardCount);
    setShowLoading(false);
    if (isSuccess) {
      if (data && data.count === 0) {
        setValue('debitCardIssuance', true, { shouldValidate: true });
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
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
    if ([ProductCode.E_SAVING].includes(productCode) && showMoreInfo) {
      requestGetCardCount();
    }
  }, [showMoreInfo]);

  useEffect(() => {
    checkShowThirdPartyForm();
  }, [amount, intendedUseAccountDisplay, selectedAccount, term, paymentDate]);

  useEffect(() => {
    if (showIntendedUseAccountBottom && !intendedUseAccountOptions) {
      requestGetIntendedUseAccount();
    }
  }, [showIntendedUseAccountBottom]);

  useEffect(() => {
    requestGetAccounts();
  }, []);

  //TODO: Handle layout for Chequing account
  return (
    <>
      <Header
        title="Open Account"
        onClick={moveBack}
      />
      <div className="enter-account-information__wrapper">
        {showLoading && <Spinner />}
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
                          <span>{maturityDateDisplay}</span>
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
                      value={paymentDate}
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
                {showMoreInfo && (
                  <>
                    <div className="divider__item__solid my-2" />
                    <InterestRateSection interestRate={interestData?.apply_intrt_display} />
                    <div className="divider__item__solid" />
                    <ReferralCodeSection productCode={productCode} />
                  </>
                )}
              </div>
              {showMoreInfo && (
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
            options={termOptions} //TODO: Get options base SD
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
      </div>
    </>
  );
};

export default EnterAccountInformation;
