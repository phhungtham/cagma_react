import { useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, activeCardLabels as labels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useLoginInfo from '@hooks/useLoginInfo';
import authSecurityMedia from '@utilities/gmSecure/authSecurityMedia';
import { moveHome } from '@utilities/index';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import { formatCardDateRequest } from '../utils/format';
import ActiveCardSuccess from './components/ActiveCardSuccess';
import EnterAccountInfo from './components/EnterAccountInfo';
import EnterActiveCardInfo from './components/EnterActiveCardInfo';
import { ACTIVE_CARD_STEP } from './constants';
import './styles.scss';

const maxEnterIncorrectNumber = 5;

const ActiveCard = ({ translate: t }) => {
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
  const { isLogin } = useLoginInfo();

  const { requestApi } = useApi();

  const requestActiveCardLogged = async payload => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.activeCardLogged, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { cashcd_no_display: cardNo, cashcd_acno1_display: accountNumber, result_cd } = data;
      if (Number(result_cd) === 1) {
        setActiveCardSuccessInfo({
          cardNo,
          accountNumber,
        });
        setCurrentStep(ACTIVE_CARD_STEP.COMPLETED);
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestActiveCardNotLogged = async payload => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.activeCardNotLogged, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { cashcd_no_display: cardNo, cashcd_acno1_display: accountNumber, result_cd } = data;
      if (Number(result_cd) === 1) {
        setActiveCardSuccessInfo({
          cardNo,
          accountNumber,
        });
        setCurrentStep(ACTIVE_CARD_STEP.COMPLETED);
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

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
    const { error, isSuccess } = await requestApi(endpoints.cardVerificationStep1, payload);
    setShowLoading(false);
    if (isSuccess) {
      if (isLogin) {
        const activeCardLoggedPayload = {
          cashcd_vldt_dt,
          cashcd_no: formattedCardNumber,
          cus_name: name,
        };
        authSecurityMedia(() => requestActiveCardLogged(activeCardLoggedPayload));
      } else {
        setCurrentStep(ACTIVE_CARD_STEP.ENTER_ACCOUNT_INFORMATION);
      }
    } else {
      if (isLogin) {
        const incorrectNumber = incorrectInfoNumber + 1;
        setIncorrectInfoNumber(incorrectNumber);
        if (incorrectNumber >= maxEnterIncorrectNumber) {
          setShowActiveBlockAlert(true);
        } else {
          setShowIncorrectInfoAlert(true);
        }
      } else {
        setAlert({
          isShow: true,
          content: error,
        });
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

  const handleSubmitAccountForm = async values => {
    setShowLoading(true);
    const { dob, email, lastSixAccountNumber, phoneNumber, postalCode } = values;
    const payload = {
      cus_bth_y4mm_dt: dob,
      adr_zipc: postalCode,
      cashcd_acno1: lastSixAccountNumber,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.cardVerificationStep2, payload);
    setShowLoading(false);
    if (isSuccess) {
      if (Number(data?.result_cd) === 1) {
        requestActiveCardNotLogged({
          cus_email: email,
          cell_telno: phoneNumber,
        });
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  return (
    <>
      <div className="active-card__wrapper">
        {showLoading && <Spinner />}
        {currentStep === ACTIVE_CARD_STEP.ENTER_CARD_INFORMATION && (
          <EnterActiveCardInfo
            onSubmit={handleSubmitActiveCard}
            isLogin={isLogin}
            translate={t}
          />
        )}
        {currentStep === ACTIVE_CARD_STEP.ENTER_ACCOUNT_INFORMATION && (
          //TODO: Add labels
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
        title={t(labels.cardInfoIncorrect)}
        subtitle={t(labels.incorrectMaxTimes)}
        textAlign="center"
        onClose={() => setShowIncorrectInfoAlert(false)}
        firstButton={{
          onClick: () => setShowIncorrectInfoAlert(false),
          label: t(ctaLabels.confirm),
        }}
      >
        <div className="active-attempts">
          <div className="active-attempts__desc">{t(labels.activationAttempts)}</div>
          <div className="active-attempts__number">
            <span className="text-error">{incorrectInfoNumber}</span>
            <span>/{maxEnterIncorrectNumber}</span>
          </div>
        </div>
      </Alert>
      <Alert
        isCloseButton={false}
        isShowAlert={showActiveBlockAlert}
        title={t(labels.cardInfoIncorrect)}
        subtitle={t(labels.incorrectBlocked)}
        textAlign="center"
        onClose={() => setShowActiveBlockAlert(false)}
        firstButton={{
          onClick: moveHome,
          label: t(ctaLabels.home),
        }}
      />
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        textAlign="left"
        onClose={handleCloseAlert}
        firstButton={{
          onClick: handleCloseAlert,
          label: t(ctaLabels.confirm),
        }}
      />
    </>
  );
};

export default withHTMLParseI18n(ActiveCard);
