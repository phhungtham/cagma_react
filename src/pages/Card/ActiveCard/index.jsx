import { useState } from 'react';
import { useSelector } from 'react-redux';

import { FillChatIcon, FillPhoneIcon } from '@assets/icons';
import BranchInfoIcon from '@assets/images/icon-fill-atm-24.png';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import Alert from '@common/components/molecules/Alert';
import { SupportContactPhoneNumber } from '@common/constants/common';
import { externalUrls } from '@common/constants/url';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { callPhone } from '@utilities/index';
import { loginSelector } from 'app/redux/selector';

import ActiveCardSuccess from './components/ActiveCardSuccess';
import EnterAccountInfo from './components/EnterAccountInfo';
import EnterActiveCardInfo from './components/EnterActiveCardInfo';
import { ACTIVE_CARD_STEP } from './constants';

const maxEnterIncorrectNumber = 5;

const ActiveCard = () => {
  const [currentStep, setCurrentStep] = useState(ACTIVE_CARD_STEP.ENTER_CARD_INFORMATION);
  const [showIncorrectInfoAlert, setShowIncorrectInfoAlert] = useState(false);
  const [showActiveBlockAlert, setShowActiveBlockAlert] = useState(false);
  const [incorrectInfoNumber, setIncorrectInfoNumber] = useState(0);
  const [activeCardSuccessInfo, setActiveCardSuccessInfo] = useState();
  const isLogin = useSelector(loginSelector);

  const handleSubmitActiveCard = values => {
    //TODO: Open Security passcode bottom sheet
    const incorrectNumber = incorrectInfoNumber + 1;
    if (incorrectNumber >= maxEnterIncorrectNumber) {
      setShowActiveBlockAlert(true);
    } else {
      setIncorrectInfoNumber(incorrectNumber);
      setShowIncorrectInfoAlert(true);
    }
  };

  const handleSubmitAccountForm = values => {
    setActiveCardSuccessInfo({
      cardName: 'Visa Consumer Classic Access Card',
      cardNo: '1234********1234',
      accountNumber: '700 000 987654',
    });
    setCurrentStep(ACTIVE_CARD_STEP.COMPLETED);
  };

  const onClickCallPhone = () => {
    callPhone(SupportContactPhoneNumber);
  };

  const handleNavigateBranchInfo = () => {
    openURLInBrowser(externalUrls.branchInfo);
  };

  const handleNavigateContactUs = () => {
    openURLInBrowser(externalUrls.contactUs);
  };

  const handleNavigateHome = () => {
    setShowActiveBlockAlert(false);
    // moveHome();
    if (isLogin) {
      setActiveCardSuccessInfo({
        cardName: 'Visa Consumer Classic Access Card',
        cardNo: '1234********1234',
        accountNumber: '700 000 987654',
      });
      setCurrentStep(ACTIVE_CARD_STEP.COMPLETED);
    } else {
      setCurrentStep(ACTIVE_CARD_STEP.ENTER_ACCOUNT_INFORMATION);
    }
  };

  return (
    <>
      <div className="active-card__wrapper">
        {currentStep === ACTIVE_CARD_STEP.ENTER_CARD_INFORMATION && (
          <EnterActiveCardInfo
            onSubmit={handleSubmitActiveCard}
            isLogin={isLogin}
          />
        )}
        {currentStep === ACTIVE_CARD_STEP.ENTER_ACCOUNT_INFORMATION && (
          <EnterAccountInfo onSubmit={handleSubmitAccountForm} />
        )}
        {currentStep === ACTIVE_CARD_STEP.COMPLETED && (
          <ActiveCardSuccess
            cardInfo={activeCardSuccessInfo}
            isLogin={isLogin}
          />
        )}
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={showIncorrectInfoAlert}
        title="Card information is incorrect"
        subtitle="If your card information is entered incorrectly 5 times, online activation will be blocked. Please try again."
        textAlign="left"
        firstButton={{
          onClick: () => setShowIncorrectInfoAlert(false),
          label: 'Confirm',
        }}
      >
        <div className="active-attempts">
          <div className="active-attempts__desc">Activation attempts</div>
          <div className="active-attempts__number">
            <span className="text-error">{incorrectInfoNumber}</span>
            <span>/{maxEnterIncorrectNumber}</span>
          </div>
        </div>
      </Alert>
      <Alert
        isCloseButton
        isShowAlert={showActiveBlockAlert}
        title="Online Activation is blocked"
        subtitle="You have entered the card information incorrectly 5 times, and online activation is now blocked. Please contact your branch for assistance."
        textAlign="center"
        firstButton={{
          onClick: handleNavigateHome,
          label: 'Home',
        }}
      >
        <div className="active-block__info">
          <div className="divider__item__solid" />
          <div className="active-block__ctas">
            <div className="active-block__button">
              <IconButton
                size="lg"
                type="circle"
                label="Call"
                className="call__icon"
                icon={<FillPhoneIcon />}
                onClick={onClickCallPhone}
              />
            </div>
            <div className="active-block__button">
              <IconButton
                size="lg"
                type="circle"
                label="Branch Info"
                icon={<img src={BranchInfoIcon} />}
                onClick={handleNavigateBranchInfo}
              />
            </div>
            <div className="active-block__button">
              <IconButton
                size="lg"
                type="circle"
                label="Contact us"
                className="chat__icon"
                icon={<FillChatIcon />}
                onClick={handleNavigateContactUs}
              />
            </div>
          </div>
        </div>
      </Alert>
    </>
  );
};

export default ActiveCard;
