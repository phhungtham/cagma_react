import character__notice from '@assets/images/character_notice1.png';
import Alert from '@common/ui/components/atomic/Alert/Alert';
import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import { DuoButton } from '@common/ui/components/atomic/ButtonGroup/DuoButton/DuoButton';
import InfoBox from '@common/ui/components/atomic/InfoBox';
import Input from '@common/ui/components/atomic/Input/Input';
import Spinner from '@common/ui/components/atomic/Spinner';
import DebitCardComplete from '@components/VisaCard/components/DebitCardComplete';
import { setCardFocus } from '@components/VisaCard/redux/action';
import { MENU_CODE } from '@configs/global/constants';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { apiCall } from '@shared/api';
import { addComma, CARD_LIMIT_DEF, checkDecimal, getCardType, removeComma } from '@utilities/debitCardUtils';
import { authActivationAccountPassword, clearHistory, moveHome } from '@utilities/index';
import { setIsNativeClickBack } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import { backEventSelector } from 'app/redux/selector';
import { APP_GLOBAL } from 'app/redux/type';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { debitCardReducer } from '../../components/VisaCard/redux/reducer';
import { debitCardSaga } from '../../components/VisaCard/redux/saga';
import { cardSelectedSelector, newCardTemplateSelector } from '../../components/VisaCard/redux/selector';
import { debitCardsURLs, FeatureDebitCardName } from '../../components/VisaCard/redux/type';

