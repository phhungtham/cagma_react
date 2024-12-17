import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import LoadingInfinite from '@common/components/atoms/LoadingInfinite';
import Spinner from '@common/components/atoms/Spinner';
import Tabs from '@common/components/atoms/Tabs';
import Header from '@common/components/organisms/Header';
import { initAlert } from '@common/constants/bottomsheet';
import { MENU_CODE } from '@common/constants/common';
import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, menuLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useLoginInfo from '@hooks/useLoginInfo';
import useMove from '@hooks/useMove';
import openInternalWebview from '@utilities/gmCommon/openInternalWebview';
import { getLanguageFM } from '@utilities/index';
import { setIsNativeClickBack } from 'app/redux/action';
import { appLanguage, backEventSelector, nativeParamsSelector } from 'app/redux/selector';
import dayjs from 'dayjs';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import PromotionDetailBottom from './components/PromotionDetailBottom';
import PromotionsTab from './components/PromotionsTab';
import TransactionsTab from './components/TransactionsTab';
import YourOffersTab from './components/YourOffersTab';
import {
  initRecentMonthNumber,
  initRequestNotification,
  NotificationLinkType,
  NotificationRequestType,
  NotificationTabIndex,
  NotificationTabLabel,
} from './constants';
import { cleanupAppNotification, setTabIndex as setReduxTabIndex } from './redux/action';
import { tabIdx } from './redux/selector';

