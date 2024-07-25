import ToastIcon from '@assets/icons/ToastIcon';
import shooCoImg from '@assets/images/shoo_check_f.png';
import Alert from '@common/ui/components/atomic/Alert/Alert';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import ShortCard from '@common/ui/components/atomic/CardGroup/ShortCard/ShortCard';
import Toast from '@common/ui/components/atomic/Toast';
import Header from '@common/ui/components/Header';
import { MENU_CODE } from '@configs/global/constants';
import useReducers from '@hooks/useReducers';
import { apiCall } from '@shared/api';
import reloadWebView from '@utilities/gmCommon/reloadWebView';
import {
  authActivationAccountPassword,
  clearHistory,
  hideCertificationNumber,
  moveBack,
  moveHome,
  showCertificationNumber
} from '@utilities/index';
import { setIsNativeClickBack } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import { backEventSelector } from 'app/redux/selector';
import { APP_GLOBAL } from 'app/redux/type';
import { VerticalCardIcon } from 'assets/icons';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import DebitCardComplete from './components/DebitCardComplete';
import { setCardFocus } from './redux/action';
import { debitCardReducer } from './redux/reducer';
import { cardSelectedSelector } from './redux/selector';
import { debitCardsURLs, FeatureDebitCardName } from './redux/type';

