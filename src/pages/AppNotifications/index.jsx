import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import LoadingInfinite from '@common/components/atoms/LoadingInfinite';
import Spinner from '@common/components/atoms/Spinner';
import Tabs from '@common/components/molecules/Tabs';
import Header from '@common/components/organisms/Header';
import { EMPTY_OBJ } from '@common/constants/common';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { addDateWithMonth } from '@utilities/dateTimeUtils';
import { getLanguageFM, isEmpty, moveBack } from '@utilities/index';
import { setLoginState } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import {
  appLanguage,
  appPathSelector,
  loginSelector,
  nativeParamsSelector,
  nativeRedirectStateSelector,
} from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import { APP_GLOBAL } from '../../app/redux/type';
import PromotionDetailBottom from './components/PromotionDetailBottom';
import PromotionsTab from './components/PromotionsTab';
import TransactionsTab from './components/TransactionsTab';
import YourOffersTab from './components/YourOffersTab';
import { NotificationRequestType, NotificationTabIndex, NotificationTabLabel } from './constants';
import {
  cleanupAppNotification,
  getOfferNotificationList,
  getPromotionNotificationList,
  getTransactionNotificationList,
  setBannerSeqState,
  setTabIndex as setReduxTabIndex,
} from './redux/action';
import { appNotificationReducer } from './redux/reducer';
import { appNotificationSaga } from './redux/saga';
import {
  listOfferLoadMoreCnt,
  listTransactionLoadMoreCnt,
  offerList,
  offerLoadState,
  promotionList,
  promotionLoadState,
  tabIdx,
  transactionList,
  transactionLoadState,
} from './redux/selector';
import { AppNotificationFeatureName } from './redux/type';