const DebitCardManageLimitBottom = props => {
  const {
    open,
    onClose,
    handleOnSave,
    onRefreshCard,
    isPurchase,
    isWithdrawal,
    isHandleApi = true,
    defaultLimitValue = {},
    translate
  } = props;

  useReducers([
    { key: FeatureDebitCardName, reducer: debitCardReducer },
    { key: APP_GLOBAL, reducer: appGlobalReducer }
  ]);
  useSagas([{ key: FeatureDebitCardName, saga: debitCardSaga }]);
  const isNativeBack = useSelector(backEventSelector || false);
  const cardSelected = useSelector(cardSelectedSelector) || {};
  const newCard = useSelector(newCardTemplateSelector) || {};
  const [inputData, setInputData] = useState({
    purchaseDay: '',
    purchaseTime: '',
    withdrawalDay: '',
    withdrawalTime: ''
  });

  const [isShowCompleted, setIsShowCompleted] = useState(false);

  const inputLabels = {
    purchaseDay: translate('lbl_BCD8000000_0038'), //'Purchase / Day',
    purchaseTime: translate('lbl_BCD8000000_0040'), //'Purchase / Time',
    withdrawalDay: translate('lbl_BCD8000000_0042'), //'Withdrawal / Day',
    withdrawalTime: translate('lbl_BCD8000000_0044') //'Withdrawal / Time'
  };
  const [inputErrMsg, setInputErrMsg] = useState({
    purchaseDay: '',
    purchaseTime: '',
    withdrawalDay: '',
    withdrawalTime: ''
  });

  const [inquiryData, setInquiryData] = useState({
    purchaseDay: '',
    purchaseTime: '',
    withdrawalDay: '',
    withdrawalTime: '',
    cardInfChgDt: '',
    cardInfChgTime: ''
  });

  const [resultData, setResultData] = useState({
    purchaseDay: '',
    purchaseTime: '',
    withdrawalDay: '',
    withdrawalTime: '',
    cardInfChgDt: '',
    cardInfChgTime: ''
  });

  const [completeData, setCompleteData] = useState([]);
  const [cardType, setCardType] = useState('');
  const [errMsg, setErrMsg] = useState({
    isError: false,
    errMsg: null
  });
  const [inputDataAlready, setInputDataAlready] = useState(false);
  const [readyOpen, setReadyOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getCurrentLimit();
      setCardType(getCardType(newCard?.newCardTemplate?.join_etpr_no));
    } else {
      setInitLimit();
    }
  }, [open]);

  // check is ready to save
  useEffect(() => {
    if (
      !(
        inputErrMsg.purchaseDay ||
        inputErrMsg.purchaseTime ||
        inputErrMsg.withdrawalDay ||
        inputErrMsg.withdrawalTime
      ) &&
      (!isPurchase ||
        (inputData.purchaseDay &&
          inputData.purchaseTime &&
          (!isWithdrawal || (inputData.withdrawalDay && inputData.withdrawalTime))))
    ) {
      setInputDataAlready(true);
    } else {
      setInputDataAlready(false);
    }
  }, [inputErrMsg]);

  // set Complete Page data
  useEffect(() => {
    if (isShowCompleted) {
      let datas = [];
      if (isPurchase) {
        datas = datas.concat({
          title: translate('lbl_BCD8000000_0046'),
          value: [
            `${addComma(resultData.purchaseDay)} USD / ${translate('lbl_BCD8000000_0047')}`,
            `${addComma(resultData.purchaseTime)} USD / ${translate('lbl_BCD8000000_0048')}`
          ]
        });
      }
      if (isWithdrawal) {
        datas = datas.concat({
          title: translate('lbl_BCD8000000_0049'),
          value: [
            `${addComma(resultData.withdrawalDay)} USD / ${translate('lbl_BCD8000000_0047')}`,
            `${addComma(resultData.withdrawalTime)} USD / ${translate('lbl_BCD8000000_0048')}`
          ]
        });
      }
      setCompleteData(datas);
    }
  }, [isShowCompleted]);

  // init input data
  const setInitLimit = () => {
    const data = {
      purchaseDay: '',
      purchaseTime: '',
      withdrawalDay: '',
      withdrawalTime: ''
    };
    setInputData(data);
  };

  const getCurrentLimit = async () => {
    if (isHandleApi) {
      const inquiryLimitResult = await handleInquiryCardLimit();
      if (inquiryLimitResult && inquiryLimitResult?.data?.elData) {
        const data = inquiryLimitResult?.data?.elData;
        let result = { ...inquiryData };
        result = {
          ...result,
          purchaseDay: data.chkcd_day_lmt_amt,
          purchaseTime: data.chkcd_ont_lmt_amt,
          withdrawalDay: data.card_day_ac_wdw_lmt_amt,
          withdrawalTime: data.card_ont_ac_wdw_lmt_amt,
          cardInfChgDt: data.card_inf_chg_dt,
          cardInfChgTime: data.card_inf_chg_time
        };
        setInquiryData({ ...result });
        handleOnSave && handleOnSave({ ...result });
        resetInputData(result);
        setReadyOpen(true);
        return true;
      } else {
        setReadyOpen(true);
        setErrMsg({ ...errMsg, isError: true, errMsg: inquiryLimitResult?.data?.elHeader?.resMsgVo });
        return false;
      }
    } else {
      setReadyOpen(true);
      if (defaultLimitValue?.isPurchaseCustomized || defaultLimitValue?.isWithdrawalCustomized) {
        setInputData({
          ...defaultLimitValue
        });
      } else {
        const cardType = getCardType(newCard.newCardTemplate?.join_etpr_no);
        const cardDefaultValue = CARD_LIMIT_DEF[cardType];
        const initInput = {
          ...inputData,
          purchaseDay: addComma(cardDefaultValue.purchase_max),
          purchaseTime: addComma(cardDefaultValue.purchase_max),
          withdrawalDay: addComma(cardDefaultValue.withdrawal_max),
          withdrawalTime: addComma(cardDefaultValue.withdrawal_max)
        };
        setInputData({ ...initInput });
      }
    }
  };

  const backToCard = () => {
    setErrMsg({ ...errMsg, isError: false, errMsg: null });
  };

  const resetInputData = result => {
    let input = { ...inputData };
    if (isPurchase) {
      input = { ...input, purchaseDay: addComma(result.purchaseDay), purchaseTime: addComma(result.purchaseTime) };
    }
    if (isWithdrawal) {
      input = {
        ...input,
        withdrawalDay: addComma(result.withdrawalDay),
        withdrawalTime: addComma(result.withdrawalTime)
      };
    }
    setInputData({ ...input });
  };

  const handleInquiryCardLimit = async () => {
    const requestData = {
      trx_func_d: '1', // 1: Inquiry 2: Change
      card_no: cardSelected.card_no,
      filler0020: cardSelected.filler0020
    };
    const result = await apiCall(debitCardsURLs.MANAGE_LIMIT, 'POST', requestData);
    return result;
  };

  const handleAuthError = async () => {};

  const handleAuthSuccess = async () => {
    const changeLimitResult = await changeLimitRequest();
    if (changeLimitResult && changeLimitResult?.data?.elData) {
      const data = changeLimitResult?.data?.elData;
      let result = { ...resultData };
      result = {
        ...result,
        purchaseDay: data.chkcd_day_lmt_amt,
        purchaseTime: data.chkcd_ont_lmt_amt,
        withdrawalDay: data.card_day_ac_wdw_lmt_amt,
        withdrawalTime: data.card_ont_ac_wdw_lmt_amt,
        cardInfChgDtDisplay: data.card_inf_chg_dt_display,
        cardInfChgTimeDisplay: data.card_inf_chg_time_display
      };
      setResultData({ ...result });
      setIsShowCompleted(true);
      onRefreshCard && onRefreshCard();
    } else {
      setReadyOpen(true);
      setErrMsg({ ...errMsg, isError: true, errMsg: changeLimitResult?.data?.elHeader?.resMsgVo });
    }
  };

  const changeLimitRequest = async () => {
    const reqData = {
      trx_func_d: '2', // 1: Inquiry 2: Change
      card_no: cardSelected.card_no,
      filler0020: cardSelected.filler0020,
      chkcd_day_lmt_amt: removeComma(inputData.purchaseDay),
      chkcd_ont_lmt_amt: removeComma(inputData.purchaseTime),
      card_inf_chg_dt: inquiryData.cardInfChgDt,
      card_inf_chg_time: inquiryData.cardInfChgTime
    };
    if (isWithdrawal) {
      reqData.card_day_ac_wdw_lmt_amt = removeComma(inputData.withdrawalDay);
      reqData.card_ont_ac_wdw_lmt_amt = removeComma(inputData.withdrawalTime);
    }
    const result = await apiCall(debitCardsURLs.MANAGE_LIMIT, 'POST', reqData);
    return result;
  };

  const onReset = () => {
    resetInputData(inquiryData);
  };

  const isChanged = () => {
    if (
      (inquiryData.purchaseDay || Number(removeComma(defaultLimitValue.purchaseDay))) !==
      Number(removeComma(inputData.purchaseDay))
    ) {
      return true;
    } else if (
      (inquiryData.purchaseTime || Number(removeComma(defaultLimitValue.purchaseTime))) !==
      Number(removeComma(inputData.purchaseTime))
    ) {
      return true;
    } else if (
      (inquiryData.withdrawalDay || Number(removeComma(defaultLimitValue.withdrawalDay))) !==
      Number(removeComma(inputData.withdrawalDay))
    ) {
      return true;
    } else if (
      (inquiryData.withdrawalTime || Number(removeComma(defaultLimitValue.withdrawalTime))) !==
      Number(removeComma(inputData.withdrawalTime))
    ) {
      return true;
    }
    return false;
  };

  const onSave = async () => {
    if (isChanged()) {
      if (isHandleApi) {
        onClose();
        await authActivationAccountPassword(
          data => {
            handleAuthSuccess();
          },
          error => {
            handleAuthError();
          }
        );
      } else {
        handleOnSave && handleOnSave(inputData);
      }
    } else {
      onClose();
      setReadyOpen(false);
    }
  };

  const detectCardType = () => {
    let cardType = '';
    if (isHandleApi) {
      cardType = getCardType(cardSelected?.join_etpr_no);
    } else {
      cardType = getCardType(newCard?.newCardTemplate?.join_etpr_no);
    }
    return cardType;
  };

  const checkLimit = () => {
    const cardType = detectCardType();
    let errText = { ...inputErrMsg };
    if (isPurchase) {
      if (inputData.purchaseDay !== '') {
        if (Number(removeComma(inputData.purchaseDay)) < CARD_LIMIT_DEF[cardType]?.purchase_min) {
          errText = {
            ...errText,
            purchaseDay: translate('lbl_BCD8000000_0039').replace('%1', `${CARD_LIMIT_DEF[cardType]?.purchase_min}`)
          };
        } else if (Number(removeComma(inputData.purchaseDay)) > CARD_LIMIT_DEF[cardType]?.purchase_max) {
          errText = {
            ...errText,
            purchaseDay: translate('lbl_BCD8000000_0041').replace('%1', `${CARD_LIMIT_DEF[cardType]?.purchase_max}`)
          };
        } else {
          errText = { ...errText, purchaseDay: '' };
        }
      }
      if (inputData.purchaseTime !== '') {
        if (Number(removeComma(inputData.purchaseTime)) < CARD_LIMIT_DEF[cardType]?.purchase_min) {
          errText = {
            ...errText,
            purchaseTime: translate('lbl_BCD8000000_0039').replace('%1', `${CARD_LIMIT_DEF[cardType]?.purchase_min}`)
          };
        } else if (Number(removeComma(inputData.purchaseTime)) > CARD_LIMIT_DEF[cardType]?.purchase_max) {
          errText = {
            ...errText,
            purchaseTime: translate('lbl_BCD8000000_0041').replace('%1', `${CARD_LIMIT_DEF[cardType]?.purchase_max}`)
          };
        } else {
          errText = { ...errText, purchaseTime: '' };
        }
      }
      if (
        inputData.purchaseDay !== '' &&
        inputData.purchaseTime !== '' &&
        errText.purchaseDay === '' &&
        errText.purchaseTime === ''
      ) {
        if (Number(removeComma(inputData.purchaseDay)) < removeComma(inputData.purchaseTime)) {
          errText = { ...errText, purchaseTime: translate('lbl_BCD8000000_0043') };
        } else {
          errText = { ...errText, purchaseTime: '' };
        }
      }
    }

    if (isWithdrawal) {
      if (inputData.withdrawalDay !== '') {
        if (Number(removeComma(inputData.withdrawalDay)) < CARD_LIMIT_DEF[cardType]?.withdrawal_min) {
          errText = {
            ...errText,
            withdrawalDay: translate('lbl_BCD8000000_0039').replace('%1', `${CARD_LIMIT_DEF[cardType]?.purchase_min}`)
          };
        } else if (Number(removeComma(inputData.withdrawalDay)) > CARD_LIMIT_DEF[cardType]?.withdrawal_max) {
          errText = {
            ...errText,
            withdrawalDay: translate('lbl_BCD8000000_0041').replace('%1', `${CARD_LIMIT_DEF[cardType]?.purchase_max}`)
          };
        } else {
          errText = { ...errText, withdrawalDay: '' };
        }
      }
      if (inputData.withdrawalTime !== '') {
        if (Number(removeComma(inputData.withdrawalTime)) < CARD_LIMIT_DEF[cardType]?.withdrawal_min) {
          errText = {
            ...errText,
            withdrawalTime: translate('lbl_BCD8000000_0039').replace('%1', `${CARD_LIMIT_DEF[cardType]?.purchase_min}`)
          };
        } else if (Number(removeComma(inputData.withdrawalTime)) > CARD_LIMIT_DEF[cardType]?.withdrawal_max) {
          errText = {
            ...errText,
            withdrawalTime: translate('lbl_BCD8000000_0041').replace('%1', `${CARD_LIMIT_DEF[cardType]?.purchase_max}`)
          };
        } else {
          errText = { ...errText, withdrawalTime: '' };
        }
      }

      if (
        inputData.withdrawalDay !== '' &&
        inputData.purchaseTime !== '' &&
        errText.withdrawalDay === '' &&
        errText.withdrawalTime === ''
      ) {
        if (Number(removeComma(inputData.withdrawalDay)) < Number(removeComma(inputData.withdrawalTime))) {
          errText = { ...errText, withdrawalTime: translate('lbl_BCD8000000_0045') };
        } else {
          errText = { ...errText, withdrawalTime: '' };
        }
      }
    }
    setInputErrMsg({ ...errText });
  };

  const handleBlurInput = name => {
    if (inputData[name] === '') {
      setInputErrMsg({ ...inputErrMsg, [name]: '' });
    }
  };

  useEffect(() => {
    checkLimit();
  }, [inputData]);

  const handleEnterLimit = (name, e) => {
    if (e == null) return;
    let inputValue = e.target.value;
    if (checkDecimal(removeComma(inputValue))) {
      return;
    }
    inputValue = addComma(inputValue);
    let input = { ...inputData };
    switch (name) {
      case 'purchaseDay':
        input = { ...input, purchaseDay: inputValue };
        break;
      case 'purchaseTime':
        input = { ...input, purchaseTime: inputValue };
        break;
      case 'withdrawalDay':
        input = { ...input, withdrawalDay: inputValue };
        break;
      case 'withdrawalTime':
        input = { ...input, withdrawalTime: inputValue };
        break;

      default:
        break;
    }
    setInputData({ ...input });
  };

  const clearInputData = type => {
    setInputErrMsg({ ...inputErrMsg, [type]: '' });
    setInputData({ ...inputData, [type]: '' });
  };

  useEffect(() => {
    if (isNativeBack) {
      setReadyOpen(false);
    }
    return () => setIsNativeClickBack(false);
  }, [isNativeBack]);

  return (
    <>
      {open && !readyOpen && <Spinner />}
      <BottomSheet
        clazz={`card__bottom ${isWithdrawal && isPurchase ? 'four_input' : ''}`}
        type="fit-content"
        open={open && readyOpen}
        onClose={() => {
          onClose();
          setReadyOpen(false);
        }}
        title={translate('men_KHCD800002')}
      >
        <div className="card__limit__content">
          <div className="card__limit__info__box">
            <InfoBox
              label={translate('lbl_BCD8000000_0095')
                .replace('%1', `${CARD_LIMIT_DEF[detectCardType()]?.purchase_min}$`)
                .replace('%2', `${CARD_LIMIT_DEF[detectCardType()]?.purchase_max}$`)}
            />
          </div>
          {isPurchase && (
            <>
              <Input
                className="card__limit__input"
                label={inputLabels.purchaseDay}
                onChange={e => handleEnterLimit('purchaseDay', e)}
                onBlur={e => handleBlurInput('purchaseDay', e)}
                errorMessage={inputErrMsg.purchaseDay}
                type="text"
                value={inputData.purchaseDay}
                onClearInput={() => clearInputData('purchaseDay')}
                inputMode="numeric"
              ></Input>
              <Input
                className="card__limit__input"
                label={inputLabels.purchaseTime}
                onChange={e => handleEnterLimit('purchaseTime', e)}
                onBlur={e => handleBlurInput('purchaseTime', e)}
                errorMessage={inputErrMsg.purchaseTime}
                type="text"
                value={inputData.purchaseTime}
                onClearInput={() => clearInputData('purchaseTime')}
                inputMode="numeric"
              ></Input>
            </>
          )}
          {isWithdrawal && (
            <>
              <Input
                className="card__limit__input"
                label={inputLabels.withdrawalDay}
                onChange={e => handleEnterLimit('withdrawalDay', e)}
                onBlur={e => handleBlurInput('withdrawalDay', e)}
                errorMessage={inputErrMsg.withdrawalDay}
                type="text"
                value={inputData.withdrawalDay}
                onClearInput={() => clearInputData('withdrawalDay')}
                inputMode="numeric"
              ></Input>
              <Input
                className="card__limit__input"
                label={inputLabels.withdrawalTime}
                onChange={e => handleEnterLimit('withdrawalTime', e)}
                onBlur={e => handleBlurInput('withdrawalTime', e)}
                errorMessage={inputErrMsg.withdrawalTime}
                type="text"
                value={inputData.withdrawalTime}
                onClearInput={() => clearInputData('withdrawalTime')}
                inputMode="numeric"
              ></Input>
            </>
          )}

          <DuoButton
            {...{
              ratio: 'oto',
              firstButton: {
                onClick: onReset,
                label: translate('lbl_cta_3008')
              },
              secondButton: {
                onClick: onSave,
                label: translate('lbl_cta_3007'),
                disable: !inputDataAlready
              }
            }}
          />
        </div>
      </BottomSheet>
      <Alert
        isCloseButton={false}
        isShowAlert={errMsg.isError}
        subtitle={errMsg.errMsg?.msgText}
        alertType={errMsg.errMsg?.msgType}
        firstButton={{ onClick: backToCard, label: translate('lbl_cta_3006') }}
      />
      {isShowCompleted && (
        <DebitCardComplete
          dateComplete={`${resultData.cardInfChgDtDisplay} ${resultData.cardInfChgTimeDisplay}`}
          cardName={translate('men_KHCD800002')}
          actionText={{
            text: translate('lbl_BCD8000000_0029'),
            position: 'right'
          }}
          completeThumbnail={character__notice}
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
            },
            ...completeData
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
                onClose();
                setIsShowCompleted(false);
                moveHome();
              }
            }
          }}
        />
      )}
    </>
  );
};

export default withHTMLParseI18n(DebitCardManageLimitBottom);
