import Alert from '@common/ui/components/atomic/Alert/Alert';
import Spinner from '@common/ui/components/atomic/Spinner';
import Header from '@common/ui/components/Header';
import { MENU_CODE } from '@configs/global/constants';
import useDetectBrowser from '@hooks/useDetectBrowser.js';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { alertMove } from '@utilities/alertMove.js';
import { callPhone, isEmpty, moveBack, moveNext } from '@utilities/index';
import { setIsNativeClickBack } from 'app/redux/action.js';
import { appGlobalReducer } from 'app/redux/reducer.js';
import { appPathSelector, backEventSelector, nativeRedirectStateSelector } from 'app/redux/selector.js';
import { APP_GLOBAL } from 'app/redux/type.js';
import { CheckIcon, ClearIcon, CloseIcon, PlusIcon, WarningIcon } from 'assets/icons';
import { debounce } from 'debounce';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n.jsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import MerchantItem from './components/MerchantItem';
import DotMerchant from './components/DotMerchant.jsx';
import { getMerchantsRequest, selectMerchant, setMerchantFocus } from './redux/action';
import { myMerchantReducer } from './redux/reducer';
import { merchantSaga } from './redux/saga';
import { merchantSelectedSelector, merchantLoadState, merchantSelector, merchantNumFocus } from './redux/selector';
import { FeatureMerchantName } from './redux/type';
import EnterAmountBottomSheet from '@common/bottomsheets/EnterAmountBottomSheet';
import MerchantQRBottomSheet from '@common/bottomsheets/MerchantQRBottomSheet';
import RequestQRAlertBottomSheet from '@common/bottomsheets/RequestQRAlertBottomSheet';
import CreateMerchantAlertBottomSheet from '@common/bottomsheets/CreateMerchantAlertBottomSheet';
import { setCardFocus } from '@components/VisaCard/redux/action';
import Toast from '@common/ui/components/atomic/Toast';
import { imgSrcDetected, parserDataToHtml, scrollImpact } from '@utilities';
import { emv } from 'bakong-khqr/src/constant/index';

const { BakongKHQR, khqrData, IndividualInfo, MerchantInfo } = require('bakong-khqr');

