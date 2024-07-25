import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import ShortCard from '@common/ui/components/atomic/CardGroup/ShortCard/ShortCard';
import InputSearch from '@common/ui/components/atomic/Input/InputSearch';
import Spinner from '@common/ui/components/atomic/Spinner';
import TransactionHistory from '@common/ui/components/atomic/TransactionHistory';
import Header from '@common/ui/components/Header';
import { INQUIRIES, MONTH_VALUES } from '@common/ui/constants';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { apiCall } from '@shared/api';
import {
  addDateWithMonth,
  convertDateToMMYYYY,
  convertToShortTime,
  convertYYYYMMtoMMYYYY,
  dateNumberCheck
} from '@utilities/dateTimeUtils';
import { isEmpty, moveBack, scrollImpact } from '@utilities/index';
import { setIsNativeClickBack } from 'app/redux/action';
import { appGlobalReducer } from 'app/redux/reducer';
import { backEventSelector } from 'app/redux/selector';
import { APP_GLOBAL } from 'app/redux/type';
import { VerticalCardIcon } from 'assets/icons';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import NoSearchData from '../../assets/images/banks/no-search-data.png';
import NoData from '../../assets/images/banks/nodata.png';
import CardHistoryIcon from '../../assets/images/icon_fill_card_history_40.svg';
import DatePickerBottomSheet from '../../common/bottomsheets/DatePickerBottomSheet';
import FilterBottomSheet from '../../common/bottomsheets/FilterBottomSheet';
import TransactionDetailBottomSheet from '../../common/bottomsheets/TransactionDetailBottomSheet';
import HeaderAction from '../../common/ui/components/Header/HeaderAction';
import {
  emptyTransaction,
  getTransactionRequest,
  resetTransactions,
  searchTransaction,
  setCardFocus
} from './redux/action';
import { debitCardReducer } from './redux/reducer';
import { debitCardSaga } from './redux/saga';
import { cardSelectedSelector, cardsLoadState, searchLengthSelector, transactionSelector } from './redux/selector';
import { debitCardsURLs, FeatureDebitCardName } from './redux/type';

