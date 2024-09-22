import { useState } from 'react';
import { useSelector } from 'react-redux';

import { loginSelector } from 'app/redux/selector';

import EnterReissueAddressInfo from './components/EnterReissueAddressInfo';
import EnterReissueCardInfo from './components/EnterReissueCardInfo';
import ReissueCardSuccess from './components/ReissueCardSuccess';
import { REISSUE_CARD_STEP } from './constants';

const ReissueCard = () => {
  const [currentStep, setCurrentStep] = useState(REISSUE_CARD_STEP.ENTER_CARD_INFORMATION);
  const [cardInfo, setCardInfo] = useState({});
  const [reissueCardSuccessInfo, setReissueCardSuccessInfo] = useState();
  const isLogin = useSelector(loginSelector);

  const handleSubmitCardInfo = values => {
    if (isLogin) {
      setCardInfo({
        cardNumber: '5021 3000 0000 0000',
        primaryAcNo: '700 000 00000',
        secondAcNo: '-',
        contactlessTransaction: 'NO',
        dailyWithdrawalLimit: '$5,000.00',
        dailyPOSLimit: '$5,000.00',
        issueDate: 'Jan 01, 2024',
        expireDate: '03/25',
      });
    }

    setCurrentStep(REISSUE_CARD_STEP.ENTER_ADDRESS_INFORMATION);
  };

  const handleSubmitAddressInfo = values => {
    setReissueCardSuccessInfo({
      streetNumber: '123',
      streetName: 'Young ST',
      aptNumber: '123',
      city: 'Toronto',
      province: 'On-ontrairo',
      postalCode: 'A9A9A9',
      issueDate: 'Jun 09, 2024',
    });
    setCurrentStep(REISSUE_CARD_STEP.COMPLETED);
  };

  return (
    <>
      <div className="reissue-card__wrapper page__wrapper">
        {currentStep === REISSUE_CARD_STEP.ENTER_CARD_INFORMATION && (
          <EnterReissueCardInfo
            onSubmit={handleSubmitCardInfo}
            isLogin={isLogin}
          />
        )}
        {currentStep === REISSUE_CARD_STEP.ENTER_ADDRESS_INFORMATION && (
          <EnterReissueAddressInfo
            onSubmit={handleSubmitAddressInfo}
            cardInfo={cardInfo}
            isLogin={isLogin}
          />
        )}
        {currentStep === REISSUE_CARD_STEP.COMPLETED && (
          <ReissueCardSuccess
            cardInfo={reissueCardSuccessInfo}
            isLogin={isLogin}
          />
        )}
      </div>
    </>
  );
};

export default ReissueCard;
