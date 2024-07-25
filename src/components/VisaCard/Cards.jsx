import activateCompleted from '@assets/images/activate_success.png';
import reportCompleted from '@assets/images/reportCompleted.png';
import Alert from '@common/ui/components/atomic/Alert/Alert';
import Spinner from '@common/ui/components/atomic/Spinner';
import Header from '@common/ui/components/Header';
import DebitCardManageLimitBottom from '@common/bottomsheets/ManageLimitBottomSheet';
import { MENU_CODE } from '@configs/global/constants';
import useDetectBrowser from '@hooks/useDetectBrowser.js';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { apiCall } from '@shared/api';
import { alertMove } from '@utilities/alertMove.js';
import { getCurrentDate, getCurrentTime, getDateToYYYYMMDD } from '@utilities/dateTimeUtils';
import {
  clearHistory,
  hideCertificationNumber,
  isEmpty,
  isMaxVisaCard,
  moveBack,
  moveHome,
  moveNext,
  showCertificationNumber
} from '@utilities/index';
import { setIsNativeClickBack } from 'app/redux/action.js';
import { appGlobalReducer } from 'app/redux/reducer.js';
import { appPathSelector, backEventSelector, nativeRedirectStateSelector } from 'app/redux/selector.js';
import { APP_GLOBAL } from 'app/redux/type.js';
import { CardActive, CardHistory, CardLimit, CardLock, CardLost, CardPin, CardRelease, PlusIcon } from 'assets/icons';
import { debounce } from 'debounce';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n.jsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import DebitCardBottom from '../../common/bottomsheets/DebitCardBottom.jsx.jsx';
import CardItem from './components/CardItem';
import DebitCardComplete from './components/DebitCardComplete';
import DotCards from './components/DotCards.jsx';
import { getCardsRefresh, getCardsRequest, selectCard, setCardFocus } from './redux/action';
import { debitCardReducer } from './redux/reducer';
import { debitCardSaga } from './redux/saga';
import { cardNumFocus, cardSelectedSelector, cardsLoadState, cardsSelector } from './redux/selector';
import { debitCardsURLs, FeatureDebitCardName } from './redux/type';

