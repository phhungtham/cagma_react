import Alert from '@common/ui/components/atomic/Alert/Alert';
import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import Image from '@common/ui/components/atomic/Image';
import Label from '@common/ui/components/atomic/Label';
import LoadingInfinite from '@common/ui/components/atomic/LoadingInfinite';
import Notification from '@common/ui/components/atomic/Notification';
import Span from '@common/ui/components/atomic/Span';
import Spinner from '@common/ui/components/atomic/Spinner';
import Tabs from '@common/ui/components/atomic/Tabs';
import Header from '@common/ui/components/Header';
import { detectIconNotifyType, detectNotifyStatus } from '@common/utils/detect';
import { formatDate } from '@common/utils/formater';
import { AppCfg } from '@configs/appConfigs';
import { EMPTY_OBJ, MENU_CODE } from '@configs/global/constants';
import useLoginInfo from '@hooks/useLoginInfo';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { imgSrcDetected, parserDataToHtml, scrollImpact } from '@utilities';
import { alertMove } from '@utilities/alertMove';
import { addDateWithMonth, totalNumOfDaysBetweenDates } from '@utilities/dateTimeUtils';
import { getLanguageFM, isEmpty, moveBack, moveNext } from '@utilities/index';
import { setIsNativeClickBack, setLoginState } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import {
  appLanguage,
  appPathSelector,
  backEventSelector,
  loginSelector,
  nativeParamsSelector,
  nativeRedirectStateSelector
} from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { APP_GLOBAL } from '../../app/redux/type';
import no_notification from '../../assets/images/no-result.png';
import {
  cleanupAppNotification,
  getBenefitNotificationList,
  getCheckingNotificationList,
  getNoticesNotificationList,
  setBannerSeqState,
  setTabIndex as setReduxTabIndex
} from './redux/action';
import { appNotificationReducer } from './redux/reducer';
import { appNotificationSaga } from './redux/saga';
import {
  bannerSeqState,
  benefitList,
  benefitsLoadFailed,
  benefitsLoadState,
  checkingList,
  checkingLoadFailed,
  checkingLoadState,
  listCheckingLoadMoreCnt,
  listNoticesLoadMoreCnt,
  noticesList,
  noticesLoadFailed,
  noticesLoadState,
  tabIdx
} from './redux/selector';
import { FeatureAppNotificationName } from './redux/type';
import showPDFView from '@utilities/gmCommon/showPDFView';

