import issuse_completed from '@assets/images/cardissuse.png';
import Alert from '@common/ui/components/atomic/Alert/Alert';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import Input from '@common/ui/components/atomic/Input/Input';
import Spinner from '@common/ui/components/atomic/Spinner';
import Switch from '@common/ui/components/atomic/Switch';
import Header from '@common/ui/components/Header';
import { getAccountResquest } from '@components/Account/redux/action';
import { accountReducer } from '@components/Account/redux/reducer';
import { accountSaga } from '@components/Account/redux/saga';
import { listAccount, listAccountChecking, accountLoadState } from '@components/Account/redux/selector';
import { FeatureName } from '@components/Account/redux/type';
import { loginSelector } from '@components/Login/redux/selector';
import { MENU_CODE } from '@configs/global/constants';
import useDetectBrowser from '@hooks/useDetectBrowser';
import useHttpStatus from '@hooks/useHttpStatus';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { apiCall } from '@shared/api';
import { dateNumberCheck, getCurrentDate, getCurrentTime } from '@utilities/dateTimeUtils';
import { addComma, handleFormatValue, CARD_LIMIT_DEF, getCardType, removeComma } from '@utilities/debitCardUtils';
import {
  authActivationAccountPassword,
  clearHistory,
  isEmpty,
  moveBack,
  moveHome,
  scrollImpact
} from '@utilities/index';
import { setIsNativeClickBack } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import { appLanguage, backEventSelector } from 'app/redux/selector';
import { APP_GLOBAL } from 'app/redux/type';
import {
  InfoIcon,
  LineBanker,
  LinePlate,
  LinePurchase,
  LineReceive,
  LineTenorIcon,
  LineWithDraw,
  SalaryAccountIcon
} from 'assets/icons';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionType as AccountActionType } from '../Account/redux/type';
import AccountBottomSheet from '../../common/bottomsheets/AccountBottomSheet';
import CardPlateBottomSheet from '../../common/bottomsheets/CardPlateBottomSheet';
import DebitCardManageLimitBottom from '../../common/bottomsheets/ManageLimitBottomSheet';
import SearchBankerBottomSheet from '../../common/bottomsheets/SearchBankerBottomSheet';
import WayToReceiveBottomSheet from '../../common/bottomsheets/WayToReceiveBottomSheet';
import CardDropDown from './components/CardDropDown';
import DebitCardComplete from './components/DebitCardComplete';
import { cardAmountSelector, cardsSelector, cardVerificationData, newCardTemplateSelector } from './redux/selector';
import { debitCardsURLs } from './redux/type';
import Span from '@common/ui/components/atomic/Span';
import { Http } from '@shared/features/http';

