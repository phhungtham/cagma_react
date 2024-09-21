import { useState } from 'react';

import Spinner from '@common/components/atoms/Spinner';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import AddNewCardSuccess from './components/AddNewCardSuccess';
import EnterNewCardInfo from './components/EnterNewCardInfo';
import TermsAndConditions from './components/TermsAndConditions';
import { ADD_NEW_CARD_STEP } from './constants';

const AddNewCard = ({ translation }) => {
  const [currentStep, setCurrentStep] = useState(ADD_NEW_CARD_STEP.TERMS_CONDITIONS);
  const [addCardSuccessInfo, setAddCardSuccessInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);

  const onSubmitAgreeTerms = () => {
    setCurrentStep(ADD_NEW_CARD_STEP.ENTER_INFORMATION);
  };

  const handleSubmitAddNewCard = values => {
    setAddCardSuccessInfo({
      streetNumber: '123',
      streetName: 'Young ST',
      aptNumber: '123',
      city: 'Toronto',
      province: 'On-ontrairo',
      postalCode: 'A9A9A9',
      issueDate: 'Jun 09, 2024',
      accountNo: '700 000 000000',
    });
    setCurrentStep(ADD_NEW_CARD_STEP.COMPLETED);
  };

  return (
    <>
      <div className="add-new-card__wrapper page__wrapper">
        {showLoading && <Spinner />}
        {currentStep === ADD_NEW_CARD_STEP.TERMS_CONDITIONS && <TermsAndConditions onSubmit={onSubmitAgreeTerms} />}

        {currentStep === ADD_NEW_CARD_STEP.ENTER_INFORMATION && <EnterNewCardInfo onSubmit={handleSubmitAddNewCard} />}
        {currentStep === ADD_NEW_CARD_STEP.COMPLETED && <AddNewCardSuccess cardInfo={addCardSuccessInfo} />}
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
