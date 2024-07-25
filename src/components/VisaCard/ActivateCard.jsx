import ToastIcon from '@assets/icons/ToastIcon';
import Alert from '@common/ui/components/atomic/Alert/Alert';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import Input from '@common/ui/components/atomic/Input/Input';
import Span from '@common/ui/components/atomic/Span';
import Toast from '@common/ui/components/atomic/Toast';
import Header from '@common/ui/components/Header';
import { MENU_CODE } from '@configs/global/constants';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { apiCall } from '@shared/api';
import { alertMove } from '@utilities/alertMove';
import { formatDateExpiry, getCurrentDate, getCurrentTime } from '@utilities/dateTimeUtils';
import {
  clearHistory,
  hideCertificationNumber,
  moveBack,
  moveHome,
  scrollImpact,
  showCertificationNumber
} from '@utilities/index';
import { setIsNativeClickBack } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import { backEventSelector } from 'app/redux/selector';
import { APP_GLOBAL } from 'app/redux/type';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import activate_success from '../../assets/images/activate_success.png';
import DebitCardComplete from './components/DebitCardComplete';
import {
  getCardsRefresh,
  getCardsRequest,
  handleActivateCard,
  resetActivateCardStatus,
  setCardFocus
} from './redux/action';
import { debitCardReducer } from './redux/reducer';
import { debitCardSaga } from './redux/saga';
import { activateCardCfm, activateCardFailed, cardSelectedSelector } from './redux/selector';
import { debitCardsURLs, FeatureDebitCardName } from './redux/type';
import { replaceString } from '@utilities/debitCardUtils';