const AppNotifications = ({ translate }) => {
  const TABS = {
    CHECKING: translate('lbl_BHO2020001_0001'),
    NOTICES: translate('lbl_BHO2020001_0004'),
    BENEFITS: translate('lbl_BHO2020001_0002')
  };

  useReducers([
    { key: FeatureAppNotificationName, reducer: appNotificationReducer },
    { key: APP_GLOBAL, reducer: appGlobalReducer }
  ]);
  useSagas([{ key: FeatureAppNotificationName, saga: appNotificationSaga }]);
  const appLang = useSelector(appLanguage);
  const listCheckingCount = useSelector(listCheckingLoadMoreCnt);
  const listNoticesCount = useSelector(listNoticesLoadMoreCnt);
  const reduxTabIndex = useSelector(tabIdx);
  const [tabIndex, setTabIndex] = useState(reduxTabIndex);
  const [showBenefitDetail, setShowBenefitDetail] = useState(false);
  const [currentBenefitDetail, setCurrentBenefitDetail] = useState({});
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);
  const [eventDayRemain, setEventDayRemain] = useState(0);
  const [loadMoreNotify, setLoadMoreNotify] = useState(false);
  const [benenefitDetailScroll, setBenenefitDetailScroll] = useState('');
  const [benefitListDisplay, setBenefitListDisplay] = useState([]);
  const { isLoading } = useLoginInfo({ isSend: true });
  const isLogin = useSelector(loginSelector);
  const benefitDetailRef = useRef(null);
  const notificationListRef = useRef(null);

  const initRequestCheckingNotify = {
    push_lang_c: null,
    inq_cnt: 0,
    inq_st_dt: addDateWithMonth(3),
    ums_svc_c: '01'
  };

  const initRequestNoticesNotify = {
    push_lang_c: null,
    inq_cnt: 0,
    inq_st_dt: addDateWithMonth(3),
    ums_svc_c: '10'
  };

  const [reqDataChecking, setReqDataChecking] = useState({ ...initRequestCheckingNotify });
  const [reqDataNotices, setReqDataNotices] = useState({ ...initRequestNoticesNotify });

  // selectors
  const listCheckingNotiy = useSelector(checkingList) || [];
  const listNoticesNotiy = useSelector(noticesList) || [];
  const listBenefitNotify = useSelector(benefitList) || [];
  const loadCheckingState = useSelector(checkingLoadState);
  const loadNoticesState = useSelector(noticesLoadState);
  const loadBenefitState = useSelector(benefitsLoadState);
  const checkingLoadErrors = useSelector(checkingLoadFailed);
  const noticesLoadErrors = useSelector(noticesLoadFailed);
  const benefitsLoadErrors = useSelector(benefitsLoadFailed);
  const isNativeRedirect = useSelector(nativeRedirectStateSelector || false);
  const isNativeBack = useSelector(backEventSelector || false);
  const nativeParams = useSelector(nativeParamsSelector);
  const currentLang = getLanguageFM(appLang, false);
  const appPath = useSelector(appPathSelector);
  const loadBannerSeq = useSelector(bannerSeqState);

  useEffect(() => {
    if (appPath !== '/notification') return; //(Update) No need to check isLogin info anymore, user have to login first in order to access Home App Noti screen
    // setShowBenefitDetail(false);
    if (reduxTabIndex !== undefined) {
      switch (reduxTabIndex) {
        case 0:
          firstLoadCheckingList();
          break;
        case 1:
          firstLoadNoticesList();
          break;
        case 2:
          setTabIndex(2);
          getBenefitNotificationList();
          break;
        default:
          break;
      }
      return;
    }
    if (isEmpty(nativeParams)) {
      firstLoadCheckingList();
      setReqDataNotices({ ...initRequestNoticesNotify }); // reset notice request data
    }
    return () => {
      cleanupAppNotification();
    };
  }, [isNativeRedirect, nativeParams, appPath]);

  useEffect(() => {
    // handle case receive push notify and show tab...
    // ums_svc_c : 6 - Benefit tab
    // ums_svc_c : 1 - Checking tab
    // ums_svc_c : 10 - Notices tab
    // ums_svc_c : null - Checking tab
    if (isEmpty(nativeParams) || nativeParams === undefined || reduxTabIndex !== undefined) return;
    switch (nativeParams?.ums_svc_c) {
      case '06':
        setTabIndex(2);
        getBenefitNotificationList();
        break;
      case '10':
        firstLoadNoticesList();
        break;
      case '01':
      case null:
      default:
        firstLoadCheckingList();
        break;
    }
    return () => {
      cleanupAppNotification();
    };
  }, [nativeParams]);

  const firstLoadCheckingList = () => {
    setTabIndex(0);
    getCheckingNotificationList({ ...initRequestCheckingNotify });
    setReqDataChecking({ ...initRequestCheckingNotify });
  };

  const firstLoadNoticesList = () => {
    setTabIndex(1);
    getNoticesNotificationList({ ...initRequestNoticesNotify });
    setReqDataNotices({ ...initRequestNoticesNotify });
  };

  useEffect(() => {
    // display only "display_pos"== "8" and sort with banner_seq big to small
    // 8: Benefits
    if (!listBenefitNotify) return;
    if (tabIndex === 2) {
      const displayPost = listBenefitNotify.filter(item => {
        return item?.display_pos === '8';
      });
      const postSortList = displayPost.sort((firstData, secondData) => secondData.banner_seq - firstData.banner_seq);
      postSortList.length > 0 && setBenefitListDisplay(postSortList);
    }
  }, [tabIndex, listBenefitNotify]);

  useEffect(() => {
    if (nativeParams !== undefined && !isEmpty(nativeParams) && benefitListDisplay && loadBannerSeq === '') {
      const benefit = benefitListDisplay.find(e => e.banner_seq.toString() === nativeParams?.banner_seq_benefit);
      if (benefit && tabIndex === 2) {
        handleNotificationClick(benefit);
        setBannerSeqState(benefit.banner_seq.toString());
      }
    }
  }, [benefitListDisplay, nativeParams]);

  useEffect(() => {
    if (showBenefitDetail && isNativeBack) {
      setShowBenefitDetail(false);
    }
    if (!showBenefitDetail && isNativeBack) {
      moveBack();
      refeshLoginState();
    }
    return () => {
      setIsNativeClickBack(false);
    };
  }, [isNativeBack, showBenefitDetail]);

  useEffect(() => {
    setIsHeaderExpand(false);
    if (notificationListRef.current) {
      // header motion...
      notificationListRef.current.addEventListener('scroll', () => {
        scrollImpact(notificationListRef.current, setIsHeaderExpand);
      });
      notificationListRef.current.addEventListener('touchmove', handleAppNotificationTouchMove);
    }
    return () =>
      notificationListRef.current &&
      notificationListRef.current.removeEventListener('touchmove', handleAppNotificationTouchMove);
  }, [tabIndex, notificationListRef.current]);

  useEffect(() => {
    benefitDetailRef.current.scrollTop = 0;
    if (!showBenefitDetail) {
      setTimeout(() => {
        setCurrentBenefitDetail(EMPTY_OBJ);
      }, 200);
    }
  }, [showBenefitDetail]);

  const handleAppNotificationTouchMove = () => {
    /* When the user touch to the bottom of the checking list or notice list, fetch more data */
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
        ...reqDataChecking,
        inq_cnt: listCheckingCount !== 0 ? (reqDataChecking.inq_cnt += 50) : reqDataChecking.inq_cnt
      };
      getCheckingNotificationList(newListChecking);
      setReqDataChecking(newListChecking);
    } else if (tabIndex === 1) {
      const newListNotices = {
        ...reqDataNotices,
        inq_cnt: listNoticesCount !== 0 ? (reqDataNotices.inq_cnt += 50) : reqDataNotices.inq_cnt
      };
      getNoticesNotificationList(newListNotices);
      setReqDataNotices(newListNotices);
    }
  };

  const moveToAccountDetailScreen = (screenType, accountNumber) => {
    const accountNumberParam = JSON.stringify({
      lcl_acno: accountNumber
    });
    if (screenType === 1) {
      moveNext(MENU_CODE.CHECKING, { param: accountNumberParam });
    } else if (screenType === 2) {
      moveNext(MENU_CODE.TIME_DEPOSIT, { param: accountNumberParam });
    } else if (screenType === 3) {
      moveNext(MENU_CODE.INSTALLMENT_DEPOSIT, { param: accountNumberParam });
    }
    return;
  };

  const handleNotificationClick = data => {
    if (tabIndex === 0) {
      const screenType = Number(data?.dep_sjt_class);
      const accountNumber = data?.ums_ntc_acno;
      setReduxTabIndex(tabIndex);
      moveToAccountDetailScreen(screenType, accountNumber);
    }
    if (tabIndex === 2) {
      setShowBenefitDetail(true);
      setCurrentBenefitDetail(data);
    }
  };
  // add button Try it now
  const handleClickTryItNow = () => {
    if (!currentBenefitDetail.link_url) return;
    if (currentBenefitDetail.infomgt_link === '4') {
      setReduxTabIndex(tabIndex);
      showPDFView(currentBenefitDetail.link_url);
    } else if (
      currentBenefitDetail.infomgt_link === '1' ||
      currentBenefitDetail.infomgt_link === '2' ||
      currentBenefitDetail.infomgt_link === '3'
    ) {
      setReduxTabIndex(tabIndex);
      moveNext(currentBenefitDetail.link_url);
    } else {
      return;
    }
  };

  const handleTabChange = (tabName, tabIndex) => {
    setTabIndex(tabIndex);
    console.log(tabIndex);
    if (tabIndex === 0 && !listCheckingNotiy.length) {
      getCheckingNotificationList({
        ...reqDataChecking
      });
    } else if (tabIndex === 1 && !listNoticesNotiy.length) {
      getNoticesNotificationList({
        ...reqDataNotices
      });
    } else if (tabIndex === 2 && !listBenefitNotify.length) {
      getBenefitNotificationList();
    }
  };

  const benefitBottomScroll = () => {
    const scrollTop = benefitDetailRef.current.scrollTop;
    if (scrollTop > 20) {
      setBenenefitDetailScroll('btsheet_detail_scroll');
    } else {
      setBenenefitDetailScroll('');
    }
  };

  const checkEventTime = date => {
    if (!date) return;
    const distanceDate = totalNumOfDaysBetweenDates(date);

    // show event time remaining within the last 31 days..
    if (distanceDate >= 0 && distanceDate < 31) {
      setEventDayRemain(distanceDate);
      return true;
    } else {
      return false;
    }
  };

  const refeshLoginState = () => {
    setTimeout(() => {
      setReduxTabIndex(undefined);
      setBannerSeqState('');
      setLoginState('');
    }, 500);
  };

  const timeEventLabelJSX = useMemo(() => {
    if (showBenefitDetail) {
      return (
        checkEventTime(currentBenefitDetail.banner_per_to) && (
          <Label clazz={benenefitDetailScroll} label={`D-${eventDayRemain}`} variant="primary" />
        )
      );
    }
  }, [showBenefitDetail, eventDayRemain]);

  const checkingNotifyListJSX = useMemo(() => {
    return listCheckingNotiy.length > 0 ? (
      listCheckingNotiy.map((data, index) => (
        <Notification
          key={index}
          notifyContent={data.push_msg_ctt}
          time={`${data.gms_stt_date_display} ${data.gms_stt_time_display.slice(0, 5)}`}
          isRead={detectNotifyStatus(data.push_confm_yn)}
          thumbnailType={detectIconNotifyType(data.push_msg_ttl)}
          onNotifyClick={() => handleNotificationClick(data)}
        />
      ))
    ) : (
      <div className="notification__empty">
        <img src={no_notification} alt={'no_notification'} />
        <Span clazz="notification__empty__text" text={translate('lbl_BHO2020001_0003')} />
      </div>
    );
  }, [listCheckingNotiy, tabIndex, appLang, isNativeRedirect]);

  const noticeNotifyListJSX = useMemo(() => {
    return listNoticesNotiy.length > 0 ? (
      listNoticesNotiy.map((data, index) => (
        <Notification
          key={index}
          label={data.push_msg_ttl}
          notifyContent={data.push_msg_ctt}
          time={`${data.gms_stt_date_display} ${data.gms_stt_time_display.slice(0, 5)}`}
          isRead={detectNotifyStatus(data.push_confm_yn)}
          thumbnailType={no_notification}
          onNotifyClick={() => handleNotificationClick(data)}
        />
      ))
    ) : (
      <div className="notification__empty">
        <img src={no_notification} alt={'no_notification'} />
        <Span clazz="notification__empty__text" text={translate('lbl_BHO2020001_0003')} />
      </div>
    );
  }, [listNoticesNotiy, tabIndex, appLang, isNativeRedirect]);

  const benefitNotifyListJSX = useMemo(() => {
    return benefitListDisplay.length > 0 ? (
      benefitListDisplay.map((data, index) => (
        <Notification
          key={index}
          title={parserDataToHtml(data[`banner_main_content_${currentLang}`])}
          notifyContent={parserDataToHtml(data[`banner_sub_content_${currentLang}`])}
          notifyType="home-banner"
          thumbnail={imgSrcDetected(AppCfg.BASE_URL_IMAGE, data.banner_image_url) || no_notification}
          onNotifyClick={() => handleNotificationClick(data)}
        />
      ))
    ) : (
      <div className="notification__empty">
        <img src={no_notification} alt={'no_notification'} />
        <Span clazz="notification__empty__text" text={translate('lbl_BHO2020001_0003')} />
      </div>
    );
  }, [benefitListDisplay, tabIndex, appLang, isNativeRedirect]);

  return (
    <div className="notification__wrapper">
      {loadCheckingState && listCheckingNotiy?.length === 0 && <Spinner />}
      {loadNoticesState && listNoticesNotiy?.length === 0 && <Spinner />}
      {loadBenefitState && listBenefitNotify?.length === 0 && <Spinner />}
      <div className="notification__header">
        <Header
          title={translate('mymen_KHHO202001')}
          isExpand={isHeaderExpand}
          onClick={() => {
            moveBack();
            refeshLoginState();
          }}
        />
      </div>
      <div className="notification__content">
        <Tabs
          clazz={tabIndex === 0 ? 'checking' : 'benefits'}
          tabList={[
            {
              title: TABS.CHECKING
            },
            {
              title: TABS.NOTICES
            },
            {
              title: TABS.BENEFITS
            }
          ]}
          // isLoginAlready={isLogin}
          tabIndex={tabIndex}
          onTabChange={handleTabChange}
        >
          {tabIndex === 0 && (
            <div ref={notificationListRef} className="notification__list checking">
              {checkingNotifyListJSX}
            </div>
          )}
          {tabIndex === 1 && (
            <div ref={notificationListRef} className="notification__list checking">
              {noticeNotifyListJSX}
            </div>
          )}
          {tabIndex === 2 && (
            <div ref={notificationListRef} className="notification__list benefits">
              {benefitNotifyListJSX}
            </div>
          )}
        </Tabs>

        {/* Benefit detail */}
        <BottomSheet
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
                  <Span clazz="time__start" text={formatDate(currentBenefitDetail.banner_per_from)} />
                  <Span text="-" />
                  <Span clazz="time__end" text={formatDate(currentBenefitDetail.banner_per_to)} />
                </div>
              </div>
            </div>
            <div className="title">
              <Span text={parserDataToHtml(currentBenefitDetail[`banner_main_content_${currentLang}`])} />
            </div>
          </section>

          <section className="benefit__detail__content" ref={benefitDetailRef} onScroll={benefitBottomScroll}>
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
                <button className="btn__try__it__now" onClick={handleClickTryItNow}>
                  {translate('lbl_cta_3247')}
                </button>
              </div>
            </div>
          </section>
        </BottomSheet>
      </div>
      {/* show alert notify when get data failed */}
      <Alert
        isCloseButton={false}
        isShowAlert={checkingLoadErrors || benefitsLoadErrors}
        subtitle={checkingLoadErrors?.msgText || benefitsLoadErrors?.msgText}
        alertType={checkingLoadErrors?.msgType || benefitsLoadErrors?.msgType}
        firstButton={{
          onClick: () => alertMove(checkingLoadErrors?.msgId),
          label: translate('lbl_cta_3006')
        }}
      />
      {loadMoreNotify && loadCheckingState && listCheckingNotiy.length > 0 && <LoadingInfinite />}
      {loadMoreNotify && loadNoticesState && listNoticesNotiy.length > 0 && <LoadingInfinite />}
    </div>
  );
};

export default withHTMLParseI18n(AppNotifications);