const TransactionHistoryPage = ({ translate }) => {
  useReducers([{ key: APP_GLOBAL, reducer: appGlobalReducer }]);
  const [isShowBottomSheet, setIsShowBottomSheet] = useState(false);
  const [isShowDateBottomSheet, setIsShowDateBottomSheet] = useState(false);
  const [isShowTransactionDetail, setIsShowTransactionDetail] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);
  const [isShowSearchArea, setIsShowSearchArea] = useState(false);
  const [isShowCancelButton, setIsShowCancelButton] = useState(false);
  const [transactionGroupedState, setTransactionGroupedState] = useState({});
  const [allTransaction, setAllTransaction] = useState({});
  const [transactionPicked, setTransactionPicked] = useState(null);
  const isNativeBack = useSelector(backEventSelector || false);
  const isLoading = useSelector(cardsLoadState);

  const defaultFilter = {
    sortBy: 'D',
    inquiries: INQUIRIES.SM,
    transType: 0,
    dateRang: { startDate: '', startDateString: '', endDate: '', endDateString: '' }
  };
  const [filterDataState, setFilterDataState] = useState(defaultFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchString, setSearchString] = useState('');

  const [searchResultsLenght, setSearchResultsLenght] = useState(null);
  const [currentDateScrolled, setCurrentDateScrolled] = useState({ date: '', index: 0 });

  useReducers([{ key: FeatureDebitCardName, reducer: debitCardReducer }]);
  useSagas([{ key: FeatureDebitCardName, saga: debitCardSaga }]);
  const cardSelected = useSelector(cardSelectedSelector) || {};
  //
  const transactions = useSelector(transactionSelector) || {};
  const searchLength = useSelector(searchLengthSelector) || null;

  const handleToggleDatePicker = useCallback(status => {
    if (isEmpty(allTransaction)) return;
    setIsShowDateBottomSheet(status);
  });

  const handleToggleBottomSheet = status => {
    setIsShowBottomSheet(status);
  };

  const handleToggleTransactionDetail = status => {
    setIsShowTransactionDetail(status);
  };

  const handleToggleShowSearch = status => {
    setIsShowSearchArea(status);
    setIsShowCancelButton(false);
  };

  useEffect(() => {
    if (isShowBottomSheet && isNativeBack) {
      setIsShowBottomSheet(false);
    }
    if (isShowDateBottomSheet && isNativeBack) {
      setIsShowDateBottomSheet(false);
    }
    if (isShowTransactionDetail && isNativeBack) {
      setIsShowTransactionDetail(false);
    }
    if (!isShowBottomSheet && !isShowDateBottomSheet && !isShowTransactionDetail && isNativeBack) {
      moveBack();
      setCardFocus(cardSelected?.card_no);
    }
    return () => {
      setIsNativeClickBack(false);
    };
  }, [isNativeBack, isShowBottomSheet, isShowDateBottomSheet, isShowTransactionDetail]);

  //apply date on date picker bottom sheet
  const handleApply = (month, year) => {
    if (transactionContainerRef.current && transactionsOffsetTopRef.current.length > 0) {
      if (month && year) {
        const datePicked = `${year}${dateNumberCheck(month)}`;
        const datePickedIndex = transactionsOffsetTopRef.current.map(el => el.elClass).indexOf(datePicked);
        setCurrentDateScrolled({ date: datePicked, datePickedIndex });
        handleScrollToDestination(transactionsOffsetTopRef.current[datePickedIndex].offTop - 130);
      }
    }
    setIsShowDateBottomSheet(false);
  };

  const renderNodata = (image, title, boldTitle = '') => {
    return (
      <section
        className={`history__nodata ${isShowSearchArea && searchString && 'search'} ${
          isShowSearchArea && 'search_area_mode'
        }`}
      >
        <img src={image} />
        {searchString ? (
          <section className="title">
            "<div className="bold__title">{`${boldTitle}`}</div>" &nbsp;
            {title}
          </section>
        ) : (
          <section className="title">
            <div className="bold__title">{`${boldTitle}`}</div>
            {title}
          </section>
        )}
        {!isShowSearchArea && (
          <section className="button__wrapper">
            <Button
              onClick={() => handleToggleBottomSheet(true)}
              variant="outlined"
              label={translate('lbl_BIQ3000000_0038')}
            />
          </section>
        )}
      </section>
    );
  };

  const renderTransactionItems = () => {
    //group by data and render transaction item
    if (transactionGroupedState.length === 0) return;
    let transactionEls = [];
    let transactionListSorted = Object.keys(transactionGroupedState);
    //sort transaction by month after group by
    if (filterDataState.sortBy === 'D') {
      transactionListSorted = transactionListSorted.reverse();
    }
    //render data by date of week
    transactionListSorted.forEach((transEachYear, index) => {
      let transDateSorted = Object.keys(transactionGroupedState[transEachYear]);
      //sort transaction by date in month
      if (filterDataState.sortBy === 'D') {
        transDateSorted = transDateSorted.reverse();
      }
      transactionEls.push(
        <section key={transEachYear + index} className={`${transEachYear} year__container`}>
          {transDateSorted.map((transEchMonth, transDateIndex) => (
            <section key={transEchMonth + transDateIndex} className="dashboard__item">
              {transDateIndex === 0 && index !== 0 && (
                <section className="month__year__header">{convertYYYYMMtoMMYYYY(transEachYear)}</section>
              )}
              <section className="date__time">
                {transactionGroupedState[transEachYear][transEchMonth][0]?.info?.card_trx_dt_full_display}
              </section>
              {transactionGroupedState[transEachYear][transEchMonth].map((transEachDay, transEachDayIndex) => (
                <section
                  key={transEachDay + transEachDayIndex}
                  className="history__item__wrapper"
                  onClick={() => {
                    handleToggleTransactionDetail(true);
                    setTransactionPicked(transEachDay);
                  }}
                >
                  {/* render transaction of week */}
                  <TransactionHistory
                    currency={{
                      amount: transEachDay.info.card_trx_amt_display,
                      type: 'withdraw',
                      unit: transEachDay.info.card_ccyc_c
                    }}
                    title={transEachDay.info.card_trx_mcht_nm || 'Cash Withdrawal'}
                    subTitle={null}
                    thumbnail={CardHistoryIcon}
                    transactionTime={convertToShortTime(transEachDay.info.card_trx_time)}
                    transactionType={transEachDay.info.card_rvng_d}
                  />
                </section>
              ))}
            </section>
          ))}
        </section>
      );
    });
    return transactionEls;
  };

  const renderDatePickerBottom = useMemo(() => {
    return (
      <DatePickerBottomSheet
        open={isShowDateBottomSheet}
        onClose={() => handleToggleDatePicker(false)}
        recentDatePick={currentDateScrolled.date}
        yearList={allTransaction}
        applyDatePicked={(month, year) => handleApply(month, year)}
      />
    );
  }, [isShowDateBottomSheet, currentDateScrolled.date]);

  const renderDetailBottom = () => {
    return (
      <TransactionDetailBottomSheet
        cardHolder={cardSelected?.card_holder_eng_nm}
        acno={cardSelected?.card_acno_display}
        transactionItem={transactionPicked}
        open={isShowTransactionDetail}
        onClose={() => handleToggleTransactionDetail(false)}
      />
    );
  };

  const transactionRef = useRef(null);
  const transactionContainerRef = useRef(null);
  const commonCodeList = useRef(null);
  const transactionsOffsetTopRef = useRef(null);
  const dataFilterBeforeResetRef = useRef(null);
  const dateStringInit = useRef(null);

  const handleApplyFilter = value => {
    setFilterDataState({ ...value });
    handleToggleBottomSheet(false);
    setIsFetching(true);
  };

  const combineCardData = () => {
    if (!cardSelected) return {};
    //format type for date
    const startDate = filterDataState.dateRang.startDateString?.split('.').reverse().join('');
    const endDate = filterDataState.dateRang.endDateString?.split('.').reverse().join('');
    let curDate = startDate || addDateWithMonth(6);
    let dateEnd = endDate || addDateWithMonth(0);
    //Check if in filter mode Custom
    if (filterDataState.inquiries !== INQUIRIES.custom) {
      curDate = addDateWithMonth(MONTH_VALUES[filterDataState.inquiries]);
      dateEnd = addDateWithMonth(0);
    }
    //gen payload for API
    const cardParam = {
      card_no: cardSelected.card_no,
      card_filler: cardSelected.filler0020,
      card_k: cardSelected.card_k,
      inq_gbn: 1,
      inq_trx_division: filterDataState.transType,
      inq_st_dt: curDate,
      inq_close_dt: dateEnd,
      ord_g: filterDataState.sortBy
    };
    return cardParam;
  };

  const customResult = results => {
    //Group by api results
    if (!results) return null;
    let newResult = {};
    results.forEach(res => {
      const dt = res.card_trx_dt;
      //format date
      const dtMonthYear = res.card_trx_dt.slice(0, 6);
      const monthYear = res.card_trx_dt;
      if (newResult[dtMonthYear] === undefined) {
        newResult[dtMonthYear] = {};
      }
      if (newResult[dtMonthYear][monthYear] === undefined) {
        newResult[dtMonthYear][monthYear] = [];
      }
      newResult[dtMonthYear][monthYear].push({ year: dt, info: res, dayMonth: monthYear });
    });
    return newResult;
  };

  const handleDataByDate = () => {
    if (!transactions?.elData) return;
    if (transactions?.elData?.list_cnt === 0) {
      setTransactionGroupedState({});
      setAllTransaction({});
      dateStringInit.current = null;
    } else {
      const cusRes = customResult(transactions.elData.list);
      if (!dateStringInit.current) {
        let cusResKeys = Object.keys(cusRes);
        if (filterDataState.sortBy === 'D') {
          cusResKeys = cusResKeys.reverse();
        }
        dateStringInit.current = cusResKeys[0];
        setCurrentDateScrolled({ date: cusResKeys[0], index: 0 });
      }
      //check valid index in year arrays
      if (Object.keys(cusRes).length > 0) {
        setAllTransaction(cusRes);
        setTransactionGroupedState(cusRes);
      }
      return cusRes;
    }
  };

  const handleScrollToDestination = position => {
    transactionRef.current.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  };

  const handlePrevDate = () => {
    let newIndex;
    if (filterDataState.sortBy === 'D') {
      newIndex = currentDateScrolled.index + 1;
    } else {
      newIndex = currentDateScrolled.index - 1;
    }
    if (!transactionRef.current || !transactionsOffsetTopRef.current[newIndex]) return;
    handleScrollToDestination(transactionsOffsetTopRef.current[newIndex].offTop - 130);
  };

  const handleNextDate = () => {
    let newIndex;
    if (filterDataState.sortBy === 'D') {
      newIndex = currentDateScrolled.index - 1;
    } else {
      newIndex = currentDateScrolled.index + 1;
    }
    if (!transactionRef.current || !transactionsOffsetTopRef.current[newIndex]) return;
    handleScrollToDestination(transactionsOffsetTopRef.current[newIndex].offTop - 130);
  };

  
  const handleGetTransactionFromServ = async () => {
    const requestData = combineCardData();
    getTransactionRequest(requestData);
    setIsFetching(false);
  };

  const handleGetCommonCodeList = async () => {
    // get filter data
    const transTypeParams = cardSelected?.card_virtual_yn === 1 ? 'rvng_utl_v' : 'rvng_utl_p';
    const commonCodes = await apiCall(debitCardsURLs.COMMON_CODE_LIST, 'POST', {
      code: transTypeParams
    });
    if (!commonCodes?.data?.elData[transTypeParams]) return;
    let commonCustomRes = {};
    commonCodes.data.elData[transTypeParams].forEach(cmCode => {
      commonCustomRes[cmCode.value] = cmCode.key;
    });
    commonCodeList.current = commonCodes;
  };

  //handle search on Enter
  const handleOnSearchKeyUp = e => {
    if (e.key === 'Enter') {
      if (searchTerm === null || searchTerm === '') {
        resetTransactions();
      } else {
        setSearchString(searchTerm);
        searchTransaction(searchTerm);
      }
    }
  };

  const getScrollTop = () => {
    //get scrollTop value of transactions element
    if (isShowSearchArea) return;
    const parentScrollHeigh = transactionRef.current.scrollTop;
    const headerHeight = transactionContainerRef.current.getElementsByClassName('header__wrapper')[0].offsetHeight;
    const headerActionHeight =
      transactionContainerRef.current.getElementsByClassName('header__action__wrapper')[0]?.offsetHeight;
    const toTalHeaderHeight = headerHeight + headerActionHeight;
    const currentSrollTop = parentScrollHeigh + toTalHeaderHeight;
    return currentSrollTop;
  };

  const getAllTransOffsetTop = () => {
    //get offsetTop value of all transactions element
    const transElements = transactionRef.current.getElementsByClassName('year__container');
    if ([...transElements].length === 0) {
      transactionsOffsetTopRef.current = [];
      return [];
    } else {
      let elOffsetTops = [];
      [...transElements].forEach(el => {
        elOffsetTops.push({ elClass: el.className.slice(0, 6), offTop: el.offsetTop, offHeight: el.offsetHeight });
      });
      transactionsOffsetTopRef.current = [...elOffsetTops];
      return [...elOffsetTops];
    }
  };

  const handleScrollTransaction = () => {
    //handle change date on header when scroll transactions
    scrollImpact(transactionRef.current, setIsHeaderExpand);
    if (!transactionsOffsetTopRef.current || transactionsOffsetTopRef.current.length === 0) return;
    const scrollTopValue = getScrollTop();
    let currentElOnTop = '';
    transactionsOffsetTopRef.current.forEach((transEl, transIndex) => {
      const positionOnTop = scrollTopValue - transEl.offTop;
      //check range of element to change date on header
      if (
        (positionOnTop > -50 && positionOnTop < 70) ||
        (positionOnTop <= transEl.offHeight - 130 && positionOnTop >= transEl.offHeight - 150)
      ) {
        currentElOnTop = { date: transEl.elClass, index: transIndex };
      }
    });
    if (currentElOnTop && currentElOnTop !== currentDateScrolled.date) {
      setCurrentDateScrolled({ ...currentElOnTop });
    }
  };

  const handleScollTopTransaction = () => {
    //scroll to top of transactions list
    if (!transactions?.elData || transactions?.elData.list_cnt === 0) return;
    if (!transactionsOffsetTopRef.current || !transactionsOffsetTopRef.current[0]) return;
    transactionRef.current.scrollTo({
      top: transactionsOffsetTopRef.current[0].offTop - 80,
      behavior: 'smooth'
    });
  };

  const handleResetFilter = () => {
    dataFilterBeforeResetRef.current = filterDataState;
    setFilterDataState(defaultFilter);
  };

  useEffect(() => {
    //get commonCodeList on first time
    handleGetCommonCodeList();
    return () => {
      emptyTransaction();
    };
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    handleGetTransactionFromServ();
  }, [isFetching]);

  useEffect(() => {
    handleDataByDate();
  }, [transactions]);

  useEffect(() => {
    if (searchLength === null && searchTerm) {
      setSearchResultsLenght(0);
    } else {
      setSearchResultsLenght(searchLength);
    }
  }, [searchLength]);

  useEffect(() => {
    if (Object.keys(transactionGroupedState).length === 0 || !currentDateScrolled.date) {
      const currentDate = new Date();
      let initDate = `${currentDate.getFullYear()}${dateNumberCheck(currentDate.getMonth() + 1)}`;
      setCurrentDateScrolled({ date: initDate, index: 0 });
    }
    getAllTransOffsetTop();
  }, [transactionGroupedState]);

  useEffect(() => {
    if (isLoading) {
      handleScrollToDestination(0);
    } else {
      handleScollTopTransaction();
    }
  }, [isLoading]);

  return (
    <div className="transaction__history" ref={transactionContainerRef}>
      <Header
        title={translate('men_KHCD800001')}
        isExpand={isHeaderExpand}
        onClick={() => {
          moveBack();
          setCardFocus(cardSelected?.card_no);
        }}
      />
      <section
        ref={transactionRef}
        className={`transaction__body ${Object.keys(transactionGroupedState).length === 0 && 'nodata'}`}
        onScroll={handleScrollTransaction}
      >
        {isLoading && <Spinner />}
        {isShowSearchArea ? (
          <section className={`transaction__search_wrapper ${!isShowCancelButton ? 'hidden_cancel' : ''}`}>
            <InputSearch
              onChange={e => setSearchTerm(e.target.value)}
              onCancel={() => {
                handleToggleShowSearch(false);
                resetTransactions();
                setSearchString(null);
              }}
              onClear={() => {
                setSearchTerm(null);
                setSearchResultsLenght(null);
              }}
              type="text"
              onKeyUp={handleOnSearchKeyUp}
              inputMode="text"
              value={searchTerm}
            />
            {searchString && searchResultsLenght !== null && searchResultsLenght !== 0 && (
              <section className="search__result">
                <span>
                  <b>{searchResultsLenght}</b>
                  {translate('lbl_BTR4000000_0060')}
                  <b>{searchString}</b>
                </span>
              </section>
            )}
          </section>
        ) : (
          <>
            <section className="transaction__card__info">
              <ShortCard
                title={cardSelected && cardSelected.card_nm}
                subTitle={cardSelected && cardSelected.card_no}
                icon={<VerticalCardIcon />}
              />
            </section>
            <section className="header__action__wrapper">
              <HeaderAction
                movePrev={handlePrevDate}
                moveNext={handleNextDate}
                showDataPicker={handleToggleDatePicker}
                filterAction={handleToggleBottomSheet}
                searchAction={handleToggleShowSearch}
                recentDate={convertDateToMMYYYY(currentDateScrolled.date)}
              />
            </section>
          </>
        )}
        <section className="history__dashboard">
          {Object.keys(transactionGroupedState).length > 0
            ? renderTransactionItems()
            : isShowSearchArea && searchString
              ? renderNodata(NoSearchData, translate('lbl_BIQ3000000_0041').replace('%1', ''), searchString)
              : renderNodata(NoData, translate('lbl_BIQ3000000_0037'))}
        </section>
      </section>
      <FilterBottomSheet
        open={isShowBottomSheet}
        onClose={() => handleToggleBottomSheet(false)}
        apllyFilter={handleApplyFilter}
        filterDataStateDefault={filterDataState}
        resetFilter={handleResetFilter}
        filterTypeData={commonCodeList.current}
        dataFilterBeforeRese={dataFilterBeforeResetRef.current}
        onCancelReset={() => setFilterDataState({ ...dataFilterBeforeResetRef.current })}
      />
      {renderDetailBottom()}
      {renderDatePickerBottom}
    </div>
  );
};

export default withHTMLParseI18n(TransactionHistoryPage);