const ActivateCard = ({ translate }) => {
  useReducers([
    { key: FeatureDebitCardName, reducer: debitCardReducer },
    { key: APP_GLOBAL, reducer: appGlobalReducer }
  ]);
  useSagas([{ key: FeatureDebitCardName, saga: debitCardSaga }]);

  const isNativeBack = useSelector(backEventSelector || false);
  const cardPinCode = useRef(null);
  const cvcValue = useRef(null);
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);
  const [isToastCardPin, setIsToastCardPin] = useState(false);
  const activateCardRef = useRef(null);
  const reEnterTime = useRef(0);
  const [inputData, setInputData] = useState({
    card_number: '',
    valid_date: '',
    cvc: ''
  });
  const [inputDataAlready, setInputDataAlready] = useState(false);
  const activateCardStatus = useSelector(activateCardCfm);
  const cardSelected = useSelector(cardSelectedSelector) || {};
  const activateCardFailedStatus = useSelector(activateCardFailed) || '';

  useEffect(() => {
    if (inputData.valid_date !== '' && inputData.cvc !== '') {
      setInputDataAlready(true);
    }
  }, [inputData]);

  const handleEnterValidDate = e => {
    setInputData({ ...inputData, valid_date: e.target.value });
  };

  useEffect(() => {
    if (isNativeBack) {
      handleGoBack();
    }
    return () => setIsNativeClickBack(false);
  }, [isNativeBack]);

  const refreshCardList = async () => {
    const { data } = await apiCall(debitCardsURLs.GET_CARDS, 'POST', {});
    if (data && data.elData) {
      getCardsRefresh(data.elData);
    }
  };

  const handleEnterCVC = () => {
    showCertificationNumber(
      {
        title: translate('lbl_com_3241'),
        description: translate('lbl_com_3242'),
        maxLength: 3,
        errMsg: ''
      },
      handleEnterCVCSuccess
    );
  };

  const handleEnterCVCSuccess = cvc_value => {
    cvcValue.current = cvc_value;
    setInputData({ ...inputData, cvc: cvc_value.slice(0, 3) });
    hideCertificationNumber();
  };

  const handleButtonActivateClick = () => {
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
      handleEnterFirstPinSuccess
    );
  };

  const handleEnterFirstPinSuccess = pinCode => {
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
      handlePinMatched
    );
  };

  // use uniqueValue to compare encrypted pin code
  const handlePinMatched = pinCode => {
    if (pinCode.uniqueValue === cardPinCode.current) {
      cardPinCode.e2e = pinCode.e2e;
      const reqData = {
        trx_func_d: '1',
        card_no: cardSelected?.card_no,
        ecr_pin: cardPinCode.e2e,
        ecr_cvc_v: cvcValue.current,
        vldt_y4mm: inputData.valid_date.toString().replace('/', ''),
        filler0020: cardSelected?.filler0020
      };
      handleActivateCard(reqData);
      hideCertificationNumber();
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
        handlePinMatched
      );
    } else {
      reEnterTime.current = 0;
      setIsToastCardPin(true);
      hideCertificationNumber();
    }
  };

  const handleGoBack = () => {
    moveBack();
    setCardFocus(cardSelected?.card_no);
  };

  return (
    <div
      className="activate"
      ref={activateCardRef}
      onScroll={() => scrollImpact(activateCardRef.current, setIsHeaderExpand)}
    >
      <section className="toast__overlay">
        <Toast
          isShowToast={isToastCardPin}
          iconStatus={<ToastIcon />}
          onClose={() => setIsToastCardPin(false)}
          message={'Due to entering the wrong PIN 3 times, PIN has been reset.'}
        />
      </section>
      <Header title={translate('mymen_KHCD800006')} isExpand={isHeaderExpand} onClick={handleGoBack} />
      <div className="activate_wrapper">
        <section className="activate_top">
          <Span clazz="activate_title" text="Debit Card (Classic)" />
        </section>

        <section className="activate_content">
          <Input
            className="activate_input"
            label="Card number"
            disabled={true}
            value={replaceString(cardSelected?.card_no_display, '-', ' ')}
          />
          <section className="white__bg">
            <Input
              className="activate_input"
              label={translate('lbl_BCD8000000_0050')}
              inputMode="numeric"
              placeHolder={translate('lbl_BCD8000000_0051')}
              onKeyUp={formatDateExpiry}
              onChange={handleEnterValidDate}
              maxLength={5}
              ignoreInitShow={true}
              readOnly={false}
            />
          </section>
          <section className="activate_input_cvc white__bg" onClick={handleEnterCVC}>
            <Input
              type="password"
              inputMode="numeric"
              className="activate_input"
              value={inputData.cvc}
              label={translate('lbl_BCD8000000_0011')}
              disabled={true}
              maxLength={3}
              completedMode={inputData.cvc.length > 0}
              ignoreInitShow={true}
            />
          </section>
        </section>
      </div>
      <section className="activate_bottom">
        <Button
          className="activate_button"
          label={translate('lbl_cta_3045')}
          disable={!inputDataAlready}
          onClick={handleButtonActivateClick}
        />
      </section>
      {/* API call failed */}
      <Alert
        isCloseButton={false}
        isShowAlert={activateCardFailedStatus?.resMsg}
        subtitle={activateCardFailedStatus?.resMsg}
        alertType={activateCardFailedStatus?.resMsgVo?.msgType}
        firstButton={{
          onClick: () => {
            resetActivateCardStatus();
            alertMove(activateCardFailedStatus?.resMsgVo?.msgId);
          },
          label: translate('lbl_cta_3006')
        }}
      />
      {/* When click activate but info invalid : show Alert 'The information entered is not valid.' */}
      <Alert
        isCloseButton={false}
        isShowAlert={activateCardStatus?.result_yn === 9}
        title={translate('lbl_BCD8000000_0052')}
        alertType={'I'}
        firstButton={{ onClick: resetActivateCardStatus, label: translate('lbl_cta_3006') }}
      />
      {/* Activate successfully : show completed page.' */}
      {activateCardStatus?.result_yn === 1 && (
        <DebitCardComplete
          dateComplete={`${getCurrentDate('DD.MM.YYYY')} ${getCurrentTime('HH:MM:SS')}`}
          cardName={cardSelected?.card_nm}
          actionText={{
            text: translate('lbl_BCD8000000_0036'),
            position: 'right'
          }}
          completeThumbnail={activate_success}
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
              action: async () => {
                await refreshCardList();
                clearHistory(MENU_CODE.CARDS);
                resetActivateCardStatus();
                setTimeout(() => {
                  setCardFocus(cardSelected?.card_no);
                }, 500);
              }
            },
            secondButton: {
              label: translate('lbl_cta_3241'),
              action: () => {
                resetActivateCardStatus();
                moveHome();
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default withHTMLParseI18n(ActivateCard);