const Merchants = ({ translate }) => {
  useReducers([
    { key: FeatureMerchantName, reducer: myMerchantReducer },
    { key: APP_GLOBAL, reducer: appGlobalReducer }
  ]);
  useSagas([{ key: FeatureMerchantName, saga: merchantSaga }]);

  const { cards } = useSelector(merchantSelector);
  const isLoading = useSelector(merchantLoadState);
  const detectBrowser = useDetectBrowser();
  const [merchantList, setMerchantList] = useState([]);
  const merchantSelected = useSelector(merchantSelectedSelector) || {};
  const merchantNumberFocus = useSelector(merchantNumFocus) || '';
  const isNativeRedirect = useSelector(nativeRedirectStateSelector || false);
  const appPath = useSelector(appPathSelector);
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);
  const [currentMerchant, setCurrentMerchant] = useState({});
  const [showBottomSheet, setShowBottomSheet] = useState({
    enterAmount: false,
    showQR: false,
    requestQRPrint: false,
    createMerchant: false
  });
  const [inputValue, setInputValue] = useState('');
  const [isShowToast, setIsShowToast] = useState(false);
  const [isShowToastFail, setIsShowToastFail] = useState(false);
  const [isScreenshotFail, setIsScreenshotFail] = useState(false);

  const handleActionCall = () => {
    callPhone('023955001');
  };

  const handleShowEnterAmount = () => {
    setShowBottomSheet({ ...showBottomSheet, enterAmount: true });
  };

  const handleShowQR = () => {
    setShowBottomSheet({ ...showBottomSheet, showQR: true });
  };

  const handleShowRequestQRPrint = () => {
    setShowBottomSheet({ ...showBottomSheet, requestQRPrint: true });
  };

  const handleShowCreateMerchant = () => {
    if (!isLoading && cards?.merchant_cnt && cards?.merchant_cnt > 0)
      if (cards?.merchants.filter(c => c.mcht_ledg_s === 1).length > 0) {
        setShowBottomSheet({ ...showBottomSheet, createMerchant: true });
      } else
        moveNext(MENU_CODE.MERCHANT_CREATE_NEW, {
          param: JSON.stringify(currentMerchant)
        });
    else
      moveNext(MENU_CODE.MERCHANT_CREATE_NEW, {
        param: JSON.stringify(currentMerchant)
      });
  };

  const handleShowToast = () => {
    setIsShowToast(true);
  };

  const handleShowToastFail = () => {
    setIsShowToastFail(true);
  };

  const handleScreenshotFail = () => {
    setIsScreenshotFail(true);
  };

  const handleCreateButtonBottomSheet = () => {
    moveNext(MENU_CODE.MERCHANT_CREATE_NEW, {
      param: JSON.stringify(currentMerchant)
    });
  };

  const handleOnClickNextButton = () => {
    setShowBottomSheet(e => {
      return { ...e, enterAmount: false };
    });
    setShowBottomSheet(e => {
      return { ...e, showQR: true };
    });
  };

  const handleScroll = e => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const [errMsg, setErrMsg] = useState({
    isError: false,
    errMsg: null,
    errTitle: null
  });

  const [isFetchedData, setIsFetchedData] = useState(false);
  const [isCallingPlugin, setIsCallingPlugin] = useState(false);

  const [scrollTop, setScrollTop] = useState(0);
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const bodyWrapRef = useRef();
  const headerWrapRef = useRef();
  const headerBodyRef = useRef();
  const loginInfoCurrentRef = useRef(null);
  const isNativeBack = useSelector(backEventSelector || false);

  let fixPosition = 0; // the fix

  const slideSetting = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrow: false,
    centerMode: true,
    swipe: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1480,
        settings: {
          arrows: false,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: '500px'
        }
      },
      {
        breakpoint: 1280,
        settings: {
          arrows: false,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: '400px'
        }
      },
      {
        breakpoint: 1080,
        settings: {
          arrows: false,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: '250px'
        }
      },
      {
        breakpoint: 912,
        settings: {
          arrows: false,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: '200px'
        }
      },
      {
        breakpoint: 820,
        settings: {
          arrows: false,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: '150px'
        }
      },
      {
        breakpoint: 600,
        settings: {
          arrows: false,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: '120px'
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: '60px'
        }
      },
      {
        breakpoint: 412,
        settings: {
          arrows: false,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: '50px'
        }
      },
      {
        breakpoint: 320,
        settings: {
          arrows: false,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: '30px'
        }
      }
    ],
    beforeChange: current => {
      setCurrentMerchant(merchantList[current]);
      selectMerchant(merchantList[current]);
      setMerchantFocus(''); //Prevent previous card fucus
    },
    afterChange: current => {
      setScrollTop(0);
      setCurrentMerchant(merchantList[current]);
      selectMerchant(merchantList[current]);
      setMerchantFocus(''); //Prevent previous card fucus
    }
  };

  useEffect(() => {
    if (appPath !== '/payment/merchant/merchants') return;
    getMerchantsRequest();
    if (merchantList && merchantList.length !== 0) {
      setCurrentMerchant(merchantList[0]);
    }
    return () => {
      // reset bottom sheet state
      setShowBottomSheet({
        enterAmount: false,
        requestQRPrint: false,
        showQR: false,
        createMerchant: false
      });
    };
  }, [isNativeRedirect, appPath]);

  // auto swipe to card after handle action...
  useLayoutEffect(() => {
    if (merchantNumberFocus === null || merchantNumberFocus === '') return;
    const indexGoTo = merchantList.findIndex(item => {
      return item.mcht_id === merchantNumberFocus;
    });
    sliderRef?.current?.slickGoTo(indexGoTo, true); // Args: index, dontAnimate Default: null, false
    if (merchantList[indexGoTo]) {
      setCurrentMerchant(merchantList[indexGoTo]);
      renderMerchantFullOption(merchantList[indexGoTo]);
    }
  }, [merchantNumberFocus, merchantList, merchantSelected]);

  let lastScrollY = window.pageYOffset; // the last scroll position
  useLayoutEffect(() => {
    if (!bodyWrapRef.current) return;
    bodyWrapRef.current.addEventListener('blur', showToolbar);
    return () => {
      if (!bodyWrapRef.current) return;
      bodyWrapRef.current.removeEventListener('blur', showToolbar);
    };
  }, [cards]);
  useLayoutEffect(() => {
    setIsFetchedData(true);
    if (!isLoading && cards?.merchant_cnt && cards?.merchant_cnt > 0) {
      const tempMerchantList = cards.merchants
        //just show in_process merchant and normal merchant
        .filter(c => c.mcht_ledg_s === 10 || c.mcht_ledg_s === 1)
        .map(merchantItem => {
          emv.DEFAULT_MERCHANT_CATEGORY_CODE = merchantItem.mcht_category_c; //add category code
          const optionalData = {
            accountInformation: merchantItem.mcht_acno,
            currency: merchantItem.mcht_ac_ccy_c === 'USD' ? khqrData.currency.usd : khqrData.currency.khr,
            amount: 0,
            mobileNumber: merchantItem.ctadr_no //add contact number
          };
          const citySubstring = merchantItem.city_eng_nm.substring(0, 15);
          const merchantInfo = new MerchantInfo(
            merchantItem.bakong_act_id,
            merchantItem.mcht_eng_nm,
            citySubstring,
            merchantItem.mcht_id,
            merchantItem.bakong_rcvbnk_nm,
            optionalData
          );
          const KHQR = new BakongKHQR();
          merchantItem.qrString = KHQR.generateMerchant(merchantInfo).data.qr;
          return merchantItem;
        });
      setMerchantList(tempMerchantList);
      setErrMsg({
        isError: false,
        errMsg: null,
        errTitle: null
      });
      if (isEmpty(currentMerchant)) {
        setCurrentMerchant(tempMerchantList[0]);
        selectMerchant(tempMerchantList[0]);
      } else {
        tempMerchantList.find(e => e.mcht_id === currentMerchant.mcht_id);
        setCurrentMerchant(tempMerchantList[0]);
        selectMerchant(tempMerchantList[0]);
      }
    }
  }, [isLoading, cards]);

  useLayoutEffect(() => {
    if (showBottomSheet.enterAmount && isNativeBack) {
      setShowBottomSheet({ ...showBottomSheet, enterAmount: false });
    }
    if (showBottomSheet.showQR && isNativeBack) {
      setShowBottomSheet({ ...showBottomSheet, showQR: false });
    }
    if (showBottomSheet.requestQRPrint && isNativeBack) {
      setShowBottomSheet({ ...showBottomSheet, requestQRPrint: false });
    }
    if (showBottomSheet.createMerchant && isNativeBack) {
      setShowBottomSheet({ ...showBottomSheet, createMerchant: false });
    }
    if (
      !showBottomSheet.enterAmount &&
      !showBottomSheet.showQR &&
      !showBottomSheet.requestQRPrint &&
      !showBottomSheet.createMerchant &&
      isNativeBack
    ) {
      handleGoBack();
    }
    return () => {
      setIsNativeClickBack(false);
    };
  }, [isNativeBack, showBottomSheet]);

  const renderMerchantFullOption = () => {
    return (
      <div style={{ width: '100%' }}>
        {currentMerchant.mcht_ledg_s === 10 ? (
          <ul className="option-list" onScroll={handleScroll}>
            <li
              className="sales-analyse"
              onClick={() =>
                moveNext(MENU_CODE.MERCHANT_SALES_ANALYSIS, {
                  param: JSON.stringify(currentMerchant)
                }, '/payment/merchant/sales-analysis')
              }
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4.60742" y="5.87305" width="26.1121" height="28.0078" rx="2" fill="#C8E3FF" />
                <path
                  d="M13.0765 5.93115H21.7437"
                  stroke="#4F8BF4"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                />
                <g style={{ 'mix-blend-mode': 'color-burn' }}>
                  <rect x="9.47363" y="23.8049" width="4.02068" height="5.92337" rx="1" fill="#6B6B6B" />
                </g>
                <g style={{ 'mix-blend-mode': 'color-burn' }}>
                  <rect x="15.5713" y="19.2561" width="4.02068" height="10.4736" rx="1" fill="#6B6B6B" />
                </g>
                <g style={{ 'mix-blend-mode': 'color-burn' }}>
                  <rect x="21.8325" y="14.7854" width="4.02068" height="14.9434" rx="1" fill="#6B6B6B" />
                </g>
                <path
                  d="M33.9907 27.7219C33.9907 30.9226 31.396 33.5173 28.1953 33.5173C24.9946 33.5173 22.3999 30.9226 22.3999 27.7219C22.3999 24.5212 24.9946 21.9265 28.1953 21.9265C31.396 21.9265 33.9907 24.5212 33.9907 27.7219Z"
                  fill="white"
                  stroke="#0E45B3"
                  stroke-width="2"
                  stroke-miterlimit="10"
                />
                <path
                  d="M33.0215 32.5481L35.4349 34.9615"
                  stroke="#0E45B3"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                />
              </svg>

              <label>{translate('mymen_KHPA500013')}</label>
            </li>
            <li
              className="sales-history"
              onClick={() =>
                moveNext(MENU_CODE.MERCHANT_SALES_HISTORY, {
                  param: JSON.stringify(currentMerchant)
                })
              }
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M23.5391 15.5544H32.584C33.6886 15.5544 34.584 14.659 34.584 13.5544V8.8404C34.584 7.18354 33.2408 5.8404 31.584 5.8404H23.5391L23.5391 15.5544Z"
                  fill="#4F8BF4"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.96094 31.3949C4.96094 31.6585 5.06501 31.9115 5.25051 32.0987L7.22244 34.0893C7.61371 34.4842 8.25201 34.4842 8.64328 34.0893L10.1944 32.5235C10.5856 32.1286 11.2239 32.1286 11.6152 32.5235L13.1663 34.0893C13.5576 34.4842 14.1959 34.4842 14.5871 34.0893L16.1382 32.5235C16.5295 32.1286 17.1678 32.1286 17.5591 32.5235L19.1101 34.0893C19.5014 34.4842 20.1397 34.4842 20.531 34.0893L22.0821 32.5235C22.4733 32.1286 23.1116 32.1286 23.5029 32.5235L25.054 34.0893C25.4453 34.4842 26.0836 34.4842 26.4748 34.0893L28.4468 32.0987C28.6323 31.9115 28.7363 31.6585 28.7363 31.3949V8.83961H28.7402C28.7402 7.24375 29.9863 5.93892 31.5586 5.84502V5.83961H8.01953V5.84017C8.00004 5.8398 7.98051 5.83961 7.96094 5.83961C6.30408 5.83961 4.96094 7.18276 4.96094 8.83961V31.3949Z"
                  fill="#C8E3FF"
                />
                <g style={{ 'mix-blend-mode': 'color-burn' }}>
                  <path d="M9.44458 12.0566H23.6086" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M9.44458 16.9648H23.6086" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M9.44458 21.873H17.07" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round" />
                </g>
                <path
                  d="M29.071 35.8929C33.2114 35.8929 36.5678 32.5364 36.5678 28.396C36.5678 24.2556 33.2114 20.8992 29.071 20.8992C24.9306 20.8992 21.5741 24.2556 21.5741 28.396C21.5741 32.5364 24.9306 35.8929 29.071 35.8929Z"
                  fill="#4536AD"
                />
                <path
                  d="M29.071 35.8929C33.2114 35.8929 36.5678 32.5364 36.5678 28.396C36.5678 24.2556 33.2114 20.8992 29.071 20.8992C24.9306 20.8992 21.5741 24.2556 21.5741 28.396C21.5741 32.5364 24.9306 35.8929 29.071 35.8929Z"
                  fill="#4536AD"
                />
                <path
                  d="M29.0739 35.8929C33.2143 35.8929 36.5708 32.5364 36.5708 28.396C36.5708 24.2556 33.2143 20.8992 29.0739 20.8992C24.9335 20.8992 21.577 24.2556 21.577 28.396C21.577 32.5364 24.9335 35.8929 29.0739 35.8929Z"
                  fill="#FEC42D"
                />
                <path
                  d="M29.0759 23.2417V24.8524"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                />
                <path
                  d="M29.0759 31.9396V33.5502"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                />
                <path
                  d="M31.3303 26.6245C31.3303 25.6452 30.3188 24.8528 29.0754 24.8528C27.8319 24.8528 26.8204 25.6452 26.8204 26.6245C26.8204 28.538 31.3303 28.2545 31.3303 30.1679C31.3303 31.1472 30.3188 31.9397 29.0754 31.9397C27.8319 31.9397 26.8204 31.1472 26.8204 30.1679"
                  fill="#FEC42D"
                />
                <path
                  d="M31.3303 26.6245C31.3303 25.6452 30.3188 24.8528 29.0754 24.8528C27.8319 24.8528 26.8204 25.6452 26.8204 26.6245C26.8204 28.538 31.3303 28.2545 31.3303 30.1679C31.3303 31.1472 30.3188 31.9397 29.0754 31.9397C27.8319 31.9397 26.8204 31.1472 26.8204 30.1679"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                />
                <path
                  d="M29.0691 35.8929C33.2095 35.8929 36.566 32.5364 36.566 28.396C36.566 24.2556 33.2095 20.8992 29.0691 20.8992C24.9287 20.8992 21.5723 24.2556 21.5723 28.396C21.5723 32.5364 24.9287 35.8929 29.0691 35.8929Z"
                  fill="#F68A31"
                />
                <path
                  d="M29.066 23.2417V24.8524"
                  stroke="white"
                  stroke-width="1.2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                />
                <path
                  d="M29.066 31.9396V33.5502"
                  stroke="white"
                  stroke-width="1.2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                />
                <path
                  d="M31.3204 26.6245C31.3204 25.6452 30.3089 24.8528 29.0655 24.8528C27.822 24.8528 26.8105 25.6452 26.8105 26.6245C26.8105 28.538 31.3204 28.2545 31.3204 30.1679C31.3204 31.1472 30.3089 31.9397 29.0655 31.9397C27.822 31.9397 26.8105 31.1472 26.8105 30.1679"
                  stroke="white"
                  stroke-width="1.2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                />
              </svg>

              <label>{translate('mymen_KHPA500011')}</label>
            </li>
            <li
              className="request-qr"
              onClick={() => {
                currentMerchant?.qr_print_aplct_cnt1 > 0 ||
                currentMerchant?.qr_print_aplct_cnt2 > 0 ||
                currentMerchant?.qr_print_aplct_cnt3 > 0 ||
                currentMerchant?.qr_print_aplct_cnt4 > 0
                  ? handleShowRequestQRPrint()
                  : moveNext(MENU_CODE.MERCHANT_REQUEST_QR, { param: JSON.stringify(currentMerchant) });
              }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="11.2988" y="6.01221" width="17.4004" height="14.9531" rx="2" fill="#AAD0FF" />
                <rect x="5.03125" y="10.2905" width="29.9355" height="16.415" rx="2" fill="#4F8BF4" />
                <path d="M8.67529 13.9927H12.6313" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                <path
                  d="M10.25 17.2009H29.7461V32.86C29.7461 33.9645 28.8507 34.86 27.7461 34.86H12.25C11.1454 34.86 10.25 33.9645 10.25 32.86V17.2009Z"
                  fill="#C8E3FF"
                />
                <g style={{ 'mix-blend-mode': 'color-burn' }}>
                  <path
                    d="M14.5068 30.3657C14.5068 30.8289 14.5068 31.0605 14.618 31.2269C14.6661 31.2989 14.728 31.3607 14.8 31.4088C14.9664 31.52 15.198 31.52 15.6612 31.52H18.2328C18.6961 31.52 18.9277 31.52 19.094 31.4088C19.1661 31.3607 19.2279 31.2989 19.276 31.2269C19.3872 31.0605 19.3872 30.8289 19.3872 30.3657V27.794C19.3872 27.3308 19.3872 27.0992 19.276 26.9328C19.2279 26.8608 19.1661 26.7989 19.094 26.7508C18.9277 26.6396 18.6961 26.6396 18.2328 26.6396H15.6612C15.198 26.6396 14.9664 26.6396 14.8 26.7508C14.728 26.7989 14.6661 26.8608 14.618 26.9328C14.5068 27.0992 14.5068 27.3308 14.5068 27.794V30.3657Z"
                    fill="#6B6B6B"
                  />
                  <path
                    d="M21.7617 20.5392C21.2984 20.5392 21.0668 20.5392 20.9005 20.6504C20.8284 20.6985 20.7666 20.7603 20.7185 20.8323C20.6073 20.9987 20.6073 21.2303 20.6073 21.6935V24.2652C20.6073 24.7284 20.6073 24.96 20.7185 25.1264C20.7666 25.1984 20.8284 25.2603 20.9005 25.3084C21.0668 25.4196 21.2984 25.4196 21.7617 25.4196H24.3333C24.7965 25.4196 25.0281 25.4196 25.1945 25.3084C25.2665 25.2603 25.3284 25.1984 25.3765 25.1264C25.4877 24.96 25.4877 24.7284 25.4877 24.2652V21.6935C25.4877 21.2303 25.4877 20.9987 25.3765 20.8323C25.3284 20.7603 25.2665 20.6985 25.1945 20.6504C25.0281 20.5392 24.7965 20.5392 24.3333 20.5392H21.7617Z"
                    fill="#6B6B6B"
                  />
                </g>
                <path
                  d="M14.5068 24.2652C14.5068 24.7284 14.5068 24.96 14.618 25.1264C14.6661 25.1984 14.728 25.2603 14.8 25.3084C14.9664 25.4196 15.198 25.4196 15.6612 25.4196H18.2328C18.6961 25.4196 18.9277 25.4196 19.094 25.3084C19.1661 25.2603 19.2279 25.1984 19.276 25.1264C19.3872 24.96 19.3872 24.7284 19.3872 24.2652V21.6935C19.3872 21.2303 19.3872 20.9987 19.276 20.8323C19.2279 20.7603 19.1661 20.6985 19.094 20.6504C18.9277 20.5392 18.6961 20.5392 18.2328 20.5392H15.6612C15.198 20.5392 14.9664 20.5392 14.8 20.6504C14.728 20.6985 14.6661 20.7603 14.618 20.8323C14.5068 20.9987 14.5068 21.2303 14.5068 21.6935V24.2652ZM15.7269 21.7593H18.1671V24.1995H15.7269V21.7593Z"
                  fill="#4F8BF4"
                />
                <path
                  d="M25.4893 30.3015H24.2692V31.5216H24.8159C25.0861 31.5216 25.2212 31.5216 25.3182 31.4568C25.3603 31.4287 25.3963 31.3926 25.4244 31.3506C25.4893 31.2535 25.4893 31.1184 25.4893 30.8482V30.3015Z"
                  fill="#1E59CF"
                />
                <path
                  d="M21.829 26.6412H21.2823C21.0121 26.6412 20.877 26.6412 20.7799 26.7061C20.7379 26.7342 20.7018 26.7702 20.6737 26.8122C20.6089 26.9093 20.6089 27.0444 20.6089 27.3146V27.8613H21.829V26.6412Z"
                  fill="#1E59CF"
                />
                <path d="M23.0491 27.8613H21.829V29.0814H23.0491V27.8613Z" fill="#1E59CF" />
                <path d="M21.829 29.0814H20.6089V30.3015H21.829V29.0814Z" fill="#1E59CF" />
                <path d="M23.0491 30.3015H21.829V31.5216H23.0491V30.3015Z" fill="#1E59CF" />
                <path d="M24.2692 29.0814H23.0491V30.3015H24.2692V29.0814Z" fill="#1E59CF" />
                <path d="M24.2692 26.6412H23.0491V27.8613H24.2692V26.6412Z" fill="#1E59CF" />
                <path d="M25.4893 27.8613H24.2692V29.0814H25.4893V27.8613Z" fill="#1E59CF" />
              </svg>

              <label>{translate('mymen_KHPA500014')}</label>
            </li>

            {currentMerchant?.mcht_prdt_flag === 'N' ? (
              <li
                className="get-interest"
                onClick={() =>
                  moveNext(MENU_CODE.MERCHANT_GET_MORE_INTEREST, {
                    param: JSON.stringify(currentMerchant)
                  })
                }
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="14.5189" y="20.2416" width="17.4611" height="5.23833" rx="1" fill="#F7A22D" />
                  <rect x="14.5192" y="13.2571" width="17.4611" height="5.23833" rx="1" fill="#F7A22D" />
                  <rect x="14.5189" y="27.226" width="17.4611" height="5.23833" rx="1" fill="#F7A22D" />
                  <rect x="4.04346" y="6.27271" width="17.4611" height="5.23833" rx="1" fill="#FFC947" />
                  <rect x="4.04346" y="13.2571" width="17.4611" height="5.23833" rx="1" fill="#FFC947" />
                  <rect x="4.04346" y="20.2416" width="17.4611" height="5.23833" rx="1" fill="#FFC947" />
                  <rect x="4.04346" y="27.2261" width="17.4611" height="5.23833" rx="1" fill="#FFC947" />
                  <path
                    d="M29.5435 33.7273C33.9617 33.7273 37.5435 30.1456 37.5435 25.7273C37.5435 21.309 33.9617 17.7273 29.5435 17.7273C25.1252 17.7273 21.5435 21.309 21.5435 25.7273C21.5435 30.1456 25.1252 33.7273 29.5435 33.7273Z"
                    fill="#2079E2"
                  />
                  <path
                    d="M32.1136 22.204L26.0201 28.2975C25.7569 28.5608 25.7568 28.9875 26.02 29.2508C26.2833 29.514 26.7101 29.5139 26.9733 29.2507L33.0668 23.1572C33.33 22.894 33.3301 22.4672 33.0669 22.2039C32.8036 21.9407 32.3769 21.9408 32.1136 22.204Z"
                    fill="white"
                  />
                  <path
                    d="M27.0651 24.5369C27.7783 24.5369 28.3564 23.9587 28.3564 23.2455C28.3564 22.5323 27.7783 21.9541 27.0651 21.9541C26.3519 21.9541 25.7737 22.5323 25.7737 23.2455C25.7737 23.9587 26.3519 24.5369 27.0651 24.5369Z"
                    fill="white"
                  />
                  <path
                    d="M32.0668 29.5383C32.78 29.5383 33.3581 28.9602 33.3581 28.2469C33.3581 27.5337 32.78 26.9556 32.0668 26.9556C31.3536 26.9556 30.7754 27.5337 30.7754 28.2469C30.7754 28.9602 31.3536 29.5383 32.0668 29.5383Z"
                    fill="white"
                  />
                </svg>

                <label>{translate('mymen_KHPA500015')}</label>
              </li>
            ) : (
              ''
            )}
          </ul>
        ) : (
          ''
        )}
      </div>
    );
  };

  const backToCard = () => {
    setErrMsg({ ...errMsg, isError: false, errMsg: null, errTitle: false });
  };

  // function to run on scroll
  const showToolbar = () => {
    if (!headerBodyRef.current) return;
    if (fixPosition > 0) {
      headerBodyRef.current.classList.remove('down');
      fixPosition = 0;
      headerBodyRef.current.style['margin-top'] = 0 + 'px';
    }
    debounceMargin();
  };

  // function to set the margin to show the toolbar if hidden
  const setMargin = function () {
    if (!headerWrapRef.current) return;
    if (!headerBodyRef.current) return;
    // if toolbar wrap is hidden
    const newPosition = headerWrapRef.getBoundingClientRect().top;
    if (newPosition < -1) {
      // add a margin to show the toolbar
      headerBodyRef.current.classList.add('down'); // add class so toolbar can be animated
      fixPosition = Math.abs(newPosition); // this is new position we need to fix the toolbar in the display
      // if at the bottom of the page take a couple of pixels off due to gap
      if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
        fixPosition -= 2;
      }
      // set the margin to the new fixed position
      headerBodyRef.current.style['margin-top'] = fixPosition + 'px';
    }
  };

  // use lodash debounce to stop flicker
  const debounceMargin = debounce(setMargin, 150);

  const handleGoBack = () => {
    moveBack();
    if (merchantList) {
      selectMerchant(merchantList[0]);
    }
  };
  return (
    <div className="merchants">
      <section ref={headerWrapRef} className="top__wrapper">
        <Header
          ref={headerBodyRef}
          title={translate('men_KHMM114000')}
          isExpand={scrollTop > 0} //expand header when scroll Top
          // isInline={true}
          clazz="title-inline"
          onClick={handleGoBack}
        />
      </section>
      {isLoading || !isFetchedData ? (
        <Spinner />
      ) : !cards?.elHeader ? (
        <section className={`body__wrapper ${!merchantList || (!merchantList.length && 'body__nocard')}`}>
          {isCallingPlugin && <Spinner />}
          <div
            ref={bodyWrapRef}
            className={`card-list ${!merchantList || (!merchantList.length && 'no_card')} ${
              detectBrowser === 'chrome' ? 'chrome' : ''
            }`}
            onScroll={handleScroll}
          >
            {!merchantList || !merchantList.length ? (
              <MerchantItem key="NoCard" noCard={true} handleShowCreateMerchant={handleShowCreateMerchant} />
            ) : (
              <>
                <Slider ref={sliderRef} {...slideSetting}>
                  {merchantList.map((card, index) => (
                    <MerchantItem
                      key={index}
                      card={card}
                      errMsg={errMsg}
                      setErrMsg={setErrMsg}
                      handleShowEnterAmount={handleShowEnterAmount}
                      handleShowCreateMerchant={handleShowCreateMerchant}
                      onClickDownload
                      onClickSend
                      handleShowToast={handleShowToast}
                      handleShowToastFail={handleShowToastFail}
                      handleScreenshotFail={handleScreenshotFail}
                      isCallingPlugin={isCallingPlugin}
                      setIsCallingPlugin={setIsCallingPlugin}
                    />
                  ))}
                </Slider>
                <DotMerchant
                  merchantList={merchantList}
                  curIdx={merchantList.map(e => e.mcht_id).indexOf(currentMerchant?.mcht_id)}
                />
              </>
            )}
            {merchantList.length > 0 && (
              <div className="card-options">
                {renderMerchantFullOption(currentMerchant)}
                <button
                  className={`card-add-new ${scrollTop > 0 ? 'afterScrollTop' : ''}`}
                  onClick={handleShowCreateMerchant}
                >
                  <PlusIcon iconWidth="18" iconHeight="18" />
                  {scrollTop > 0 ? '' : translate('lbl_com_3262')}
                </button>
              </div>
            )}
          </div>
        </section>
      ) : (
        <Alert
          isCloseButton={false}
          isShowAlert={true}
          subtitle={cards?.elHeader.resMsg}
          alertType={cards?.elHeader?.resMsgVo?.msgType}
          firstButton={{
            onClick: () => {
              alertMove(cards?.elHeader?.resMsgVo?.msgId);
              setCurrentMerchant(merchantList[0]);
            },
            label: translate('lbl_cta_3006')
          }}
        />
      )}
      <Alert
        title={errMsg.errTitle}
        isCloseButton={false}
        isShowAlert={errMsg.isError}
        subtitle={errMsg.errMsg?.msgText}
        alertType={errMsg.errMsg?.msgType}
        firstButton={{ onClick: backToCard, label: translate('lbl_cta_3006') }}
      />
      {showBottomSheet.enterAmount && (
        <EnterAmountBottomSheet
          open={showBottomSheet.enterAmount}
          currency={currentMerchant.mcht_ac_ccy_c}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, enterAmount: false })}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleOnClickNextButton={handleOnClickNextButton}
        />
      )}
      {showBottomSheet.showQR && (
        <MerchantQRBottomSheet
          open={showBottomSheet.showQR}
          onClose={() => {
            setShowBottomSheet({ ...showBottomSheet, showQR: false });
            setInputValue('');
          }}
          merchant={cards}
          currentMerchant={currentMerchant}
          inputValue={inputValue}
        />
      )}

      {showBottomSheet.createMerchant && (
        <CreateMerchantAlertBottomSheet
          open={showBottomSheet.createMerchant}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, createMerchant: false })}
          merchant={cards}
          onClickProceed={handleCreateButtonBottomSheet}
        />
      )}

      {showBottomSheet.requestQRPrint && (
        <RequestQRAlertBottomSheet
          open={showBottomSheet.requestQRPrint}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, requestQRPrint: false })}
          merchant={cards}
          onClickProceed={handleActionCall}
        />
      )}
      <section className="toast__overlay">
        <Toast
          isShowToast={isShowToast}
          iconStatus={<CheckIcon />}
          onClose={() => setIsShowToast(false)}
          message={'QR has been saved.'}
        />
      </section>
      <section className="toast__overlay">
        <Toast
          isShowToast={isShowToastFail}
          iconStatus={<WarningIcon />}
          onClose={() => setIsShowToastFail(false)}
          message={'QR has not been saved.'}
        />
      </section>
      <section className="toast__overlay">
        <Toast
          isShowToast={isScreenshotFail}
          iconStatus={<WarningIcon />}
          onClose={() => setIsScreenshotFail(false)}
          message={'Can not take screenshot.'}
        />
      </section>
    </div>
  );
};

export default withHTMLParseI18n(Merchants);