const ManageCardPin = ({ translate }) => {
  useReducers([
    { key: FeatureDebitCardName, reducer: debitCardReducer },
    { key: APP_GLOBAL, reducer: appGlobalReducer }
  ]);

  const isNativeBack = useSelector(backEventSelector || false);
  const cardPinCode = useRef(null);
  const cardSelected = useSelector(cardSelectedSelector) || {};
  const [isShowCompleted, setIsShowCompleted] = useState(false);
  const [isToastCardPin, setIsToastCardPin] = useState(false);
  const [dateTimeCompleted, setDateTimeCompleted] = useState('');
  const reEnterTime = useRef(0);

  const [errMsg, setErrMsg] = useState({
    isError: false,
    errMsg: null
  });
  const [isShowAlert, setIsShowAlert] = useState(false);
  const handleShowKeyPad = () => {
    authActivationAccountPassword(handleAuthSuccess);
  };

  const handleAuthSuccess = () => {
    reEnterTime.current = 0;
    showCertificationNumber(
      {
        title: translate('lbl_com_3174'),
        description: translate('lbl_com_3120'),
        maxLength: 6,
        errMsg: '',
        showUnique: 'true',
        checkNumber: 'true'
      },
      handleCreateCardPinSuccess
    );
  };
  const handleCreateCardPinSuccess = pinCode => {
    cardPinCode.current = pinCode.uniqueValue;
    showCertificationNumber(
      {
        title: translate('lbl_com_3178'),
        description: translate('lbl_com_3179'),
        maxLength: 6,
        errMsg: '',
        showUnique: 'true',
        checkNumber: 'true'
      },
      handleCardPinMatched
    );
  };

  const handleCardPinMatched = pinCode => {
    if (pinCode.uniqueValue === cardPinCode.current) {
      cardPinCode.e2e = pinCode.e2e;
      handleCallManagePin();
    } else {
      handleFailCheckPin();
    }
  };

  const handleFailCheckPin = () => {
    if (reEnterTime.current < 2) {
      reEnterTime.current += 1;
      showCertificationNumber(
        {
          title: translate('lbl_com_3178'),
          description: translate('lbl_com_3179'),
          maxLength: 6,
          errMsg: translate('lbl_com_3149').replace('%1', reEnterTime.current),
          showUnique: 'true',
          checkNumber: 'true'
        },
        handleCardPinMatched
      );
    } else {
      reEnterTime.current = 0;
      setIsToastCardPin(true);
      hideCertificationNumber();
    }
  };

  const handleCallManagePin = async () => {
    const paramData = {
      trx_func_d: '2',
      card_no: cardSelected.card_no,
      chgbef_ecr_pin: cardPinCode.e2e,
      ecr_pin: cardPinCode.e2e,
      filler0020: cardSelected.filler0020
    };
    const changePassRes = await apiCall(debitCardsURLs.MANAGE_CARD_PIN, 'POST', paramData);

    if (changePassRes && changePassRes?.data?.elData) {
      setIsShowCompleted(true);
      setErrMsg({ ...errMsg, isError: false, errMsg: null });
      setDateTimeCompleted(changePassRes?.data?.elData?.transaction_complete_time);
    } else {
      setErrMsg({ ...errMsg, isError: true, errMsg: changePassRes?.data?.elHeader?.resMsgVo });
    }
    hideCertificationNumber();
  };
  const backToCard = () => {
    setErrMsg({ ...errMsg, isError: false, errMsg: null });
  };

  const handleGoBack = () => {
    moveBack();
    setCardFocus(cardSelected?.card_no);
  };

  useEffect(() => {
    if (isNativeBack) {
      handleGoBack();
    }
    return () => setIsNativeClickBack(false);
  }, [isNativeBack]);

  return (
    <>
      {isShowCompleted && (
        <DebitCardComplete
          completeThumbnail={shooCoImg}
          cardName={translate('lbl_BCD8000000_0028')}
          actionText={{ text: translate('lbl_BCD8000000_0029'), position: 'right' }}
          dateComplete={dateTimeCompleted}
          dataTable={[
            {
              title: translate('lbl_BCD8000000_0030'),
              value: [cardSelected?.card_nm]
            },
            {
              title: translate('lbl_BCD8000000_0021'),
              value: [cardSelected?.card_no_display]
            },
            {
              title: translate('lbl_BCD8000000_0031'),
              value: [cardSelected?.card_acno_display || '']
            }
          ]}
          duoButton={{
            firstButton: {
              label: translate('lbl_cta_3038'),
              action: () => {
                setIsShowCompleted(false);
                clearHistory(MENU_CODE.CARDS);
                setTimeout(() => {
                  setCardFocus(cardSelected?.card_no);
                }, 500);
              }
            },
            secondButton: {
              label: translate('lbl_cta_3241'),
              action: () => {
                setIsShowCompleted(false);
                moveHome();
              }
            }
          }}
        />
      )}
      <Alert
        isCloseButton={false}
        isShowAlert={errMsg.errMsg}
        subtitle={errMsg.errMsg?.msgText}
        alertType={errMsg.errMsg?.msgType}
        firstButton={{ onClick: backToCard, label: 'Back' }}
      />
      <div className="manage-card-pin">
        <section className="toast__overlay">
          <Toast
            isShowToast={isToastCardPin}
            iconStatus={<ToastIcon />}
            onClose={() => setIsToastCardPin(false)}
            message={'Due to entering the wrong PIN 3 times, PIN has been reset.'}
          />
        </section>
        <section className="top__wrapper">
          <Header title={translate('men_KHCD800003')} onClick={handleGoBack} />
          <section className="card__wrapper">
            <ShortCard
              title={cardSelected && cardSelected.card_nm}
              subTitle={cardSelected && cardSelected.card_no}
              icon={<VerticalCardIcon />}
            />
            <div className="horizontal__line" />
          </section>
          <section className="description__wrapper">
            <span className="title">{translate('lbl_BCD8000000_0024')}</span>
            <span className="content">
              <p>{translate('lbl_BCD8000000_0025')}</p>
              <p>{translate('lbl_BCD8000000_0026')}</p>
              <p>{translate('lbl_BCD8000000_0027')}</p>
            </span>
          </section>
        </section>
        <section className="button__wrapper">
          <Button onClick={handleShowKeyPad} label={translate('lbl_cta_3001')} />
        </section>
      </div>
    </>
  );
};

export default withHTMLParseI18n(ManageCardPin);
