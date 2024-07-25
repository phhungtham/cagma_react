import ToastIcon from '@assets/icons/ToastIcon';
import issuse_completed from '@assets/images/cardissuse.png';
import Alert from '@common/ui/components/atomic/Alert/Alert';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import Input from '@common/ui/components/atomic/Input/Input';
import Spinner from '@common/ui/components/atomic/Spinner';
import Switch from '@common/ui/components/atomic/Switch';
import Toast from '@common/ui/components/atomic/Toast';
import Header from '@common/ui/components/Header';
import { getAccountResquest } from '@components/Account/redux/action';
import { accountReducer } from '@components/Account/redux/reducer';
import { accountSaga } from '@components/Account/redux/saga';
import {
  listAccount,
  listAccountChecking,
  listAccountLoan,
  listAccountSaving,
  accountLoadState
} from '@components/Account/redux/selector';
import { FeatureName } from '@components/Account/redux/type';
import { loginSelector } from '@components/Login/redux/selector';
import { CARD_LIMIT_DEF, MENU_CODE } from '@configs/global/constants';
import useHttpStatus from '@hooks/useHttpStatus';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { apiCall } from '@shared/api';
import { dateNumberCheck, getCurrentDate, getCurrentTime } from '@utilities/dateTimeUtils';
import { addComma, handleFormatValue, getCardType, removeComma } from '@utilities/debitCardUtils';
import {
  authActivationAccountPassword,
  clearHistory,
  hideCertificationNumber,
  isEmpty,
  moveBack,
  moveHome,
  scrollImpact,
  showCertificationNumber
} from '@utilities/index';
import { setIsNativeClickBack } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import { backEventSelector } from 'app/redux/selector';
import { APP_GLOBAL } from 'app/redux/type';
import { InfoIcon, LineBanker, LinePurchase, LineTenorIcon, SalaryAccountIcon } from 'assets/icons';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionType as AccountActionType } from '../Account/redux/type';
import AccountBottomSheet from '../../common/bottomsheets/AccountBottomSheet';
import DebitCardManageLimitBottom from '../../common/bottomsheets/ManageLimitBottomSheet';
import SearchBankerBottomSheet from '../../common/bottomsheets/SearchBankerBottomSheet';
import CardDropDown from './components/CardDropDown';
import DebitCardComplete from './components/DebitCardComplete';
import { cardsSelector, cardVerificationData, newCardTemplateSelector } from './redux/selector';
import { debitCardsURLs } from './redux/type';
import Span from '@common/ui/components/atomic/Span';
import { Http } from '@shared/features/http';
import useDetectBrowser from '@hooks/useDetectBrowser';

