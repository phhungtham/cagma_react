import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Spinner from '@common/components/atoms/Spinner';
import { CurrencyCode } from '@common/constants/currency';
import { DepositSubjectClass } from '@common/constants/deposit';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { nativeParamsSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import { getCustomerInfoRequest } from '../redux/customer/action';
import { customerReducer } from '../redux/customer/reducer';
import { customerSaga } from '../redux/customer/saga';
import { customerInfo, customerLoadState, getCustomerFailedMsg } from '../redux/customer/selector';
import { FeatureName } from '../redux/customer/type';
import CustomerInfoBottom from './components/CustomerInfoBottom';
import EnterAccountInformation from './components/EnterAccountInformation';
import OpenAccountSuccessful from './components/OpenAccountSuccessful';
import TermAndConditions from './components/TermAndConditions';
import { OPEN_ACCOUNT_STEP, openAccountInfo } from './constants';

const productInfoTest = {
  prdt_c: '5117020025',
  product_ccy: CurrencyCode.CAD,
  ntfct_intrt: 0.07,
  dep_sjt_class: DepositSubjectClass.REGULAR_SAVING,
  prdt_st_trm_unit_cnt: 12,
  prdt_close_trm_unit_cnt: 60,
  prdt_psb_trm_unit_c: 3,
  lcl_prdt_nm: 'Shinhan e-Savings (CAD)',
};

const OpenAccount = ({ translation }) => {
  useReducers([{ key: FeatureName, reducer: customerReducer }]);
  useSagas([{ key: FeatureName, saga: customerSaga }]);
  const productInfo = productInfoTest || useSelector(nativeParamsSelector);
  const customer = useSelector(customerInfo);
  const loadingCustomerState = useSelector(customerLoadState);
  const queryCustomerError = useSelector(getCustomerFailedMsg);
  const [currentStep, setCurrentStep] = useState(OPEN_ACCOUNT_STEP.VIEW_TERMS);
  const [showCustomerInfoBottom, setShowCustomerInfoBottom] = useState(false);
  const [showQueryCustomerErrorAlert, setShowQueryCustomerErrorAlert] = useState(false);

  const {
    prdt_c,
    product_ccy,
    ntfct_intrt,
    dep_sjt_class,
    prdt_st_trm_unit_cnt,
    prdt_close_trm_unit_cnt,
    prdt_psb_trm_unit_c,
    lcl_prdt_nm,
  } = productInfo;

  //TODO: Move 11 to constant
  const homeAddress = customer?.r_CAME001_1Vo?.find(address => address.cus_adr_t === 11);
  const cus_adr_telno = homeAddress?.cus_adr_telno || '';

  const onSubmitAgreeTerms = () => {
    setShowCustomerInfoBottom(true);
  };

  const onConfirmCustomerInfo = () => {
    setShowCustomerInfoBottom(false);
    setCurrentStep(OPEN_ACCOUNT_STEP.ENTER_ACCOUNT_INFORMATION);
  };

  const onSubmitOpenAccountForm = () => {
    setCurrentStep(OPEN_ACCOUNT_STEP.COMPLETED);
  };

  useEffect(() => {
    if (showCustomerInfoBottom && !customer) {
      getCustomerInfoRequest();
    }
  }, [showCustomerInfoBottom]);

  useEffect(() => {
    debugger;
    if (queryCustomerError) {
      setShowQueryCustomerErrorAlert(true);
    }
  }, [queryCustomerError]);

  // useEffect(() => {
  //   if (customer) {
  //     //TODO: Move 11 to constant
  //     const homeAddress = customer.r_CAME001_1Vo?.find(address => address.cus_adr_t === 11);
  //     customer.cus_adr_telno = homeAddress?.cus_adr_telno || '';
  //   }
  // }, [customer]);

  return (
    <div className="open-account__wrapper">
      {loadingCustomerState && <Spinner />}
      {currentStep === OPEN_ACCOUNT_STEP.VIEW_TERMS && (
        <TermAndConditions
          product={productInfo}
          onSubmit={onSubmitAgreeTerms}
        />
      )}
      {showCustomerInfoBottom && customer && (
        <CustomerInfoBottom
          customerInfo={{ ...customer, cus_adr_telno }}
          onClose={() => setShowCustomerInfoBottom(false)}
          onClickConfirm={onConfirmCustomerInfo}
        />
      )}
      {currentStep === OPEN_ACCOUNT_STEP.ENTER_ACCOUNT_INFORMATION && (
        <EnterAccountInformation
          onSubmit={onSubmitOpenAccountForm}
          interestRate={ntfct_intrt}
        />
      )}
      {currentStep === OPEN_ACCOUNT_STEP.COMPLETED && <OpenAccountSuccessful openAccountInfo={openAccountInfo} />}
    </div>
    //TODO: Show Alert Query Customer Error
  );
};

export default withHTMLParseI18n(OpenAccount);