const AppNotifications = ({ translate: t }) => {
  const appLang = useSelector(appLanguage);
  const reduxTabIndex = useSelector(tabIdx);
  const [tabIndex, setTabIndex] = useState(reduxTabIndex);
  const [showFirstTimeLoading, setShowFirstTimeLoading] = useState(false);
  const [showLoadingMore, setShowLoadingMore] = useState(false);
  const [requestTransactionParams, setRequestTransactionParams] = useState({ ...initRequestNotification });
  const [requestOfferParams, setRequestOfferParams] = useState({ ...initRequestNotification });

  const [promotions, setPromotions] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [offerList, setOfferList] = useState([]);
  const [requestTransactionCount, setRequestTransactionCount] = useState(0);
  const [requestOfferCount, setRequestOfferCount] = useState(0);
  const [showPromotionDetail, setShowPromotionDetail] = useState(false);
  const [triggerFetchMore, setTriggerFetchMore] = useState(false);
  const [currentPromotionDetail, setCurrentPromotionDetail] = useState({});
  const [alert, setAlert] = useState(initAlert);
  const { moveScreenNative, moveBackNative } = useMove();
  const { requestApi } = useApi();
  const { moveInitHomeNative } = useMove();
  const { isLogin, isLoading: isLoadingCheckUserLogin } = useLoginInfo();
  const notificationListRef = useRef(null);

  const nativeParams = useSelector(nativeParamsSelector);
  const currentLang = getLanguageFM(appLang, false);
  const isNativeBack = useSelector(backEventSelector || false);

  const requestGetNotificationList = async (payload, type) => {
    //Only show loading first time
    let isShowLoadMore = false;
    if (type === NotificationRequestType.TRANSACTION && transactionList?.length) {
      isShowLoadMore = true;
    } else if (type === NotificationRequestType.OFFER && offerList?.length) {
      isShowLoadMore = true;
    }
    if (isShowLoadMore) {
      setShowLoadingMore(true);
    } else {
      setShowFirstTimeLoading(true);
    }
    const lastRecentMonths = dayjs().subtract(initRecentMonthNumber, 'month').format('YYYYMMDD');
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.getOffersNotify, {
      ...payload,
      inq_st_dt: lastRecentMonths,
      ums_svc_c: type,
    });
    setShowFirstTimeLoading(false);
    setShowLoadingMore(false);
    if (isSuccess) {
      const { list = [], list_cnt } = data;
      if (type === NotificationRequestType.TRANSACTION) {
        setRequestTransactionCount(list_cnt);
        setTransactionList([...transactionList, ...list]);
      } else if (type === NotificationRequestType.OFFER) {
        setRequestOfferCount(list_cnt);
        setOfferList([...offerList, ...list]);
      }
    } else {
      setAlert({
        isShow: true,
        content: error,
        requiredLogin,
      });
    }
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
      setTriggerFetchMore(false);
    } else {
      setTriggerFetchMore(true);
    }
  };

  const handleViewPromotionDetail = data => {
    setShowPromotionDetail(true);
    setCurrentPromotionDetail(data);
  };

  const handleCloseAlert = () => {
    if (alert.requiredLogin) {
      moveInitHomeNative('initHome');
    }
    setAlert(initAlert);
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
      moveScreenNative(linkUrl);
    } else {
      return;
    }
  };

  const handleTabChange = (tabName, tabIndex) => {
    setTabIndex(tabIndex);
    if (tabIndex === NotificationTabIndex.TRANSACTIONS && !transactionList?.length) {
      requestGetNotificationList(requestTransactionParams, NotificationRequestType.TRANSACTION);
    } else if (tabIndex === NotificationTabIndex.OFFERS && !offerList?.length) {
      requestGetNotificationList(requestOfferParams, NotificationRequestType.OFFER);
    } else if (tabIndex === NotificationTabIndex.PROMOTIONS && !promotions?.length) {
      requestGetPromotionList();
    }
  };

  const fetchMoreNotifications = () => {
    if (tabIndex === NotificationTabIndex.TRANSACTIONS) {
      const params = {
        ...requestTransactionParams,
        inq_cnt:
          requestTransactionCount !== 0 ? (requestTransactionParams.inq_cnt += 50) : requestTransactionParams.inq_cnt,
      };
      requestGetNotificationList(params, NotificationRequestType.TRANSACTION);
      setRequestTransactionParams(params);
    } else if (tabIndex === NotificationTabIndex.OFFERS) {
      const params = {
        ...requestOfferParams,
        inq_cnt: requestOfferCount !== 0 ? (requestOfferParams.inq_cnt += 50) : requestOfferParams.inq_cnt,
      };
      requestGetNotificationList(params, NotificationRequestType.OFFER);
      setRequestOfferParams(params);
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
      moveScreenNative(menuCode, { param: accountNumberParam });
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
    setShowFirstTimeLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getPromotionNotify);
    setShowFirstTimeLoading(false);
    if (isSuccess) {
      // display only "display_pos"== "8", "1", "6" and sort with banner_seq big to small
      // 8: Promotion
      const { list = [] } = data || {};
      const filteredPromotion = list.filter(item => {
        return ['8', '1', '6'].includes(item?.display_pos);
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
    if (triggerFetchMore) {
      fetchMoreNotifications();
    }
  }, [triggerFetchMore]);

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
      requestGetNotificationList(requestTransactionParams, NotificationRequestType.TRANSACTION);
    } else if (currentTabIndex === NotificationTabIndex.OFFERS) {
      requestGetNotificationList(requestOfferParams, NotificationRequestType.OFFER);
    } else {
      requestGetPromotionList();
    }

    return () => {
      cleanupAppNotification();
    };
  }, [nativeParams, isLoadingCheckUserLogin]);

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
        moveBackNative();
      }
    }
    return () => {
      setIsNativeClickBack(false);
    };
  }, [isNativeBack]);

  return (
    <div className="notification__wrapper">
      {showFirstTimeLoading && <Spinner />}
      <div className="notification__header">
        <Header title={t(menuLabels.appNotification)} />
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
                  transactionList={transactionList}
                  onClick={handleClickTransaction}
                  showLoading={showFirstTimeLoading}
                  translate={t}
                />
              )}
              {tabIndex === NotificationTabIndex.OFFERS && (
                <YourOffersTab
                  notificationListRef={notificationListRef}
                  offerList={offerList}
                  showLoading={showFirstTimeLoading}
                  translate={t}
                />
              )}
              {tabIndex === NotificationTabIndex.PROMOTIONS && (
                <PromotionsTab
                  ref={notificationListRef}
                  promotionList={promotions}
                  onClick={handleViewPromotionDetail}
                  currentLang={currentLang}
                  showLoading={showFirstTimeLoading}
                  translate={t}
                />
              )}
            </>
          ) : (
            <PromotionsTab
              fullContent
              ref={notificationListRef}
              promotionList={promotions}
              onClick={handleViewPromotionDetail}
              currentLang={currentLang}
              showLoading={showFirstTimeLoading}
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
      {showLoadingMore && <LoadingInfinite />}
    </div>
  );
};

export default withHTMLParseI18n(AppNotifications);