const AppNotifications = ({ translate }) => {
  useReducers([
    { key: AppNotificationFeatureName, reducer: appNotificationReducer },
    { key: APP_GLOBAL, reducer: appGlobalReducer },
  ]);
  useSagas([{ key: AppNotificationFeatureName, saga: appNotificationSaga }]);
  const appLang = useSelector(appLanguage);
  const listTransactionCount = useSelector(listTransactionLoadMoreCnt);
  const listOfferCount = useSelector(listOfferLoadMoreCnt);
  const reduxTabIndex = useSelector(tabIdx);
  const [tabIndex, setTabIndex] = useState(reduxTabIndex);
  const [showPromotionDetail, setShowPromotionDetail] = useState(false);
  const [currentPromotionDetail, setCurrentPromotionDetail] = useState({});
  // const [eventDayRemain, setEventDayRemain] = useState(0);
  const [loadMoreNotify, setLoadMoreNotify] = useState(false);
  // const [benenefitDetailScroll, setBenenefitDetailScroll] = useState('');
  // const [benefitListDisplay, setBenefitListDisplay] = useState([]);
  // const { isLoading } = useLoginInfo({ isSend: true });
  const isLogin = useSelector(loginSelector);
  // const benefitDetailRef = useRef(null);
  const notificationListRef = useRef(null);

  const initRequestTransactionsNotify = {
    push_lang_c: null,
    inq_cnt: 0,
    inq_st_dt: addDateWithMonth(3),
    ums_svc_c: NotificationRequestType.TRANSACTION,
  };

  const initRequestOffersNotify = {
    push_lang_c: null,
    inq_cnt: 0,
    inq_st_dt: addDateWithMonth(3),
    ums_svc_c: NotificationRequestType.OFFER,
  };

  const [requestTransactionParams, setRequestTransactionParams] = useState({ ...initRequestTransactionsNotify });
  const [requestOfferParams, setRequestOfferParams] = useState({ ...initRequestOffersNotify });

  // selectors
  const listTransactionNotify = useSelector(transactionList);
  const listOfferNotify = useSelector(offerList);
  const listPromotionNotify = useSelector(promotionList);
  const loadTransactionState = useSelector(transactionLoadState);
  const loadOfferState = useSelector(offerLoadState);
  const loadPromotionState = useSelector(promotionLoadState);
  // const checkingLoadErrors = useSelector(checkingLoadFailed);
  // const benefitsLoadErrors = useSelector(benefitsLoadFailed);
  const isNativeRedirect = useSelector(nativeRedirectStateSelector || false);
  const nativeParams = useSelector(nativeParamsSelector);
  const currentLang = getLanguageFM(appLang, false);
  const appPath = useSelector(appPathSelector);

  useEffect(() => {
    // if (appPath !== '/notification') return;
    // setShowBenefitDetail(false);
    if (reduxTabIndex !== undefined) {
      switch (reduxTabIndex) {
        case [NotificationTabIndex.TRANSACTIONS]:
          getTransactionListFirstTime();
          break;
        case [NotificationTabIndex.OFFERS]:
          getOfferListFirstTime();
          break;
        case [NotificationTabIndex.PROMOTIONS]:
          setTabIndex(NotificationTabIndex.PROMOTIONS);
          getPromotionNotificationList();
          break;
        default:
          break;
      }
      return;
    }
    if (isEmpty(nativeParams)) {
      getTransactionListFirstTime();
      setRequestOfferParams({ ...initRequestOffersNotify }); // reset offer request data
    }
    return () => {
      cleanupAppNotification();
    };
  }, [isNativeRedirect, nativeParams, appPath]);

  useEffect(() => {
    // handle case receive push notify and show tab...
    // ums_svc_c : 6 - Benefit tab
    // ums_svc_c : 1 - Checking tab
    // ums_svc_c : 10 - Offers tab
    // ums_svc_c : null - Checking tab
    if (isEmpty(nativeParams) || nativeParams === undefined || reduxTabIndex !== undefined) return;
    switch (nativeParams?.ums_svc_c) {
      case '06':
        setTabIndex(2);
        getPromotionNotificationList();
        break;
      case '10':
        getOfferListFirstTime();
        break;
      case '01':
      case null:
      default:
        getTransactionListFirstTime();
        break;
    }
    return () => {
      cleanupAppNotification();
    };
  }, [nativeParams]);

  const getTransactionListFirstTime = () => {
    setTabIndex(NotificationTabIndex.TRANSACTIONS);
    getTransactionNotificationList({ ...initRequestTransactionsNotify });
    setRequestTransactionParams({ ...initRequestTransactionsNotify });
  };

  const getOfferListFirstTime = () => {
    setTabIndex(1);
    getOfferNotificationList({ ...initRequestOffersNotify });
    setRequestOfferParams({ ...initRequestOffersNotify });
  };

  useEffect(() => {
    if (notificationListRef.current) {
      // header motion...
      notificationListRef.current.addEventListener('touchmove', handleAppNotificationTouchMove);
    }
    return () =>
      notificationListRef.current &&
      notificationListRef.current.removeEventListener('touchmove', handleAppNotificationTouchMove);
  }, [tabIndex, notificationListRef.current]);

  useEffect(() => {
    // benefitDetailRef.current?.scrollTop = 0;
    if (!showPromotionDetail) {
      setTimeout(() => {
        setCurrentPromotionDetail(EMPTY_OBJ);
      }, 200);
    }
  }, [showPromotionDetail]);

  const handleAppNotificationTouchMove = () => {
    /* When the user touch to the bottom of the checking list or offer list, fetch more data */
    if (tabIndex === 0 || tabIndex === 1) {
      fetchDataWhenScrollBottom();
    }
  };

  const fetchDataWhenScrollBottom = () => {
    const elementScroll = notificationListRef.current;
    const listAllItem = document.querySelectorAll('.notification');
    const lastItemEle = listAllItem.length ? listAllItem[listAllItem.length - 1] : null;

    const elementScrollOffset = elementScroll.scrollTop;
    const elementScrollHeight = elementScroll.clientHeight;
    const paddingEleStr = window.getComputedStyle(elementScroll).paddingBottom;
    const paddingEleNumber = +paddingEleStr.substring(0, paddingEleStr.length - 2);
    const lastRowOffset = lastItemEle.offsetTop + lastItemEle.clientHeight + paddingEleNumber;
    if (lastRowOffset > Math.floor(elementScrollOffset + elementScrollHeight + 1)) {
      setLoadMoreNotify(false);
    } else {
      setLoadMoreNotify(true);
    }
  };

  useEffect(() => {
    loadMoreNotify && fetchMoreListNotify();
  }, [loadMoreNotify]);

  const fetchMoreListNotify = () => {
    if (tabIndex === 0) {
      const newListChecking = {
        ...requestTransactionParams,
        inq_cnt:
          listTransactionCount !== 0 ? (requestTransactionParams.inq_cnt += 50) : requestTransactionParams.inq_cnt,
      };
      getTransactionNotificationList(newListChecking);
      setRequestTransactionParams(newListChecking);
    } else if (tabIndex === 1) {
      const newListOffer = {
        ...requestOfferParams,
        inq_cnt: listOfferCount !== 0 ? (requestOfferParams.inq_cnt += 50) : requestOfferParams.inq_cnt,
      };
      getOfferNotificationList(newListOffer);
      setRequestOfferParams(newListOffer);
    }
  };

  // const moveToAccountDetailScreen = (screenType, accountNumber) => {
  //   const accountNumberParam = JSON.stringify({
  //     lcl_acno: accountNumber,
  //   });
  //   if (screenType === 1) {
  //     moveNext(MENU_CODE.CHECKING, { param: accountNumberParam });
  //   } else if (screenType === 2) {
  //     moveNext(MENU_CODE.TIME_DEPOSIT, { param: accountNumberParam });
  //   } else if (screenType === 3) {
  //     moveNext(MENU_CODE.INSTALLMENT_DEPOSIT, { param: accountNumberParam });
  //   }
  //   return;
  // };

  const handleViewPromotionDetail = data => {
    setShowPromotionDetail(true);
    setCurrentPromotionDetail(data);
  };

  // add button Try it now
  // const handleClickTryItNow = () => {
  //   if (!currentBenefitDetail.link_url) return;
  //   if (currentBenefitDetail.infomgt_link === '4') {
  //     setReduxTabIndex(tabIndex);
  //     showPDFView(currentBenefitDetail.link_url);
  //   } else if (
  //     currentBenefitDetail.infomgt_link === '1' ||
  //     currentBenefitDetail.infomgt_link === '2' ||
  //     currentBenefitDetail.infomgt_link === '3'
  //   ) {
  //     setReduxTabIndex(tabIndex);
  //     moveNext(currentBenefitDetail.link_url);
  //   } else {
  //     return;
  //   }
  // };

  const handleTabChange = (tabName, tabIndex) => {
    setTabIndex(tabIndex);
    if (tabIndex === NotificationTabIndex.TRANSACTIONS && !listTransactionNotify?.length) {
      getTransactionNotificationList({
        ...requestTransactionParams,
      });
    } else if (tabIndex === NotificationTabIndex.OFFERS && !listOfferNotify?.length) {
      getOfferNotificationList({
        ...requestOfferParams,
      });
    } else if (tabIndex === NotificationTabIndex.PROMOTIONS && !listPromotionNotify?.length) {
      getPromotionNotificationList();
    }
  };

  // const benefitBottomScroll = () => {
  //   const scrollTop = benefitDetailRef.current.scrollTop;
  //   if (scrollTop > 20) {
  //     setBenenefitDetailScroll('btsheet_detail_scroll');
  //   } else {
  //     setBenenefitDetailScroll('');
  //   }
  // };

  // const checkEventTime = date => {
  //   if (!date) return;
  //   const distanceDate = totalNumOfDaysBetweenDates(date);

  //   // show event time remaining within the last 31 days..
  //   if (distanceDate >= 0 && distanceDate < 31) {
  //     setEventDayRemain(distanceDate);
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const refeshLoginState = () => {
    setTimeout(() => {
      setReduxTabIndex(undefined);
      setBannerSeqState('');
      setLoginState('');
    }, 500);
  };

  // const timeEventLabelJSX = useMemo(() => {
  //   if (showPromotionDetail) {
  //     return (
  //       checkEventTime(currentBenefitDetail.banner_per_to) && (
  //         <Label
  //           clazz={benenefitDetailScroll}
  //           label={`D-${eventDayRemain}`}
  //           variant="primary"
  //         />
  //       )
  //     );
  //   }
  // }, [showPromotionDetail, eventDayRemain]);

  console.log('loadPromotionState :>> ', loadPromotionState);
  console.log('listPromotionNotify :>> ', listPromotionNotify);

  return (
    <div className="notification__wrapper">
      {loadTransactionState && !listTransactionNotify?.length && <Spinner />}
      {loadOfferState && !listOfferNotify?.length && <Spinner />}
      {loadPromotionState && !listPromotionNotify?.length && <Spinner />}
      <div className="notification__header">
        <Header
          title="App Notifications"
          onClick={() => {
            moveBack();
            refeshLoginState();
          }}
        />
      </div>
      <div className="notification__content">
        <Tabs
          tabList={[
            {
              title: NotificationTabLabel.TRANSACTIONS,
            },
            {
              title: NotificationTabLabel.OFFERS,
            },
            {
              title: NotificationTabLabel.PROMOTIONS,
            },
          ]}
          isLoginAlready={!isLogin}
          tabIndex={tabIndex}
          onTabChange={handleTabChange}
        >
          {!isLogin ? (
            <>
              {tabIndex === NotificationTabIndex.TRANSACTIONS && (
                <TransactionsTab
                  ref={notificationListRef}
                  transactionList={listTransactionNotify}
                />
              )}
              {tabIndex === NotificationTabIndex.OFFERS && (
                <YourOffersTab
                  ref={notificationListRef}
                  offerList={listOfferNotify}
                />
              )}
              {tabIndex === NotificationTabIndex.PROMOTIONS && (
                <PromotionsTab
                  ref={notificationListRef}
                  promotionList={listPromotionNotify}
                  onClick={handleViewPromotionDetail}
                  currentLang={currentLang}
                />
              )}
            </>
          ) : (
            <PromotionsTab
              ref={notificationListRef}
              promotionList={listPromotionNotify}
              onClick={handleViewPromotionDetail}
              currentLang={currentLang}
            />
          )}
        </Tabs>

        {/* Promotion detail */}
        {/* <BottomSheet
          clazz="notification__bottom__sheet"
          type="max"
          open={showBenefitDetail}
          onClose={() => {
            setShowBenefitDetail(false);
          }}
        >
          <section className="benefit__detail__header">
            <div className={`top ${benenefitDetailScroll}`}>
              <div className="top__info">
                {timeEventLabelJSX}
                <div className="time">
                  <Span
                    clazz="time__start"
                    text={formatDate(currentBenefitDetail.banner_per_from)}
                  />
                  <Span text="-" />
                  <Span
                    clazz="time__end"
                    text={formatDate(currentBenefitDetail.banner_per_to)}
                  />
                </div>
              </div>
            </div>
            <div className="title">
              <Span text={parserDataToHtml(currentBenefitDetail[`banner_main_content_${currentLang}`])} />
            </div>
          </section>

          <section
            className="benefit__detail__content"
            ref={benefitDetailRef}
            onScroll={benefitBottomScroll}
          >
            <div className="benefit__detail__promotions">
              <Image
                src={imgSrcDetected(
                  AppCfg.BASE_URL_IMAGE,
                  currentBenefitDetail[`banner_bottom_promotion_url_${currentLang}`]
                )}
                alt="benefit_promotion"
              />
              <Span text={parserDataToHtml(currentBenefitDetail[`banner_sub_content_${currentLang}`])} />
              <div className="btn__wrapper">
                <button
                  className="btn__try__it__now"
                  onClick={handleClickTryItNow}
                >
                  {translate('lbl_cta_3247')}
                </button>
              </div>
            </div>
          </section>
        </BottomSheet> */}
      </div>
      {/* show alert notify when get data failed */}
      {showPromotionDetail && (
        <PromotionDetailBottom
          onClose={() => setShowPromotionDetail(false)}
          onClickSubmit={() => {}}
          data={currentPromotionDetail}
        />
      )}
      {/* <Alert
        isCloseButton={false}
        isShowAlert={checkingLoadErrors || benefitsLoadErrors}
        subtitle={checkingLoadErrors?.msgText || benefitsLoadErrors?.msgText}
        alertType={checkingLoadErrors?.msgType || benefitsLoadErrors?.msgType}
        firstButton={{
          onClick: () => alertMove(checkingLoadErrors?.msgId),
          label: translate('lbl_cta_3006'),
        }}
      /> */}
      {loadMoreNotify && loadTransactionState && listTransactionNotify.length > 0 && <LoadingInfinite />}
      {loadMoreNotify && loadOfferState && listOfferNotify.length > 0 && <LoadingInfinite />}
    </div>
  );
};

export default withHTMLParseI18n(AppNotifications);
