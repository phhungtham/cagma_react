import { useState } from 'react';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import enterSecurityPasscode from '@utilities/gmSecure/enterSecurityPasscode';
import { loginSelector } from 'app/redux/selector';

import { formatCardDateRequest } from '../utils/format';
import ActiveCardSuccess from './components/ActiveCardSuccess';
import CardActiveBlockedBottom from './components/CardActiveBlockedBottom';
import EnterAccountInfo from './components/EnterAccountInfo';
import EnterActiveCardInfo from './components/EnterActiveCardInfo';
import { ACTIVE_CARD_STEP } from './constants';
import './styles.scss';

const maxEnterIncorrectNumber = 5;

const ActiveCard = () => {
  const [currentStep, setCurrentStep] = useState(ACTIVE_CARD_STEP.ENTER_CARD_INFORMATION);
  const [showIncorrectInfoAlert, setShowIncorrectInfoAlert] = useState(false);
  const [showActiveBlockAlert, setShowActiveBlockAlert] = useState(false);
  const [incorrectInfoNumber, setIncorrectInfoNumber] = useState(0);
  const [activeCardSuccessInfo, setActiveCardSuccessInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const isLogin = useSelector(loginSelector) || true;
  const { requestApi } = useApi();

  const handleSubmitActiveCard = async values => {
    if (incorrectInfoNumber >= maxEnterIncorrectNumber) {
      setShowActiveBlockAlert(true);
      return;
    }
    setShowLoading(true);
    const { name, cardNumber, expiryDate } = values;
    const cashcd_vldt_dt = formatCardDateRequest(expiryDate);
    const formattedCardNumber = cardNumber.replace(/\D/g, '');
    const payload = {
      cusnm: name,
      cashcd_vldt_dt,
      cashcd_no: formattedCardNumber,
      dep_trx_dtl_d: '01',
      dbcd_iss_rsn_c: '',
    };
    const { data, error, isSuccess } = await requestApi(endpoints.cardVerificationStep1, payload);
    setShowLoading(false);
    if (isSuccess) {
      enterSecurityPasscode();
    } else {
      // setAlert({
      //   isShow: true,
      //   content: error,
      // });
      //TODO: Check error code do detect error is input wrong information or other error
      const incorrectNumber = incorrectInfoNumber + 1;
      setIncorrectInfoNumber(incorrectNumber);
      if (incorrectNumber >= maxEnterIncorrectNumber) {
        setShowActiveBlockAlert(true);
      } else {
        setShowIncorrectInfoAlert(true);
      }
    }
  };

  const handleCloseAlert = () => {
    setAlert({
      isShow: false,
      title: '',
      content: '',
    });
  };

  const handleSubmitAccountForm = values => {
    setActiveCardSuccessInfo({
      cardName: 'Visa Consumer Classic Access Card',
      cardNo: '1234********1234',
      accountNumber: '700 000 987654',
    });
    setCurrentStep(ACTIVE_CARD_STEP.COMPLETED);
  };

  return (
    <>
      <div className="active-card__wrapper">
        {showLoading && <Spinner />}
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
        textAlign="center"
        onClose={() => setShowIncorrectInfoAlert(false)}
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
      {showActiveBlockAlert && <CardActiveBlockedBottom onClose={() => setShowActiveBlockAlert(false)} />}
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        textAlign="left"
        onClose={handleCloseAlert}
        firstButton={{
          onClick: handleCloseAlert,
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default ActiveCard;
