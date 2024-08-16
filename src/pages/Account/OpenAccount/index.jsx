import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { moveBack } from '@utilities/index';
import TermAndConditions from './components/TermAndConditions';
import { useState } from 'react';
import { customerInfo, OPEN_ACCOUNT_STEP } from './constants';
import CustomerInfoBottom from './components/CustomerInfoBottom';

const OpenAccount = ({translation}) => {
  const [currentStep, setCurrentStep] = useState(OPEN_ACCOUNT_STEP.VIEW_TERMS);
  const onSubmitAgreeTerms = () => {
    setCurrentStep(OPEN_ACCOUNT_STEP.CUSTOMER_INFO);
  };

  return (
    <div className="open-account__wrapper">
      {currentStep === OPEN_ACCOUNT_STEP.VIEW_TERMS &&
        <TermAndConditions onSubmit={onSubmitAgreeTerms} />
      }
      {currentStep === OPEN_ACCOUNT_STEP.CUSTOMER_INFO && 
        <CustomerInfoBottom customerInfo={customerInfo} /> 
      }
    </div>
  );
};

export default withHTMLParseI18n(OpenAccount);