const CreateNewCard = ({ translate }) => {
  useReducers([{ key: APP_GLOBAL, reducer: appGlobalReducer }]);
  const [accountBottomSheet, setAccountBottomSheet] = useState(false);
  const [cardPlateBottomSheet, setCardPlateBottomSheet] = useState(false);
  const [wayToReceiveBottomSheet, setWayToReceiveBottomSheet] = useState(false);
  const [searchBankerBottomSheet, setSearchBankerBottomSheet] = useState(false);
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);
  const [accountSelected, setAccountSelected] = useState(null);
  const [deliverAddress, setDeliverAddress] = useState([]);
  const [deliverBranch, setDeliverBranch] = useState([]);
  const [cusInfo, setCusInfo] = useState(null);
  const [isFilledAll, setIsFilledAll] = useState(false);
  const [currentBankerID, setCurrentBankerID] = useState(null);
  const [isSendSMS, setIsSendSMS] = useState(false);
  const [manageLimitType, setManageLitmitType] = useState(null);
  const loginInfo = useSelector(loginSelector);
  const [createNewCardCompleted, setCreateNewCardCompleted] = useState(false);
  const { status: getAccountStatus, error } = useHttpStatus(AccountActionType.GET_ACCOUNT_REQUEST);
  const [newCardSuccessData, setNewCardSuccessData] = useState({});
  const [isShowToast, setIsShowToast] = useState(false);
  const [purchaseCustomizedMode, setPurchaseCustomizedMode] = useState(false);
  const [withdrawalCustomizedMode, setWithdrawalCustomizedMode] = useState(false);
  const appLang = useSelector(appLanguage);
  const isNativeBack = useSelector(backEventSelector || false);
  const [isLoading, setIsLoading] = useState(false);
  const [addCardError, setAddCardError] = useState({
    isError: false,
    errMsg: null
  });
  const [limitData, setLimitData] = useState({
    purchaseDay: 0,
    purchaseTime: 0,
    withdrawalDay: 0,
    withdrawalTime: 0,
    isPurchaseCustomized: false,
    isWithdrawalCustomized: false
  });

  const [fillData, setFillData] = useState({
    cardPlate: 0,
    // cardPlate: '0006',
    wayReceive: null,
    receiveTitle: '',
    cardColorStatus: 'modfied'
  });

  const detectBrowser = useDetectBrowser();

  const CARD_COLOR = {
    '0006': 'Navy',
    '0007': 'Pink'
  };

  const accountsChecking = useSelector(listAccountChecking) || [];
  const cards = useSelector(cardsSelector) || {};
  const accounts = useSelector(listAccount) || {};
  const accountLoadingState = useSelector(accountLoadState) || false;
  const cardVerifi = useSelector(cardVerificationData) || {};
  const { newCardTemplate } = useSelector(newCardTemplateSelector);
  const { cardAmount } = useSelector(cardAmountSelector);

  const checkAccountStatus = (type, arr) => {
    if (!type) return;
    return arr.filter(account => {
      return account.is_hidden_account === type.toString();
    });
  };

  useReducers([{ key: FeatureName, reducer: accountReducer }]);
  useSagas([{ key: FeatureName, saga: accountSaga }]);

  const infoContentRef = useRef(null);
  const addressData = useRef(null);
  const cusInfoRef = useRef(null);

  const handleToggleAccountBottomSheet = status => {
    setAccountBottomSheet(status);
  };
  const handleToggleCardPlateBottomSheet = status => {
    setCardPlateBottomSheet(status);
  };
  const handleToggleWayToReceiveBottomSheet = status => {
    setWayToReceiveBottomSheet(status);
    if (status) {
      handleGetAddressWay();
    }
  };
  const handleToggleSearchBankerBottomSheet = status => {
    setSearchBankerBottomSheet(status);
  };

  const handleSaveCardPlate = cardColor => {
    setFillData({ ...fillData, cardPlate: cardColor });
  };

  const checkAllDataFilled = () => {
    const isFilled = Object.values(fillData).every(data => data !== null && data !== '');
    return isFilled && accountSelected;
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

  const handleRequestInquiryAddress = async (zipCode = null) => {
    const addRessRes = await apiCall(debitCardsURLs.INQUIRY_ADDRESS, 'POST', { zipc: zipCode });
    if (addRessRes && addRessRes?.data?.elData) {
      return addRessRes?.data?.elData.list;
    } else {
      setAddCardError({ ...addCardError, isError: true, errMsg: addRessRes?.data?.elHeader?.resMsgVo });
      return [];
    }
  };

  const handleRequestInquiryBranch = async () => {
    const branchRes = await apiCall(debitCardsURLs.INQUIRY_BRANCH, 'POST', { lang_code: appLang || 'en' });
    if (branchRes && branchRes?.data?.elData) {
      return branchRes?.data?.elData.list;
    } else {
      setAddCardError({ ...addCardError, isError: true, errMsg: branchRes?.data?.elHeader?.resMsgVo });
      return [];
    }
  };

  const handleGetAddressWay = async () => {
    setIsLoading(true);
    const addressList = await handleRequestInquiryAddress();
    handleGetBranchWay();
    setDeliverAddress(addressList);
    setIsLoading(false);
  };

  const handleGetBranchWay = async () => {
    setIsLoading(true);
    const addressList = await handleRequestInquiryBranch();
    setDeliverBranch(addressList);
    setIsLoading(false);
  };

  const handleGetUserInfo = async () => {
    const cusInfoRes = await apiCall(debitCardsURLs.INQUIRY_CUSTOMER, 'POST', {});
    if (cusInfoRes && cusInfoRes?.data?.elData) {
      setCusInfo({ ...cusInfoRes?.data?.elData, card_holder_nm: cards.cards.card_holder_nm });
      setIsFilledAll(true);
      return cusInfoRes?.data?.elData;
    } else {
      setAddCardError({ ...addCardError, isError: true, errMsg: cusInfoRes?.data?.elHeader?.resMsgVo });
      return null;
    }
  };

  const handleChooseBankerID = bankerID => {
    setCurrentBankerID(bankerID);
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

  const checkIfUserOnlyATMCard = cardList => {
    const findAllCardNotATM = cardList.findIndex(item => {
      return item.card_k !== '9';
    });
    return findAllCardNotATM > -1 ? true : false;
  };

  const handleCreateCard = async () => {
    setIsLoading(true);
    const sms_svc_aplct_yn = isSendSMS ? 1 : 0;
    const currentDate = new Date();
    const currentDateString = `${currentDate.getFullYear()}${dateNumberCheck(
      currentDate.getMonth() + 1
    )}${dateNumberCheck(currentDate.getDate())}`;
    const deleveryMethod = addressData.current?.branchAdress?.['BRNO'] ? '01' : '03';
    const issuranceParam = {
      trx_func_d: '1',
      crcd_aplct_brno: '8180',
      crcd_acpn_dt: currentDateString,
      apsht_acpn_d: cardVerifi?.apsht_acpn_d || '01',
      // crcd_apct_engstc_nm: cusInfo?.card_holder_nm,
      crcd_apct_engstc_nm: loginInfo?.elData?.loginInfo?.cusnm_c50,
      sms_svc_aplct_yn: sms_svc_aplct_yn,
      stmt_ac_no: accountSelected?.acno,
      // ccy_c: accountSelected?.ac_ccy_c,
      ccy_c: 'USD',
      stmt_dd: '25',
      card_utl_stmt_rcve_meth: '02',
      cell_no: cusInfo?.cus_cell_no,
      email: cusInfo?.cus_email,
      ecr_pin: '',
      join_etpr_no: fillData?.cardPlate,
      chkcd_day_lmt_amt: removeComma(limitData.purchaseDay) || 0,
      chkcd_ont_lmt_amt: removeComma(limitData.purchaseTime) || 0,
      card_day_ac_wdw_lmt_amt: removeComma(limitData.withdrawalDay) || 0,
      card_ont_ac_wdw_lmt_amt: removeComma(limitData.withdrawalTime) || 0,
      //prev screen
      crcd_acpn_ser: cardVerifi?.crcd_acpn_ser || '01',
      card_rcve_meth_c: deleveryMethod,
      //address--- cityAddress, branchAdress, directAddress
      card_dlvr_city_adr_c: deleveryMethod === '03' ? addressData.current?.cityAddress?.zipc || '' : '',
      card_dlvr_regn_adr_c:
        deleveryMethod === '03'
          ? (addressData.current?.cityAddress?.zipc || '') + (addressData.current?.directAddress?.zipc || '')
          : '',
      card_dlvr_city_adr: deleveryMethod === '03' ? addressData.current?.cityAddress?.zipc_class_adr1 || '' : '',
      card_dlvr_regn_adr: deleveryMethod === '03' ? addressData.current?.directAddress?.zipc_class_adr2 || '' : '',
      card_rcve_brno: deleveryMethod === '01' ? addressData.current?.branchAdress?.['BRNO'] || '' : '',
      //banker--
      crcd_rect_pn_bnkr_no: currentBankerID?.bnkerno,
      crcd_rect_pn_mng_brno: currentBankerID?.mng_brno
    };
    const createCardRes = await apiCall(debitCardsURLs.CARD_ISSUANCE, 'POST', issuranceParam);
    if (createCardRes && createCardRes?.data?.elData) {
      setIsLoading(false);
      setAddCardError({ ...addCardError, isError: false, errMsg: null });
      setCreateNewCardCompleted(true);
      setNewCardSuccessData(createCardRes?.data?.elData);
    } else {
      setIsLoading(false);
      setAddCardError({ ...addCardError, isError: true, errMsg: createCardRes?.data?.elHeader?.resMsgVo });
    }
  };

  const handleAuthAccount = async () => {
    await authActivationAccountPassword(
      data => {
        handleCreateCard();
      },
      error => {}
    );
  };

  const handleOnSaveManageLitmit = limitValue => {
    if (!limitValue) return;
    if (manageLimitType === 'purchase' && (limitValue?.purchaseDay || limitValue?.purchaseTime)) {
      setPurchaseCustomizedMode(true);
    }
    if (manageLimitType === 'withdrawal' && (limitValue?.withdrawalDay || limitValue?.withdrawalTime)) {
      setWithdrawalCustomizedMode(true);
    }
    const updateLimitValue = {
      ...limitValue
    };
    setLimitData({ ...updateLimitValue });
    setManageLitmitType(null);
  };

  useEffect(() => {
    setLimitData({
      ...limitData,
      isPurchaseCustomized: purchaseCustomizedMode,
      isWithdrawalCustomized: withdrawalCustomizedMode
    });
  }, [purchaseCustomizedMode, withdrawalCustomizedMode]);

  const displayBranchName = () => {
    switch (appLang) {
      case 'en':
        return addressData.current?.branchAdress?.['ENG_BR_NM'];
      case 'ko':
        return addressData.current?.branchAdress?.['KORN_BR_NM'];
      case 'km':
        return addressData.current?.branchAdress?.['LCL_BR_NM'];
      default:
        return '';
    }
  };

  const handleInItCardColor = () => {
    let cardFillData = { ...fillData, cardPlate: newCardTemplate?.join_etpr_no };
    if (!cardAmount) return;
    if (newCardTemplate?.join_etpr_no === '0006' || newCardTemplate?.join_etpr_no === '0007') {
      if (cardAmount['0006'] && cardAmount['0006'] >= 1) {
        cardFillData = { ...cardFillData, cardPlate: '0007', cardColorStatus: 'readOnly' };
      } else if (cardAmount['0007'] && cardAmount['0007'] >= 1) {
        cardFillData = { ...cardFillData, cardPlate: '0006', cardColorStatus: 'readOnly' };
      }
    }
    setFillData({ ...cardFillData });
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
    }
  }, [getAccountStatus]);

  useEffect(() => {
    handleInitLimit();
  }, []);

  useEffect(() => {
    if (checkAllDataFilled()) {
      handleGetUserInfo();
    }
  }, [fillData]);

  useEffect(() => {
    handleInItCardColor();
  }, []);

  useEffect(() => {
    if (cardPlateBottomSheet && isNativeBack) {
      setCardPlateBottomSheet(false);
    }
    if (accountBottomSheet && isNativeBack) {
      setAccountBottomSheet(false);
    }
    if (wayToReceiveBottomSheet && isNativeBack) {
      setWayToReceiveBottomSheet(false);
    }
    if (searchBankerBottomSheet && isNativeBack) {
      setSearchBankerBottomSheet(false);
    }
    if (manageLimitType && isNativeBack) {
      setManageLitmitType(null);
    }
    if (
      !cardPlateBottomSheet &&
      !accountBottomSheet &&
      !wayToReceiveBottomSheet &&
      !searchBankerBottomSheet &&
      !manageLimitType &&
      isNativeBack
    ) {
      moveBack();
    }
    return () => {
      setIsNativeClickBack(false);
    };
  }, [isNativeBack, cardPlateBottomSheet, accountBottomSheet, wayToReceiveBottomSheet, manageLimitType]);

  useEffect(() => {
    if (cusInfo) {
      cusInfoRef.current.scrollIntoView();
    }
  }, [cusInfo]);

  const rowInfo = [
    {
      icon: <SalaryAccountIcon />,
      title: translate('lbl_BCD8000000_0031'),
      markedSub: accountSelected?.ac_nm,
      onClick: () => {
        if (cards.cards?.cnt > 0 && checkIfUserOnlyATMCard(cards?.cards?.list)) return;
        handleToggleAccountBottomSheet(true);
      },
      isShowIcon: !(cards.cards?.cnt > 0 && checkIfUserOnlyATMCard(cards?.cards?.list)),
      children: (
        <>
          <Span clazz="card__linked__acno" text={accountSelected?.acno_display} />
          <div className="card__drop__down__inner">
            <div className="content__icon">
              <InfoIcon />
            </div>
            <div className="content__title">
              {cards.cards?.cnt === 0 ? translate('lbl_BCD8000000_0055') : translate('lbl_BCD8000000_0056')}
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
      markedSub: purchaseCustomizedMode ? 'Customized' : 'Maximum ',
      children: (
        <div className="card__drop__down__inner no__backg">
          <div className="content__title">
            <section className="left__content">{`${handleFormatValue(limitData.purchaseDay)} USD / ${translate(
              'lbl_BCD8000000_0047'
            )}`}</section>
            <section className="vertical__line " />
            <section className="right__content">{`${handleFormatValue(limitData.purchaseTime)} USD / ${translate(
              'lbl_BCD8000000_0048'
            )}`}</section>
          </div>
        </div>
      )
    },
    {
      icon: <LineWithDraw />,
      title: translate('lbl_BCD8000000_0059'),
      markedSub: withdrawalCustomizedMode ? 'Customized' : 'Maximum ',
      onClick: () => setManageLitmitType('withdrawal'),
      children: (
        <div className="card__drop__down__inner no__backg">
          <div className="content__title">
            <section className="left__content">{`${handleFormatValue(limitData.withdrawalDay)} USD / ${translate(
              'lbl_BCD8000000_0047'
            )}`}</section>
            <section className="vertical__line " />
            <section className="right__content">{`${handleFormatValue(limitData.withdrawalTime)} USD / ${translate(
              'lbl_BCD8000000_0048'
            )}`}</section>
          </div>
        </div>
      )
    },
    {
      icon: <LinePlate />,
      title: translate('lbl_BCD8000000_0060'),
      markedSub: fillData.cardPlate ? CARD_COLOR[fillData.cardPlate] : translate('lbl_BCD8000000_0061'),
      markType: fillData.cardPlate ? 'blue' : 'grey',

      onClick: () => {
        if (fillData.cardColorStatus === 'readOnly') return;
        handleToggleCardPlateBottomSheet(true);
      },
      isShowIcon: fillData.cardColorStatus !== 'readOnly',

      children: <></>
      // isShowIcon: false
    },
    {
      icon: <LineReceive />,
      title: translate('lbl_BCD8000000_0062'),
      markedSub: fillData.receiveTitle ? fillData.receiveTitle : translate('lbl_BCD8000000_0063'),
      markType: fillData.wayReceive ? 'blue' : 'grey',
      onClick: () => handleToggleWayToReceiveBottomSheet(true),
      children: fillData.wayReceive && (
        <div className="card__drop__down__inner no__backg">
          <div className="content__title">{fillData.wayReceive}</div>
        </div>
      )
    }
  ];
  return (
    <div
      className="enter__info"
      ref={infoContentRef}
      onScroll={() => scrollImpact(infoContentRef.current, setIsHeaderExpand)}
    >
      {(isLoading || accountLoadingState) && <Spinner />}
      <Header title={translate('men_KHCD800010')} isExpand={isHeaderExpand} />
      <section className="enter__info__content">
        <section className="page__title">
          {newCardTemplate?.join_etpr_no === '0008'
            ? translate('mymen_desc_KHCD800000')
            : translate('mymen_desc_KHCD800001')}
        </section>
        {rowInfo.map((info, index) => {
          let renderData;
          if (
            info.title === translate('lbl_BCD8000000_0060') &&
            (newCardTemplate?.join_etpr_no === '0008' || newCardTemplate?.join_etpr_no === '0009')
          ) {
            renderData = <></>;
          } else {
            renderData = (
              <CardDropDown key={info.title + index} {...info}>
                {info.children}
              </CardDropDown>
            );
          }
          return renderData;
        })}
        {cusInfo && (
          <section className="additional__entries plastic" ref={cusInfoRef}>
            <Input disabled={true} label={translate('lbl_BCD8000000_0073')} defaultValue={cusInfo?.card_holder_nm} />
            <Input disabled={true} label={translate('lbl_BHO2010000_0015')} defaultValue={cusInfo?.cus_email} />
            <Input disabled={true} label={translate('lbl_BHO2010000_0016')} defaultValue={cusInfo?.cus_cell_no} />
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
        )}
      </section>
      {detectBrowser === 'chrome' ? (
        <section className={`enter__info__bottom ${isFilledAll && 'is__filled'}`}>
          <Button
            disable={!isFilledAll}
            className={'enter__info__button'}
            label={translate('lbl_cta_3025')}
            onClick={() => handleAuthAccount()}
          />
        </section>
      ) : (
        <Button
          disable={!isFilledAll}
          className={'enter__info__button__IOS'}
          label={translate('lbl_cta_3025')}
          onClick={() => handleAuthAccount()}
        />
      )}
      <AccountBottomSheet
        isHideBalance={false}
        open={accountBottomSheet}
        onClose={() => handleToggleAccountBottomSheet(false)}
        setAccount={handleSelectAccount}
      />
      <CardPlateBottomSheet
        open={cardPlateBottomSheet}
        onClose={() => handleToggleCardPlateBottomSheet(false)}
        onSaveCard={handleSaveCardPlate}
        defaultOption={fillData?.cardPlate}
        isReadOnly={fillData.cardColorStatus}
      />
      <section className="way__to__receive">
        <WayToReceiveBottomSheet
          open={wayToReceiveBottomSheet}
          deliverAddress={deliverAddress}
          deliverBranch={deliverBranch}
          onClose={() => handleToggleWayToReceiveBottomSheet(false)}
          onChooseAddress={(branch, receiveTitle, cityAddress, branchAdress, directAddress) => {
            addressData.current = { cityAddress, branchAdress, directAddress };
            setFillData({ ...fillData, wayReceive: branch, receiveTitle: receiveTitle });
          }}
          setLoadingStatus={status => setIsLoading(status)}
        />
      </section>
      <SearchBankerBottomSheet
        open={searchBankerBottomSheet}
        onChooseBanker={handleChooseBankerID}
        onClose={() => handleToggleSearchBankerBottomSheet(false)}
        handleShowToast={() => setIsShowToast(true)}
      />
      <DebitCardManageLimitBottom
        isPlastic={true}
        open={manageLimitType}
        onClose={() => setManageLitmitType(null)}
        isPurchase={manageLimitType === 'purchase'}
        isWithdrawal={manageLimitType === 'withdrawal'}
        isHandleApi={false}
        defaultLimitValue={limitData}
        handleOnSave={handleOnSaveManageLitmit}
      />

      {/* alert error */}
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
      {/* screen completed */}
      {createNewCardCompleted && (
        <DebitCardComplete
          clazz="add_plastis_completed"
          dateComplete={`${getCurrentDate('DD.MM.YYYY')} ${getCurrentTime('HH:MM:SS')}`}
          completeThumbnail={issuse_completed}
          cardName={newCardTemplate?.cardName}
          actionText={{ text: translate('lbl_BCD8000000_0077'), position: 'left' }}
          dataTable={[
            {
              title: translate('lbl_BCD8000000_0030'),
              value: [newCardTemplate?.cardName]
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
              value: [
                `${limitData.purchaseDay} USD / ${translate('lbl_BCD8000000_0047')}`,
                `${limitData.purchaseTime} USD / ${translate('lbl_BCD8000000_0048')}`
              ]
            },
            {
              title: translate('lbl_BCD8000000_0008'),
              value: [
                `${limitData.withdrawalDay} USD / ${translate('lbl_BCD8000000_0047')}`,
                `${limitData.withdrawalTime} USD / ${translate('lbl_BCD8000000_0048')}`
              ]
            },
            {
              title: translate('lbl_BCD8000000_0031'),
              value: [newCardSuccessData?.stmt_ac_no]
            },
            {
              title: translate('lbl_BCD8000000_0062'),
              value: [
                newCardSuccessData?.card_rcve_meth_c === '03'
                  ? translate('lbl_BCD8000000_0068')
                  : translate('lbl_BCD8000000_0069'),
                newCardSuccessData?.card_rcve_meth_c === '03' ? '' : displayBranchName()
              ]
            }
          ]}
          duoButton={{
            firstButton: {
              label: translate('lbl_cta_3038'),
              action: () => {
                clearHistory(MENU_CODE.CARDS);
                setCreateNewCardCompleted(false);
              }
            },
            secondButton: {
              label: translate('lbl_cta_3241'),
              action: () => {
                moveHome();
                setCreateNewCardCompleted(false);
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default withHTMLParseI18n(CreateNewCard);
