import { useState } from 'react';

import Spinner from '@common/components/atoms/Spinner';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import TermsAndConditions from './components/TermsAndConditions';
import { ADD_NEW_CARD_STEP } from './constants';
import './styles.scss';

const AddNewCard = ({ translation }) => {
  const [currentStep, setCurrentStep] = useState(ADD_NEW_CARD_STEP.TERMS_CONDITIONS);
  const [showLoading, setShowLoading] = useState(false);

  const onSubmitAgreeTerms = () => {
    setCurrentStep(ADD_NEW_CARD_STEP.ENTER_INFORMATION);
  };

  return (
    <>
      <div className="add-new-card__wrapper">
        {showLoading && <Spinner />}
        {currentStep === ADD_NEW_CARD_STEP.TERMS_CONDITIONS && <TermsAndConditions onSubmit={onSubmitAgreeTerms} />}

        {/* {currentStep === OPEN_ACCOUNT_STEP.ENTER_ACCOUNT_INFORMATION && (
          <EnterAccountInformation
            onSubmit={onSubmitOpenAccountForm}
            interestRate={ntfct_intrt}
            productName={lcl_prdt_nm}
          />
        )}
        {currentStep === OPEN_ACCOUNT_STEP.COMPLETED && (
          <OpenAccountSuccessful openAccountInfo={openAccountSuccessInfo} />
        )} */}
      </div>
      {/* <Alert
        isCloseButton={false}
        isShowAlert={showAlert.isShow}
        title={showAlert.title}
        subtitle={showAlert.content}
        textAlign="left"
        firstButton={{
          onClick: () => setShowAlert({ isShow: false, title: '', content: '' }),
          label: 'Confirm',
        }}
      /> */}
    </>
  );
};

export default withHTMLParseI18n(AddNewCard);