const CreateNewVirtualCards = ({ translate }) => {
  useReducers([{ key: APP_GLOBAL, reducer: appGlobalReducer }]);

  const [accountBottomSheet, setAccountBottomSheet] = useState(false);
  const [searchBankerBottomSheet, setSearchBankerBottomSheet] = useState(false);
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);
  const [accountSelected, setAccountSelected] = useState(null);
  const [cusInfo, setCusInfo] = useState(null);
  const [currentBankerID, setCurrentBankerID] = useState(null);
  const { status: getAccountStatus } = useHttpStatus(AccountActionType.GET_ACCOUNT_REQUEST);
  const [manageLimitType, setManageLitmitType] = useState(null);
  const [isSendSMS, setIsSendSMS] = useState(false);
  const [createNewCardCompleted, setCreateNewCardCompleted] = useState(false);
  const [newCardSuccessData, setNewCardSuccessData] = useState({});
  const loginState = useSelector(loginSelector);
  const [isShowToast, setIsShowToast] = useState(false);
  const [isToastCardPin, setIsToastCardPin] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const reEnterTime = useRef(0);
  const isNativeBack = useSelector(backEventSelector || false);

  const [addCardError, setAddCardError] = useState({
    isError: false,
    errMsg: null
  });
  const cardVerifi = useSelector(cardVerificationData);

  const cardPinCode = useRef(null);
  const [limitData, setLimitData] = useState({
    purchaseDay: 0,
    purchaseTime: 0,
    withdrawalDay: 0,
    withdrawalTime: 0,
    isPurchaseCustomized: false,
    isWithdrawalCustomized: false
  });

  const accountsChecking = useSelector(listAccountChecking) || [];
  const accountLoadingState = useSelector(accountLoadState) || false;
  const cards = useSelector(cardsSelector) || {};
  const accounts = useSelector(listAccount) || {};
  const { newCardTemplate } = useSelector(newCardTemplateSelector);

  const checkAccountStatus = (type, arr) => {
    if (!type) return;
    return arr.filter(account => {
      return account.is_hidden_account === type.toString();
    });
  };
  const detectBrowser = useDetectBrowser();
  useReducers([{ key: FeatureName, reducer: accountReducer }]);
  useSagas([{ key: FeatureName, saga: accountSaga }]);

  const infoContentRef = useRef(null);
  const handleToggleAccountBottomSheet = status => {
    setAccountBottomSheet(status);
  };

  const handleToggleSearchBankerBottomSheet = status => {
    setSearchBankerBottomSheet(status);
  };

  const handleGetAccountDefault = () => {
    const allAccounts = [...accountsChecking];
    const visibleAccounts = checkAccountStatus(9, allAccounts);
    setAccountSelected(visibleAccounts[0]);
  };

  const handleSelectAccount = account => {
    setAccountSelected(account);
    setAccountBottomSheet(false);
  };

  const handleGetUserInfo = async () => {
    setIsLoading(true);
    const cusInfoRes = await apiCall(debitCardsURLs.INQUIRY_CUSTOMER, 'POST', {});
    if (!cusInfoRes?.data?.elData) {
      setAddCardError({ isError: true, errMsg: cusInfoRes?.data?.elHeader?.resMsgVo });
      return null;
    } else {
      setAddCardError({ isError: false, errMsg: null });
      setCusInfo({ ...cusInfoRes?.data?.elData, card_holder_nm: cards.cards.card_holder_nm });
      setIsLoading(false);
      return cusInfoRes?.data?.elData;
    }
  };

  const handleChooseBankerID = bankerID => {
    setCurrentBankerID(bankerID);
  };

  const handleAddNewVirtualCard = () => {
    reEnterTime.current = 0;
    showCertificationNumber(
      {
        title: translate('lbl_com_3174'),
        description: translate('lbl_com_3133').replace('%1', '6'),
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

  const handlePinMatched = pinCode => {
    if (pinCode.uniqueValue === cardPinCode.current) {
      cardPinCode.e2e = pinCode.e2e;
      authActivationAccountPassword(handleAuthSuccess);
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

  const handleAuthSuccess = () => {
    handleCreateCard();
  };

  const handleCreateCard = async () => {
    setIsLoading(true);
    const apsht_acpn_d = cards.cards.cnt > 0 ? '02' : '01';
    const sms_svc_aplct_yn = isSendSMS ? 1 : 0;
    const currentDate = new Date();
    const currentDateString = `${currentDate.getFullYear()}${dateNumberCheck(
      currentDate.getMonth() + 1
    )}${dateNumberCheck(currentDate.getDate())}`;
    const issuranceParam = {
      trx_func_d: '1',
      sh_lcl_corp_c: '161',
      crcd_aplct_brno: '8180',
      crcd_acpn_dt: currentDateString,
      apsht_acpn_d: cardVerifi?.apsht_acpn_d || '01',
      crcd_apct_engstc_nm: loginState?.elData?.loginInfo?.cusnm_c50,
      sms_svc_aplct_yn: sms_svc_aplct_yn,
      stmt_ac_no: accountSelected?.acno,
      ccy_c: 'USD',
      stmt_dd: '25',
      card_utl_stmt_rcve_meth: '02',
      cell_no: cusInfo?.cus_cell_no,
      email: cusInfo?.cus_email,
      ecr_pin: cardPinCode.e2e,
      join_etpr_no: newCardTemplate?.join_etpr_no,
      chkcd_day_lmt_amt: removeComma(limitData.purchaseDay) || 0,
      chkcd_ont_lmt_amt: removeComma(limitData.purchaseTime) || 0,
      card_day_ac_wdw_lmt_amt: 0,
      card_ont_ac_wdw_lmt_amt: 0,
      crcd_acpn_ser: null,
      card_rcve_meth_c: null,
      card_dlvr_city_adr_c: null,
      card_dlvr_regn_adr_c: null,
      card_dlvr_city_adr: null,
      card_dlvr_regn_adr: null,
      card_rcve_brno: 0,
      crcd_rect_pn_bnkr_no: currentBankerID?.bnkerno || ''
    };

    const createCardRes = await apiCall(debitCardsURLs.CARD_ISSUANCE, 'POST', issuranceParam);

    if (createCardRes && createCardRes?.data?.elData) {
      setIsLoading(false);
      setAddCardError({ isError: false, errMsg: null });
      setCreateNewCardCompleted(true);
      setNewCardSuccessData(createCardRes.data.elData);
    } else {
      setIsLoading(false);
      setAddCardError({ isError: true, errMsg: createCardRes?.data?.elHeader?.resMsgVo });
    }
  };

  const handleInitLimit = () => {
    const cardType = getCardType(newCardTemplate?.join_etpr_no);
    const cardDefaultValue = CARD_LIMIT_DEF[cardType];
    const initInput = {
      ...limitData,
      purchaseDay: addComma(cardDefaultValue.purchase_max),
      purchaseTime: addComma(cardDefaultValue.purchase_max),
      withdrawalDay: addComma(cardDefaultValue.withdrawal_max),
      withdrawalTime: addComma(cardDefaultValue.withdrawal_max)
    };
    setLimitData({ ...initInput });
  };

  const handleOnSaveManageLitmit = limitValue => {
    if (!limitValue) return;
    const updateLimitValue = {
      ...limitValue,
      isPurchaseCustomized:
        limitValue?.purchaseDay || limitValue?.purchaseTime || limitData.isPurchaseCustomized ? true : false
    };
    setLimitData({ ...updateLimitValue });
    setManageLitmitType(null);
  };

  useEffect(() => {
    const inquiryType = {
      inquiry_type: 1
    };
    const isAccountsInvalid = !accounts || isEmpty(accounts);
    if (isAccountsInvalid) {
      getAccountResquest(inquiryType);
    } else {
      handleGetAccountDefault();
      handleGetUserInfo();
    }
    if (getAccountStatus === Http.SUCCESS && isAccountsInvalid) {
      handleGetUserInfo();
    }
  }, [getAccountStatus]);

  const checkIfUserOnlyATMCard = cardList => {
    const findAllCardNotATM = cardList.findIndex(item => {
      return item.card_k !== '9';
    });
    return findAllCardNotATM > -1 ? true : false;
  };

  useEffect(() => {
    handleInitLimit();
  }, []);

  useEffect(() => {
    if (accountBottomSheet && isNativeBack) {
      setAccountBottomSheet(false);
    }
    if (searchBankerBottomSheet && isNativeBack) {
      setSearchBankerBottomSheet(false);
    }
    if (manageLimitType && isNativeBack) {
      setManageLitmitType(null);
    }
    if (!accountBottomSheet && !searchBankerBottomSheet && !manageLimitType && isNativeBack) {
      moveBack();
    }
    return () => {
      setIsNativeClickBack(false);
    };
  }, [isNativeBack, accountBottomSheet, searchBankerBottomSheet, manageLimitType]);

  const rowInfo = [
    {
      icon: <SalaryAccountIcon />,
      title: translate('lbl_BCD8000000_0031'),
      markedSub: accountSelected?.ac_nm,
      onClick: () => {
        if (cards.cards.cnt > 0 && checkIfUserOnlyATMCard(cards?.cards?.list)) return;
        handleToggleAccountBottomSheet(true);
      },
      isShowIcon: !(cards.cards.cnt > 0 && checkIfUserOnlyATMCard(cards?.cards?.list)),
      children: (
        <>
          <Span clazz="card__linked__acno" text={accountSelected?.acno_display} />
          <div className="card__drop__down__inner">
            <div className="content__icon">
              <InfoIcon />
            </div>
            <div className="content__title">
              {cards.cards.cnt === 0 ? translate('lbl_BCD8000000_0055') : translate('lbl_BCD8000000_0056')}
            </div>
          </div>
        </>
      )
    },
    {
      icon: <LineTenorIcon />,
      title: translate('lbl_BCD8000000_0057').replace(' %1th', ''),
      markedSub: '25th',
      children: null,
      isShowIcon: false
    },
    {
      icon: <LinePurchase />,
      title: translate('lbl_BCD8000000_0058'),
      onClick: () => setManageLitmitType('purchase'),
      markedSub: limitData.isPurchaseCustomized ? 'Customized' : 'Maximum ',
      children: (
        <div className="card__drop__down__inner no__backg">
          <div className="content__title">
            <section className="left__content">{`${handleFormatValue(limitData.purchaseDay)} USD / ${translate('lbl_BCD8000000_0047')}`}</section>
            <section className="vertical__line " />
            <section className="right__content">{`${handleFormatValue(limitData.purchaseTime)} USD / ${translate('lbl_BCD8000000_0048')}`}</section>
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      {/* still loading when account haven't called */}
      {(isLoading || accountLoadingState || isLoading === null) && <Spinner />}
      <div
        className="enter__info"
        ref={infoContentRef}
        onScroll={() => scrollImpact(infoContentRef.current, setIsHeaderExpand)}
      >
        <Header title={translate('men_KHCD800010')} isExpand={isHeaderExpand} />
        <section className="toast__overlay card__pin">
          <Toast
            isShowToast={isToastCardPin}
            iconStatus={<ToastIcon />}
            onClose={() => setIsToastCardPin(false)}
            message={translate('lbl_com_3118').replace('%1', '3')}
          />
        </section>
        <section className="enter__info__content">
          <section className="page__title">{translate('mymen_desc_KHCD800002')}</section>
          {rowInfo.map((info, index) => (
            <CardDropDown key={info.title + index} {...info}>
              {info.children}
            </CardDropDown>
          ))}
          <section className="additional__entries virtual">
            <Input
              disabled={true}
              label={translate('lbl_BCD8000000_0073')}
              value={cusInfo?.card_holder_nm}
              focusModeCustom={true}
            />
            <Input
              disabled={true}
              label={translate('lbl_BHO2010000_0016')}
              value={cusInfo?.cus_cell_no}
              focusModeCustom={true}
            />
            <Input
              disabled={true}
              label={translate('lbl_BHO2010000_0015')}
              value={cusInfo?.cus_email}
              focusModeCustom={true}
            />
            <section className="entries__switch__wrapper">
              <div className="title">{translate('lbl_BCD8000000_0076').replace('%1', '1.00')}</div>
              <div className="switch">
                <Switch active={isSendSMS} onChange={isChecked => setIsSendSMS(isChecked)} />
              </div>
            </section>
            <CardDropDown
              icon={<LineBanker />}
              title={translate('lbl_com_3164')}
              markedSub={currentBankerID ? currentBankerID?.bnkerno : translate('lbl_com_3165')}
              markType={currentBankerID ? 'blue' : 'grey'}
              onClick={() => handleToggleSearchBankerBottomSheet(true)}
            >
              <></>
            </CardDropDown>
          </section>
        </section>
        {detectBrowser === 'chrome' ? (
          <section className={'enter__info__bottom'}>
            <Button
              className={'enter__info__button'}
              label={translate('lbl_cta_3025')}
              onClick={handleAddNewVirtualCard}
            />
          </section>
        ) : (
          <Button
            className={'enter__info__button__IOS'}
            label={translate('lbl_cta_3025')}
            onClick={handleAddNewVirtualCard}
          />
        )}
        <AccountBottomSheet
          isHideBalance={false}
          open={accountBottomSheet}
          onClose={() => handleToggleAccountBottomSheet(false)}
          setAccount={handleSelectAccount}
        />
        <SearchBankerBottomSheet
          open={searchBankerBottomSheet}
          onChooseBanker={handleChooseBankerID}
          onClose={() => handleToggleSearchBankerBottomSheet(false)}
          handleShowToast={() => setIsShowToast(true)}
        />
        <DebitCardManageLimitBottom
          isPlastic={false}
          open={manageLimitType}
          onClose={() => setManageLitmitType(null)}
          isPurchase={manageLimitType === 'purchase'}
          isHandleApi={false}
          defaultLimitValue={limitData}
          handleOnSave={handleOnSaveManageLitmit}
        />
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={addCardError?.isError}
        subtitle={addCardError?.errMsg?.msgText}
        alertType={addCardError?.errMsg?.msgType}
        firstButton={{
          onClick: () => {
            setAddCardError({ ...addCardError, isError: false });
          },
          label: translate('lbl_cta_3006')
        }}
      />
      {createNewCardCompleted && (
        <DebitCardComplete
          clazz="add_virtual_completed"
          dateComplete={`${getCurrentDate('DD.MM.YYYY')} ${getCurrentTime('HH:MM:SS')}`}
          completeThumbnail={issuse_completed}
          cardName={translate('mymen_desc_KHCD800002')}
          actionText={{ text: translate('lbl_BCD8000000_0077'), position: 'left' }}
          dataTable={[
            {
              title: translate('lbl_BCD8000000_0030'),
              value: [translate('mymen_desc_KHCD800002')]
            },
            {
              title: translate('lbl_BCD8000000_0021'),
              value: [newCardSuccessData?.card_no]
            },
            {
              title: translate('lbl_BCD8000000_0078'),
              value: [`${newCardTemplate?.annualFee?.value} ${newCardTemplate?.annualFee?.unit}`]
            },
            {
              title: translate('lbl_BCD8000000_0005'),
              value: [`${limitData.purchaseDay} USD / Day`, `${limitData.purchaseTime} USD / Time`]
            },
            {
              title: translate('lbl_BCD8000000_0031'),
              value: [newCardSuccessData?.stmt_ac_no]
            }
          ]}
          duoButton={{
            firstButton: {
              label: translate('lbl_cta_3038'),
              action: () => {
                setCreateNewCardCompleted(false);
                clearHistory(MENU_CODE.CARDS);
              }
            },
            secondButton: {
              label: translate('lbl_cta_3241'),
              action: () => {
                setCreateNewCardCompleted(false);
                moveHome();
              }
            }
          }}
        />
      )}
    </>
  );
};

export default withHTMLParseI18n(CreateNewVirtualCards);
