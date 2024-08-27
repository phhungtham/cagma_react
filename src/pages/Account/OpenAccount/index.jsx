import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import { getCustomerInfoRequest } from '../redux/customer/action';
import { customerReducer } from '../redux/customer/reducer';
import { customerSaga } from '../redux/customer/saga';
import { customerInfo } from '../redux/customer/selector';
import { FeatureName } from '../redux/customer/type';
import CustomerInfoBottom from './components/CustomerInfoBottom';
import EnterAccountInformation from './components/EnterAccountInformation';
import OpenAccountSuccessful from './components/OpenAccountSuccessful';
import TermAndConditions from './components/TermAndConditions';
import { OPEN_ACCOUNT_STEP, openAccountInfo } from './constants';

const ntfct_intrt = 0.07;

const OpenAccount = ({ translation }) => {
  useReducers([{ key: FeatureName, reducer: customerReducer }]);
  useSagas([{ key: FeatureName, saga: customerSaga }]);

  // const { status } = useHttpStatus(ActionType.GET_CUSTOMER_REQUEST);
  const customer = useSelector(customerInfo);

  const [currentStep, setCurrentStep] = useState(OPEN_ACCOUNT_STEP.VIEW_TERMS);
  const [showCustomerInfoBottom, setShowCustomerInfoBottom] = useState(false);

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

  // useEffect(() => {
  //   if (customer) {
  //     //TODO: Move 11 to constant
  //     const homeAddress = customer.r_CAME001_1Vo?.find(address => address.cus_adr_t === 11);
  //     customer.cus_adr_telno = homeAddress?.cus_adr_telno || '';
  //   }
  // }, [customer]);

  return (
    <div className="open-account__wrapper">
      {/* {status === Http.REQUESTING && <Spinner />} */}
      {currentStep === OPEN_ACCOUNT_STEP.VIEW_TERMS && <TermAndConditions onSubmit={onSubmitAgreeTerms} />}
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
  );
};

export default withHTMLParseI18n(OpenAccount);
