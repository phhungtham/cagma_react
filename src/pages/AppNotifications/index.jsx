import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import LoadingInfinite from '@common/components/atoms/LoadingInfinite';
import Spinner from '@common/components/atoms/Spinner';
import Alert from '@common/components/molecules/Alert';
import Tabs from '@common/components/molecules/Tabs';
import Header from '@common/components/organisms/Header';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { alertMove } from '@utilities/alertMove';
import { addDateWithMonth } from '@utilities/dateTimeUtils';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { getLanguageFM, isEmpty, moveBack, moveNext } from '@utilities/index';
import { setIsNativeClickBack, setLoginState } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import {
  appLanguage,
  appPathSelector,
  backEventSelector,
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
import {
  initRecentMonthNumber,
  NotificationLinkType,
  NotificationRequestType,
  NotificationTabIndex,
  NotificationTabLabel,
} from './constants';
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
  bannerSeqState,
  listOfferLoadMoreCnt,
  listTransactionLoadMoreCnt,
  offerList,
  offerLoadFailed,
  offerLoadState,
  promotionList,
  promotionLoadState,
  tabIdx,
  transactionList,
  transactionLoadFailed,
  transactionLoadState,
} from './redux/selector';
import { AppNotificationFeatureName } from './redux/type';

//TODO: Test case add params ums_svc_c and native params when login
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
  const [loadMoreNotify, setLoadMoreNotify] = useState(false);
  const [promotionListDisplay, setPromotionListDisplay] = useState([]);
  const isLogin = useSelector(loginSelector) || true;
  const notificationListRef = useRef(null);

  const initRequestTransactionsNotify = {
    push_lang_c: null,
    inq_cnt: 0,
    inq_st_dt: addDateWithMonth(initRecentMonthNumber),
    ums_svc_c: NotificationRequestType.TRANSACTION,
  };

  const initRequestOffersNotify = {
    push_lang_c: null,
    inq_cnt: 0,
    inq_st_dt: addDateWithMonth(initRecentMonthNumber),
    ums_svc_c: NotificationRequestType.OFFER,
  };

  const [requestTransactionParams, setRequestTransactionParams] = useState({ ...initRequestTransactionsNotify });
  const [requestOfferParams, setRequestOfferParams] = useState({ ...initRequestOffersNotify });

  // selectors
  const listTransactionNotify = useSelector(transactionList) || [];
  const listOfferNotify = useSelector(offerList) || [];
  const listPromotionNotify = useSelector(promotionList) || [];
  const loadTransactionState = useSelector(transactionLoadState);
  const loadOfferState = useSelector(offerLoadState);
  const loadPromotionState = useSelector(promotionLoadState);
  const loadBannerSeq = useSelector(bannerSeqState);
  const transactionLoadErrors = useSelector(transactionLoadFailed);
  const offerLoadErrors = useSelector(offerLoadFailed);
  const isNativeRedirect = useSelector(nativeRedirectStateSelector || false);
  const nativeParams = useSelector(nativeParamsSelector);
  const currentLang = getLanguageFM(appLang, false);
  const appPath = useSelector(appPathSelector);
  const isNativeBack = useSelector(backEventSelector || false);

  const getTransactionListFirstTime = () => {
    setTabIndex(NotificationTabIndex.TRANSACTIONS);
    getTransactionNotificationList({ ...initRequestTransactionsNotify });
    setRequestTransactionParams({ ...initRequestTransactionsNotify });
  };

  const getOfferListFirstTime = () => {
    setTabIndex(NotificationTabIndex.OFFERS);
    getOfferNotificationList({ ...initRequestOffersNotify });
    setRequestOfferParams({ ...initRequestOffersNotify });
  };

  const handleAppNotificationTouchMove = () => {
    /* When the user touch to the bottom of the checking list or offer list, fetch more data */
    if (tabIndex === NotificationTabIndex.TRANSACTIONS || tabIndex === NotificationTabIndex.OFFERS) {
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

  const handleViewPromotionDetail = data => {
    setShowPromotionDetail(true);
    setCurrentPromotionDetail(data);
  };

  const handleClickTryItNow = () => {
    const { infomgt_link: linkType, link_url: linkUrl } = currentPromotionDetail || {};
    if (!linkUrl) return;
    if (NotificationLinkType.EXTERNAL_LINK.includes(linkType)) {
      setReduxTabIndex(tabIndex);
      openURLInBrowser(linkUrl);
    } else if (NotificationLinkType.INTERNAL_LINK.includes(linkType)) {
      setReduxTabIndex(tabIndex);
      moveNext(linkUrl);
    } else {
      return;
    }
  };

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

  const refreshLoginState = () => {
    setTimeout(() => {
      setReduxTabIndex(undefined);
      setBannerSeqState('');
      setLoginState('');
    }, 500);
  };

  const fetchMoreListNotify = () => {
    if (tabIndex === NotificationTabIndex.TRANSACTIONS) {
      const newListChecking = {
        ...requestTransactionParams,
        inq_cnt:
          listTransactionCount !== 0 ? (requestTransactionParams.inq_cnt += 50) : requestTransactionParams.inq_cnt,
      };
      getTransactionNotificationList(newListChecking);
      setRequestTransactionParams(newListChecking);
    } else if (tabIndex === NotificationTabIndex.OFFERS) {
      const newListOffer = {
        ...requestOfferParams,
        inq_cnt: listOfferCount !== 0 ? (requestOfferParams.inq_cnt += 50) : requestOfferParams.inq_cnt,
      };
      getOfferNotificationList(newListOffer);
      setRequestOfferParams(newListOffer);
    }
  };

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
      if (!isLogin) {
        setTabIndex(NotificationTabIndex.PROMOTIONS);
        getPromotionNotificationList();
      } else {
        getTransactionListFirstTime();
        setRequestOfferParams({ ...initRequestOffersNotify }); // reset offer request data
      }
    }
    return () => {
      cleanupAppNotification();
    };
  }, [isNativeRedirect, nativeParams, appPath]);

  useEffect(() => {
    // handle case receive push notify and show tab...
    if (isEmpty(nativeParams) || nativeParams === undefined || reduxTabIndex !== undefined) return;
    switch (nativeParams?.ums_svc_c) {
      case NotificationRequestType.PROMOTION:
        setTabIndex(NotificationTabIndex.PROMOTIONS);
        getPromotionNotificationList();
        break;
      case NotificationRequestType.OFFER:
        getOfferListFirstTime();
        break;
      case NotificationRequestType.TRANSACTION:
      case null:
      default:
        getTransactionListFirstTime();
        break;
    }
    return () => {
      cleanupAppNotification();
    };
  }, [nativeParams]);

  useEffect(() => {
    if (notificationListRef.current) {
      // header motion...
      notificationListRef.current.addEventListener('scroll', handleAppNotificationTouchMove);
    }
    return () =>
      notificationListRef.current &&
      notificationListRef.current.removeEventListener('scroll', handleAppNotificationTouchMove);
  }, [tabIndex, notificationListRef.current]);

  useEffect(() => {
    loadMoreNotify && fetchMoreListNotify();
  }, [loadMoreNotify]);

  useEffect(() => {
    // display only "display_pos"== "8" and sort with banner_seq big to small
    // 8: Promotion
    if (!listPromotionNotify) return;
    if (tabIndex === NotificationTabIndex.PROMOTIONS) {
      const filteredPromotion = listPromotionNotify.filter(item => {
        return item?.display_pos === '8';
      });
      filteredPromotion.sort((firstData, secondData) => secondData.banner_seq - firstData.banner_seq);
      setPromotionListDisplay(filteredPromotion);
    }
  }, [tabIndex, listPromotionNotify]);

  useEffect(() => {
    if (nativeParams !== undefined && !isEmpty(nativeParams) && promotionListDisplay && loadBannerSeq === '') {
      const promotion = promotionListDisplay.find(e => e.banner_seq.toString() === nativeParams?.banner_seq_benefit);
      if (promotion && tabIndex === 2) {
        handleViewPromotionDetail(promotion);
        setBannerSeqState(promotion.banner_seq.toString());
      }
    }
  }, [promotionListDisplay, nativeParams]);

  useEffect(() => {
    if (showPromotionDetail && isNativeBack) {
      setShowPromotionDetail(false);
    }
    if (!showPromotionDetail && isNativeBack) {
      moveBack();
      refreshLoginState();
    }
    return () => {
      setIsNativeClickBack(false);
    };
  }, [isNativeBack, showPromotionDetail]);

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
            refreshLoginState();
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
          isLoginAlready={isLogin}
          tabIndex={tabIndex}
          onTabChange={handleTabChange}
        >
          {isLogin ? (
            <>
              {tabIndex === NotificationTabIndex.TRANSACTIONS && (
                <TransactionsTab
                  notificationListRef={notificationListRef}
                  transactionList={[...listTransactionNotify, ...listTransactionNotify]}
                />
              )}
              {tabIndex === NotificationTabIndex.OFFERS && (
                <YourOffersTab
                  notificationListRef={notificationListRef}
                  offerList={listOfferNotify}
                />
              )}
              {tabIndex === NotificationTabIndex.PROMOTIONS && (
                <PromotionsTab
                  ref={notificationListRef}
                  promotionList={promotionListDisplay}
                  onClick={handleViewPromotionDetail}
                  currentLang={currentLang}
                />
              )}
            </>
          ) : (
            <PromotionsTab
              ref={notificationListRef}
              promotionList={promotionListDisplay}
              onClick={handleViewPromotionDetail}
              currentLang={currentLang}
            />
          )}
        </Tabs>
      </div>
      {/* show alert notify when get data failed */}
      {showPromotionDetail && (
        <PromotionDetailBottom
          onClose={() => setShowPromotionDetail(false)}
          onClickTry={handleClickTryItNow}
          data={currentPromotionDetail}
          currentLang={currentLang}
        />
      )}
      <Alert
        isCloseButton={false}
        isShowAlert={transactionLoadErrors || offerLoadErrors}
        subtitle={transactionLoadErrors?.msgText || offerLoadErrors?.msgText}
        firstButton={{
          onClick: () => alertMove(transactionLoadErrors?.msgId),
          label: 'Confirm',
        }}
      />
      {loadMoreNotify && loadTransactionState && listTransactionNotify.length > 0 && <LoadingInfinite />}
      {loadMoreNotify && loadOfferState && listOfferNotify.length > 0 && <LoadingInfinite />}
    </div>
  );
};

export default withHTMLParseI18n(AppNotifications);
