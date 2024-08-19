import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { moveBack } from '@utilities/index';
import TermAndConditions from './components/TermAndConditions';
import { useState } from 'react';
import { customerInfo, OPEN_ACCOUNT_STEP } from './constants';
import CustomerInfoBottom from './components/CustomerInfoBottom';
import EnterAccountInformation from './components/EnterAccountInformation';
import OpenAccountSuccessful from './components/OpenAccountSuccessful';

const OpenAccount = ({translation}) => {
  const [currentStep, setCurrentStep] = useState(OPEN_ACCOUNT_STEP.VIEW_TERMS);
  const onSubmitAgreeTerms = () => {
    setCurrentStep(OPEN_ACCOUNT_STEP.CUSTOMER_INFO);
  };

  const onConfirmCustomerInfo = () => {
    setCurrentStep(OPEN_ACCOUNT_STEP.ENTER_ACCOUNT_INFORMATION);
  };

  const onSubmitOpenAccountForm = () => {
    setCurrentStep(OPEN_ACCOUNT_STEP.COMPLETED);
  };

  return (
    <div className="open-account__wrapper">
      {currentStep === OPEN_ACCOUNT_STEP.VIEW_TERMS &&
        <TermAndConditions onSubmit={onSubmitAgreeTerms} />
      }
      {currentStep === OPEN_ACCOUNT_STEP.CUSTOMER_INFO && 
        <CustomerInfoBottom customerInfo={customerInfo} onClickConfirm={onConfirmCustomerInfo} /> 
      }
      {currentStep === OPEN_ACCOUNT_STEP.ENTER_ACCOUNT_INFORMATION && 
        <EnterAccountInformation onSubmit={onSubmitOpenAccountForm}/> 
      }
      {currentStep === OPEN_ACCOUNT_STEP.COMPLETED && 
        <OpenAccountSuccessful /> 
      }
    </div>
  );
};

export default withHTMLParseI18n(OpenAccount);