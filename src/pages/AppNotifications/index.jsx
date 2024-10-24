import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import LoadingInfinite from '@common/components/atoms/LoadingInfinite';
import Spinner from '@common/components/atoms/Spinner';
import Tabs from '@common/components/atoms/Tabs';
import Header from '@common/components/organisms/Header';
import { MENU_CODE } from '@common/constants/common';
import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import { menuLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useLoginInfo from '@hooks/useLoginInfo';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { alertMove } from '@utilities/alertMove';
import { addDateWithMonth } from '@utilities/dateTimeUtils';
import openInternalWebview from '@utilities/gmCommon/openInternalWebview';
import { getLanguageFM, moveBack, moveNext } from '@utilities/index';
import { setIsNativeClickBack } from 'app/redux/action';
import { appLanguage, backEventSelector, nativeParamsSelector, nativeRedirectStateSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

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
  setTabIndex as setReduxTabIndex,
} from './redux/action';
import { appNotificationReducer } from './redux/reducer';
import { appNotificationSaga } from './redux/saga';
import {
  listOfferLoadMoreCnt,
  listTransactionLoadMoreCnt,
  offerList,
  offerLoadFailed,
  offerLoadState,
  tabIdx,
  transactionList,
  transactionLoadFailed,
  transactionLoadState,
} from './redux/selector';
import { AppNotificationFeatureName } from './redux/type';

//TODO: Refactor code, not use redux
const AppNotifications = ({ translate: t }) => {
  useReducers([{ key: AppNotificationFeatureName, reducer: appNotificationReducer }]);
  useSagas([{ key: AppNotificationFeatureName, saga: appNotificationSaga }]);
  const [showLoading, setShowLoading] = useState(false);
  const appLang = useSelector(appLanguage);
  const listTransactionCount = useSelector(listTransactionLoadMoreCnt);
  const listOfferCount = useSelector(listOfferLoadMoreCnt);
  const reduxTabIndex = useSelector(tabIdx);
  const [tabIndex, setTabIndex] = useState(reduxTabIndex);
  const [showPromotionDetail, setShowPromotionDetail] = useState(false);
  const [currentPromotionDetail, setCurrentPromotionDetail] = useState({});
  const [loadMoreNotify, setLoadMoreNotify] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const { isLogin, isLoading: isLoadingCheckUserLogin } = useLoginInfo();
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const { requestApi } = useApi();
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
  const loadTransactionState = useSelector(transactionLoadState);
  const loadOfferState = useSelector(offerLoadState);
  const transactionLoadErrors = useSelector(transactionLoadFailed);
  const offerLoadErrors = useSelector(offerLoadFailed);
  const isNativeRedirect = useSelector(nativeRedirectStateSelector || false);
  const nativeParams = useSelector(nativeParamsSelector);
  const currentLang = getLanguageFM(appLang, false);
  const isNativeBack = useSelector(backEventSelector || false);

  const getTransactionListFirstTime = () => {
    getTransactionNotificationList({ ...initRequestTransactionsNotify });
    setRequestTransactionParams({ ...initRequestTransactionsNotify });
  };

  const getOfferListFirstTime = () => {
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
      openInternalWebview({
        url: linkUrl,
        title: '',
      });
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
    } else if (tabIndex === NotificationTabIndex.PROMOTIONS && !promotions?.length) {
      getPromotionNotificationList();
    }
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

  const moveToAccountDetailScreen = (screenType, accountNumber) => {
    const accountNumberParam = JSON.stringify({
      lcl_acno: accountNumber,
    });
    let menuCode = '';
    if (screenType === DepositSubjectClass.REGULAR_SAVING) {
      menuCode = MENU_CODE.ACCOUNT_ACTIVITY_BANKING;
    } else if ([DepositSubjectClass.INSTALLMENT_SAVING, DepositSubjectClass.TERM_DEPOSIT_GIC].includes(screenType)) {
      menuCode = MENU_CODE.ACCOUNT_ACTIVITY_INVESTMENT;
    }
    if (menuCode) {
      moveNext(menuCode, { param: accountNumberParam });
    }
    return;
  };

  const handleClickTransaction = data => {
    const screenType = data?.dep_sjt_class;
    const accountNumber = data?.ums_ntc_acno;
    setReduxTabIndex(tabIndex);
    moveToAccountDetailScreen(screenType, accountNumber);
  };

  const requestGetPromotionList = async () => {
    if (promotions?.length) {
      return;
    }
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getPromotionNotify);
    setShowLoading(false);
    if (isSuccess) {
      // display only "display_pos"== "8" and sort with banner_seq big to small
      // 8: Promotion
      const { list = [] } = data || {};
      const filteredPromotion = list.filter(item => {
        return item?.display_pos === '8';
      });
      filteredPromotion.sort((firstData, secondData) => secondData.banner_seq - firstData.banner_seq);
      setPromotions(filteredPromotion);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  useEffect(() => {
    if (isLoadingCheckUserLogin) {
      return;
    }
    let currentTabIndex = NotificationTabIndex.TRANSACTIONS;
    if (nativeParams?.tab) {
      if (nativeParams.tab === '01') {
        currentTabIndex = NotificationTabIndex.TRANSACTIONS;
      } else if (nativeParams.tab === '02') {
        currentTabIndex = NotificationTabIndex.OFFERS;
      } else if (nativeParams.tab === '03') {
        currentTabIndex = NotificationTabIndex.PROMOTIONS;
      }
    } else {
      if (reduxTabIndex !== undefined) {
        currentTabIndex = reduxTabIndex;
      }
    }
    if (!isLogin) {
      currentTabIndex = NotificationTabIndex.PROMOTIONS;
    }
    setTabIndex(currentTabIndex);
    if (currentTabIndex === NotificationTabIndex.TRANSACTIONS) {
      getTransactionListFirstTime();
    } else if (currentTabIndex === NotificationTabIndex.OFFERS) {
      getOfferListFirstTime();
    } else {
      requestGetPromotionList();
    }

    return () => {
      cleanupAppNotification();
    };
  }, [isNativeRedirect, nativeParams, isLoadingCheckUserLogin]);

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
    if (nativeParams?.promotion_seq && promotions) {
      const promotion = promotions.find(item => String(item.banner_seq) === String(nativeParams.promotion_seq));
      if (promotion && tabIndex === NotificationTabIndex.PROMOTIONS) {
        handleViewPromotionDetail(promotion);
      }
    }
  }, [promotions, nativeParams]);

  useEffect(() => {
    //Handle case click back symbol on Android
    if (isNativeBack) {
      if (showPromotionDetail) {
        setShowPromotionDetail(false);
      } else {
        moveBack();
      }
    }
    return () => {
      setIsNativeClickBack(false);
    };
  }, [isNativeBack]);

  return (
    <div className="notification__wrapper">
      {loadTransactionState && !listTransactionNotify?.length && <Spinner />}
      {loadOfferState && !listOfferNotify?.length && <Spinner />}
      {showLoading && <Spinner />}
      <div className="notification__header">
        <Header
          title={t(menuLabels.appNotification)}
          onClick={() => {
            moveBack();
          }}
        />
      </div>
      <div className="notification__content">
        <Tabs
          tabList={[
            {
              title: t(NotificationTabLabel.TRANSACTIONS),
            },
            {
              title: t(NotificationTabLabel.OFFERS),
            },
            {
              title: t(NotificationTabLabel.PROMOTIONS),
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
                  transactionList={listTransactionNotify}
                  onClick={handleClickTransaction}
                  translate={t}
                />
              )}
              {tabIndex === NotificationTabIndex.OFFERS && (
                <YourOffersTab
                  notificationListRef={notificationListRef}
                  offerList={listOfferNotify}
                  translate={t}
                />
              )}
              {tabIndex === NotificationTabIndex.PROMOTIONS && (
                <PromotionsTab
                  ref={notificationListRef}
                  promotionList={promotions}
                  onClick={handleViewPromotionDetail}
                  currentLang={currentLang}
                  translate={t}
                />
              )}
            </>
          ) : (
            <PromotionsTab
              ref={notificationListRef}
              promotionList={promotions}
              onClick={handleViewPromotionDetail}
              currentLang={currentLang}
              translate={t}
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
          translate={t}
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
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        textAlign="left"
        firstButton={{
          onClick: () => setAlert({ isShow: false, title: '', content: '' }),
          label: 'Confirm',
        }}
      />
      {loadMoreNotify && loadTransactionState && listTransactionNotify.length > 0 && <LoadingInfinite />}
      {loadMoreNotify && loadOfferState && listOfferNotify.length > 0 && <LoadingInfinite />}
    </div>
  );
};

export default withHTMLParseI18n(AppNotifications);