const Cards = ({ translate }) => {
  useReducers([
    { key: FeatureDebitCardName, reducer: debitCardReducer },
    { key: APP_GLOBAL, reducer: appGlobalReducer }
  ]);
  useSagas([{ key: FeatureDebitCardName, saga: debitCardSaga }]);

  const { cards } = useSelector(cardsSelector);
  const isLoading = useSelector(cardsLoadState);
  const detectBrowser = useDetectBrowser();
  const [cardList, setCardList] = useState([]);
  const cardSelected = useSelector(cardSelectedSelector) || {};
  const cardNumberFocus = useSelector(cardNumFocus) || '';
  const isNativeRedirect = useSelector(nativeRedirectStateSelector || false);
  const appPath = useSelector(appPathSelector);

  const [currentCard, setCurrentCard] = useState({});
  const [showBottomSheet, setShowBottomSheet] = useState({
    reportLostAndBlock: false,
    releaseBlockAndUnlock: false,
    manageLimit: false
  });
  const [errMsg, setErrMsg] = useState({
    isError: false,
    errMsg: null,
    errTitle: null
  });
  const [isShowCompleted, setIsShowCompleted] = useState({
    state: false,
    textCompleted: '',
    imageCompleted: null
  });
  const [isFetchedData, setIsFetchedData] = useState(false);

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
    slidesToShow: 3,
    slidesToScroll: 1,
    arrow: false,
    centerMode: true,
    centerPadding: '80px',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          arrows: false,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: '289px'
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: '225px'
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          slidesToShow: 1
        }
      }
    ],
    beforeChange: current => {
      setCurrentCard(cardList[current]);
      selectCard(cardList[current]);
      setCardFocus(''); //Prevent previous card fucus
    },
    afterChange: current => {
      setScrollTop(0);
      setCurrentCard(cardList[current]);
      selectCard(cardList[current]);
      setCardFocus(''); //Prevent previous card fucus
    }
  };

  useEffect(() => {
    if (appPath !== '/cards') return;
    getCardsRequest();
    if (cardList && cardList.length !== 0) {
      setCurrentCard(cardList[0]);
    }
    return () => {
      // reset bottom sheet state
      setShowBottomSheet({
        reportLostAndBlock: false,
        releaseBlockAndUnlock: false,
        manageLimit: false
      });
      setIsShowCompleted({
        state: false,
        textCompleted: '',
        imageCompleted: null
      });
    };
  }, [isNativeRedirect, appPath]);

  // auto swipe to card after handle action...
  useLayoutEffect(() => {
    if (cardNumberFocus === null || cardNumberFocus === '') return;
    const indexGoTo = cardList.findIndex(item => {
      return item.card_no === cardNumberFocus;
    });
    sliderRef?.current?.slickGoTo(indexGoTo, true); // Args: index, dontAnimate Default: null, false
    if (cardList[indexGoTo]) {
      setCurrentCard(cardList[indexGoTo]);
      cardOptionFilter(cardList[indexGoTo]);
    }
  }, [cardNumberFocus, cardList, cardSelected]);

  let lastScrollY = window.pageYOffset; // the last scroll position
  useLayoutEffect(() => {
    if (!bodyWrapRef.current) return;
    bodyWrapRef.current.addEventListener('blur', showToolbar);
    return () => {
      if (!bodyWrapRef.current) return;
      bodyWrapRef.current.removeEventListener('blur', showToolbar);
    };
  }, []);
  useLayoutEffect(() => {
    setIsFetchedData(true);
    if (!isLoading && cards?.list && cards?.list.length > 0) {
      setCardList(cards.list.filter(c => c.card_k !== '9'));
      setErrMsg({
        isError: false,
        errMsg: null,
        errTitle: null
      });
      if (isEmpty(currentCard)) {
        setCurrentCard(cards.list[0]);
        selectCard(cards.list[0]);
      }
    }
  }, [isLoading, cards, currentCard]);

  useLayoutEffect(() => {
    if (showBottomSheet.releaseBlockAndUnlock && isNativeBack) {
      setShowBottomSheet({ ...showBottomSheet, releaseBlockAndUnlock: false });
    }
    if (showBottomSheet.reportLostAndBlock && isNativeBack) {
      setShowBottomSheet({ ...showBottomSheet, reportLostAndBlock: false });
    }
    if (showBottomSheet.manageLimit && isNativeBack) {
      setShowBottomSheet({ ...showBottomSheet, manageLimit: false });
    }
    if (
      !showBottomSheet.releaseBlockAndUnlock &&
      !showBottomSheet.reportLostAndBlock &&
      !showBottomSheet.manageLimit &&
      isNativeBack
    ) {
      handleGoBack();
    }
    return () => {
      setIsNativeClickBack(false);
    };
  }, [isNativeBack, showBottomSheet]);

  const handleScroll = e => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const CardAddNew = () => {
    moveNext(MENU_CODE.CARDS_NEW_CARD_LIST, '', '/cards/new-card-list');
  };

  const renderCardActivateOption = () => {
    return (
      <ul className="option-list" onScroll={handleScroll}>
        <li className="card-history" onClick={() => handleActivateCard()}>
          <CardActive />
          <label>{translate('men_KHCD800006')}</label>
        </li>
      </ul>
    );
  };

  const renderCardOptionBlock = card => {
    return (
      <ul className="option-list" onScroll={handleScroll}>
        <li
          className="card-history"
          onClick={() => {
            moveNext(MENU_CODE.CARDS_TRANSACTION_HISTORY, '', '/cards/transaction-history');
            // navigate('/cards/transaction-history');
          }}
        >
          <CardHistory />
          {/* <label>View History</label> */}
          <label>{translate('men_KHCD800001')}</label>
        </li>
        <li
          className="card-history"
          onClick={() => setShowBottomSheet({ ...showBottomSheet, releaseBlockAndUnlock: true })}
        >
          <CardRelease />
          <label>
            {card.card_virtual_yn !== 0 ? `${translate('men_KHCD800008')}` : `${translate('men_KHCD800007')}`}
          </label>
        </li>
      </ul>
    );
  };

  const renderCardFullOption = card => {
    return (
      <ul className="option-list" onScroll={handleScroll}>
        <li
          className="card-history"
          onClick={() => {
            moveNext(MENU_CODE.CARDS_TRANSACTION_HISTORY, '', '/cards/transaction-history');
            // navigate('/cards/transaction-history');
          }}
        >
          <CardHistory />
          <label>{translate('men_KHCD800001')}</label>
        </li>
        <li className="card-limit" onClick={() => setShowBottomSheet({ ...showBottomSheet, manageLimit: true })}>
          <CardLimit />
          <label>{translate('men_KHCD800002')}</label>
        </li>
        <li className="card-pin" onClick={() => moveNext(MENU_CODE.CARDS_MANAGE_PIN,'', '/cards/manage-card-pin')}>
          <CardPin />
          <label>{translate('men_KHCD800003')}</label>
        </li>
        {card.card_virtual_yn !== 0 ? (
          <li
            className="card-lock"
            onClick={() => setShowBottomSheet({ ...showBottomSheet, reportLostAndBlock: true })}
          >
            <CardLock />
            <label>{translate('men_KHCD800005')}</label>
          </li>
        ) : (
          <li
            className="card-lost"
            onClick={() => setShowBottomSheet({ ...showBottomSheet, reportLostAndBlock: true })}
          >
            <CardLost />
            <label>{translate('men_KHCD800004')}</label>
          </li>
        )}
      </ul>
    );
  };

  const cardOptionFilter = card => {
    if (card?.card_dlv_dt !== null && card?.card_dlv_dt?.length > 0) {
      if (card?.card_block_virtual_yn === 1 || card?.card_block_real_yn === 1) {
        return renderCardOptionBlock(card);
      } else {
        return renderCardFullOption(card);
      }
    } else {
      return renderCardActivateOption();
    }
  };

  const handleActivateCard = () => {
    moveNext(MENU_CODE.CARDS_ACTIVATE,'', '/cards/activate-card');
  };

  const showPinNumberKeyPad = (type, errMsg = '') => {
    showCertificationNumber(
      {
        title: translate('lbl_com_3174'),
        description: translate('lbl_com_3133').replace('%1', '6'),
        maxLength: 6,
        errMsg: errMsg
      },
      reportCardLostAndLockAction
    );
  };

  const handleCardPinCheck = async ecrPin => {
    const cardPinCheck = {
      trx_func_d: 1,
      card_no: currentCard.card_no,
      chgbef_ecr_pin: ecrPin,
      filler0020: currentCard.filler0020
    };
    const pinCheck = await apiCall(debitCardsURLs.MANAGE_CARD_PIN, 'POST', cardPinCheck);
    return pinCheck;
  };

  const handleCardLostAndBlock = async () => {
    const paramData = {
      trx_func_d: 1,
      card_no: currentCard.card_no,
      card_loss_dt: getDateToYYYYMMDD(),
      card_loss_time: getCurrentTime('HHMMSS'),
      filler0020: currentCard.filler0020,
      card_virtual_yn: currentCard.card_virtual_yn
    };
    const report = await apiCall(debitCardsURLs.REPORT_CARD_LOST, 'POST', paramData);
    return report;
  };

  const handleCardActivateUnlock = async ecrPin => {
    const pinCheck = await handleCardPinCheck(ecrPin);
    const pinCheckResult = pinCheck?.data?.elHeader;
    if (pinCheck?.data?.elHeader?.resSuc) {
      const paramData = {
        trx_func_d: 9,
        card_no: currentCard.card_no,
        filler0020: currentCard.filler0020,
        card_virtual_yn: currentCard.card_virtual_yn
      };
      const { data } = await apiCall(debitCardsURLs.REPORT_CARD_LOST, 'POST', paramData);
      if (data && data?.elData?.rslt_d === 1) {
        await refreshCardList();
        setIsShowCompleted({
          state: true,
          textCompleted: translate('lbl_BCD8000000_0036'),
          imageCompleted: activateCompleted
        });
        setShowBottomSheet({ ...showBottomSheet, releaseBlockAndUnlock: false });
        setErrMsg({ ...errMsg, isError: false, errMsg: null });
      } else {
        setIsShowCompleted({
          state: false,
          textCompleted: '',
          imageCompleted: null
        });
        setErrMsg({ ...errMsg, isError: true, errMsg: data?.elHeader?.resMsgVo });
        setShowBottomSheet({ ...showBottomSheet, releaseBlockAndUnlock: false });
      }
      hideCertificationNumber();
    } else {
      if (pinCheckResult?.resMsgVo?.msgId === 'KHCA.0003') {
        // Incorrect password
        releaseBlockAndUnlockCard('', pinCheck?.data.elHeader?.resMsg || 'Passwords do not match');
        setErrMsg({ ...errMsg, isError: false, errMsg: null , errTitle: null});
      } else if (pinCheckResult?.resMsgVo?.msgId === 'KHCA.0004') {
        // Incorrect password 5 times -> card locked
        setShowBottomSheet({ ...showBottomSheet, releaseBlockAndUnlock: false });
        hideCertificationNumber();
        setErrMsg({ ...errMsg, isError: true, errMsg: pinCheckResult?.resMsgVo, errTitle: translate('lbl_com_3175') });
      }    
    }
  };

  const releaseBlockAndUnlockCard = (type, errMsg = '') => {
    showCertificationNumber(
      {
        title: translate('lbl_com_3174'),
        description: translate('lbl_com_3133').replace('%1', '6'),
        maxLength: 6,
        errMsg: errMsg
      },
      handleCardActivateUnlock
    );
  };

  const reportCardLostAndLockAction = async ecrPin => {
    const pinCheck = await handleCardPinCheck(ecrPin);
    const pinCheckResult = pinCheck?.data?.elHeader;
    if (pinCheck?.data?.elHeader?.resSuc) {
      const { data } = await handleCardLostAndBlock();
      if (data && data?.elData?.rslt_d === 1) {
        await refreshCardList();
        setIsShowCompleted({
          state: true,
          textCompleted: translate('lbl_BCD8000000_0032'),
          imageCompleted: reportCompleted
        });
        setErrMsg({ ...errMsg, isError: false, errMsg: null });
        setShowBottomSheet({ ...showBottomSheet, reportLostAndBlock: false });
      } else {
        let resMsgVo = data?.elHeader?.resMsgVo;
        setIsShowCompleted({
          state: false,
          textCompleted: '',
          imageCompleted: null
        });
        setErrMsg({ ...errMsg, isError: true, errMsg: resMsgVo ? resMsgVo : { msgText: data?.elHeader?.resMsg } });
        setShowBottomSheet({ ...showBottomSheet, reportLostAndBlock: false });
      }
      hideCertificationNumber();
    } else {
      if (pinCheckResult?.resMsgVo?.msgId === 'KHCA.0003') {
        // Incorrect password
        showPinNumberKeyPad('report', pinCheck?.data.elHeader?.resMsg || 'Passwords do not match');
        setErrMsg({ ...errMsg, isError: false, errMsg: null , errTitle: null});
      } else if (pinCheckResult?.resMsgVo?.msgId === 'KHCA.0004') {
        // Incorrect password 5 times -> card locked
        setShowBottomSheet({ ...showBottomSheet, reportLostAndBlock: false });
        hideCertificationNumber();
        setErrMsg({ ...errMsg, isError: true, errMsg: pinCheckResult?.resMsgVo, errTitle: translate('lbl_com_3175') });
      }    
    }
  };

  const backToCard = () => {
    setErrMsg({ ...errMsg, isError: false, errMsg: null, errTitle: false });
  };

  const refreshCardList = async () => {
    const { data } = await apiCall(debitCardsURLs.GET_CARDS, 'POST', {});
    if (data && data.elData) {
      getCardsRefresh(data.elData);
      const cardUpdate = data.elData.list.filter(c => c.card_no === currentCard?.card_no);
      if (cardUpdate && cardUpdate.length) {
        setCurrentCard(cardUpdate[0]);
        selectCard(cardUpdate[0]);
      }
    }
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
    if (cardList) {
      selectCard(cardList[0]);
    }
  };

  return (
    <div className="cards">
      <section ref={headerWrapRef} className="top__wrapper">
        <Header
          ref={headerBodyRef}
          title={translate('men_KHCD800000')}
          isInline={true}
          clazz="title-inline"
          onClick={handleGoBack}
        />
      </section>
      {(isLoading || !isFetchedData) ? (
        <Spinner />
      ) : !cards?.elHeader ? (
        <section className={`body__wrapper ${!cardList || (!cardList.length && 'body__nocard')}`}>
          <div
            ref={bodyWrapRef}
            className={`card-list ${!cardList || (!cardList.length && 'no_card')} ${
              detectBrowser === 'chrome' ? 'chrome' : ''
            }`}
            onScroll={handleScroll}
          >
            {!cardList || !cardList.length ? (
              <CardItem key="NoCard" noCard={true} />
            ) : (
              <>
                <Slider ref={sliderRef} {...slideSetting}>
                  {cardList.map((card, index) => card.card_k !== '9' && <CardItem key={index} card={card} errMsg={errMsg} setErrMsg={setErrMsg}/>)}
                </Slider>
                <DotCards
                  cardList={cardList}
                  currentCard={currentCard}
                  setCurrentCard={setCurrentCard}
                  selectCard={selectCard}
                  setCardFocus={setCardFocus}
                />
              </>
            )}
            {cardList.length > 0 && (
              <div className="card-options">
                {cardOptionFilter(currentCard)}
                {!isMaxVisaCard(cardList) && (
                  <button className={`card-add-new ${scrollTop > 0 ? 'afterScrollTop' : ''}`} onClick={CardAddNew}>
                    <PlusIcon iconWidth="18" iconHeight="18" />
                    {scrollTop > 0 ? '' : translate('lbl_com_3074')}
                  </button>
                )}
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
              setCurrentCard(cardList[0]);
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
      <DebitCardBottom
        open={showBottomSheet.reportLostAndBlock}
        onClose={() => setShowBottomSheet({ ...showBottomSheet, reportLostAndBlock: false })}
        cardName={currentCard?.card_nm}
        cardTypeText={currentCard?.card_nm}
        debitBottomType={currentCard?.card_virtual_yn === 1 ? 'lock' : 'report'}
        accountLinked={{
          type: currentCard?.ac_prdt_nm,
          number: currentCard?.card_acno_display || ''
        }}
        onBottomSheetButtonClick={type => showPinNumberKeyPad(type)}
      />
      <DebitCardBottom
        open={showBottomSheet.releaseBlockAndUnlock}
        onClose={() => setShowBottomSheet({ ...showBottomSheet, releaseBlockAndUnlock: false })}
        cardName={currentCard?.card_nm}
        cardTypeText={currentCard?.card_nm}
        debitBottomType={currentCard?.card_virtual_yn === 1 ? 'unlock' : 'release'}
        accountLinked={{
          type: currentCard?.ac_prdt_nm,
          number: currentCard?.card_acno_display || ''
        }}
        onBottomSheetButtonClick={type => releaseBlockAndUnlockCard(type)}
      />
      <DebitCardManageLimitBottom
        open={showBottomSheet.manageLimit}
        onClose={() => {
          setShowBottomSheet({ ...showBottomSheet, manageLimit: false });
        }}
        onRefreshCard={refreshCardList}
        isWithdrawal={currentCard?.card_virtual_yn === 0 ? true : false}
        isPurchase={true}
      />
      {isShowCompleted.state && (
        <DebitCardComplete
          completeThumbnail={isShowCompleted.imageCompleted}
          dateComplete={`${getCurrentDate('DD.MM.YYYY')} ${getCurrentTime('HH:MM:SS')}`}
          cardName={currentCard?.card_nm}
          actionText={{ text: isShowCompleted.textCompleted, position: 'right' }}
          dataTable={[
            {
              title: translate('lbl_BCD8000000_0030'),
              value: [currentCard?.card_nm]
            },
            {
              title: translate('lbl_BCD8000000_0021'),
              value: [currentCard?.card_no_display]
            },
            {
              title: translate('lbl_BCD8000000_0031'),
              value: [currentCard?.card_acno_display || '']
            }
          ]}
          duoButton={{
            firstButton: {
              label: translate('lbl_cta_3038'),
              action: async () => {
                setIsShowCompleted({
                  state: false,
                  textCompleted: '',
                  imageCompleted: null
                });
                clearHistory(MENU_CODE.CARDS);
                setTimeout(() => {
                  setCardFocus(currentCard?.card_no);
                  cardOptionFilter(currentCard);
                }, 500);
              }
            },
            secondButton: {
              label: translate('lbl_cta_3241'),
              action: () => {
                setIsShowCompleted({
                  state: false,
                  textCompleted: '',
                  imageCompleted: null
                });
                moveHome();
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default withHTMLParseI18n(Cards);
