import Header from '@common/ui/components/Header';
import { isEmpty, moveBack } from '@utilities/index';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import LineChart from './components/Linechart';
import FilterDate from './components/FilterDate';
import { merchantLoadState, transactionSelector } from './redux/selector';
import { getSalesAnalysis } from './redux/action';
import { backEventSelector, nativeParamsSelector } from 'app/redux/selector';
import useReducers from '@hooks/useReducers';
import { FeatureMerchantName } from './redux/type';
import { myMerchantReducer } from './redux/reducer';
import { APP_GLOBAL } from 'app/redux/type.js';
import { appGlobalReducer } from 'app/redux/reducer.js';
import useSagas from '@hooks/useSagas';
import { merchantSaga } from './redux/saga';
import Spinner from '@common/ui/components/atomic/Spinner';
import { getDateToYYYYMMDD, getDayOfWeek } from '@utilities/dateTimeUtils';
import Alert from '@common/ui/components/atomic/Alert/Alert';
import { alertMove } from '@utilities/alertMove';
import { setIsNativeClickBack } from 'app/redux/action';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n.jsx';
import { setIsShowCalendar } from '@components/Merchants/redux/action';

const SalesAnalysis = ({ translate }) => {
  useReducers([
    { key: FeatureMerchantName, reducer: myMerchantReducer },
    { key: APP_GLOBAL, reducer: appGlobalReducer }
  ]);
  useSagas([{ key: FeatureMerchantName, saga: merchantSaga }]);

  const transactions = useSelector(transactionSelector) || {};
  const isLoading = useSelector(merchantLoadState);
  const headerWrapRef = useRef();
  const headerBodyRef = useRef();
  const nativeParams = useSelector(nativeParamsSelector);
  const [filterDate, setFilterDate] = useState('weekly');
  const [params, setParams] = useState({});
  const isNativeBack = useSelector(backEventSelector || false);

  const handleGoBack = () => {
    moveBack();
  };

  useLayoutEffect(() => {
    if (isNativeBack) {
      handleGoBack();
      setIsShowCalendar(false);
    }
    return () => {
      setIsNativeClickBack(false);
    };
  }, [isNativeBack]);

  useEffect(() => {
    setParams(nativeParams);
  }, []);

  const [errMsg, setErrMsg] = useState({
    isError: false,
    errMsg: null,
    errTitle: null
  });
  function getLastWeeksDate() {
    const now = new Date();
    return new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  }

  const handleGetTransactionFromServ = async request => {
    getSalesAnalysis(request);
  };

  const handleSetFilterDate = filter => {
    setFilterDate(filter);
  };

  const tempTotalValueTrx = transactions?.elData?.trx_statistics?.reduce((accumulator, currentValue) => {
    if (currentValue.hasOwnProperty('all_samt')) {
      return accumulator + currentValue.all_samt;
    } else {
      return accumulator;
    }
  }, 0);
  const tempTotalTrx = transactions?.elData?.trx_statistics?.reduce((accumulator, currentValue) => {
    if (currentValue.hasOwnProperty('trx_cnt')) {
      return accumulator + currentValue.trx_cnt;
    } else {
      return accumulator;
    }
  }, 0);
  const count = transactions?.elData?.trx_statistics?.filter(item => item.hasOwnProperty('trx_dt')).length;

  const formatNumberWithCommas = input => input?.replace(/,/g, '')?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const totalValueTrx = tempTotalValueTrx;

  const totalTrx = tempTotalTrx;

  const formattedTotalValueTrx = formatNumberWithCommas(tempTotalValueTrx?.toFixed(2));

  const formattedTotalValueTrxKHR = formatNumberWithCommas(tempTotalValueTrx?.toFixed(0));

  const formattedTotalTrx = formatNumberWithCommas(tempTotalTrx?.toFixed(0));

  const formattedAverageValue = formatNumberWithCommas((totalValueTrx / count).toFixed(2));

  const formattedAverageValueKHR = formatNumberWithCommas((totalValueTrx / count).toFixed(0));

  const formattedAverageTrx = formatNumberWithCommas((totalTrx / count).toFixed(1));

  const backToCard = () => {
    setErrMsg({ ...errMsg, isError: false, errMsg: null, errTitle: false });
  };

  const handleSetIsFetching = () => {};

  useLayoutEffect(() => {
    checkClickOutside();
  }, []);

  const checkClickOutside = () => {
    const bottomSheetFilter = document.querySelector('.sales-analysis');
    if (!bottomSheetFilter) return;

    return bottomSheetFilter.addEventListener('click', e => {
      const reactCalender = document.querySelector('.calendar_bottom .date__picker') || null;
      const calendarIconLeft = document.querySelector('.calendar_bottom .calendar__icon__left') || null;
      const calendarIconRight = document.querySelector('.calendar_bottom .calendar__icon__right') || null;
      if (!reactCalender && !calendarIconLeft && !calendarIconRight) return;
      if (
        !reactCalender?.contains(e.target) &&
        !calendarIconLeft?.contains(e.target) &&
        !calendarIconRight?.contains(e.target)
      ) {
        setIsShowCalendar(false);
      }
    });
  };

  return (
    <>
      <div className="sales-analysis">
        <div className="header-wrapper">
          <section ref={headerWrapRef} className="top__wrapper">
            <Header
              ref={headerBodyRef}
              title={translate('men_KHPA500013')}
              isInline={true}
              clazz="title-inline"
              onClick={handleGoBack}
            />
          </section>
          {/* <div className="screen-name">{translate('men_KHPA500013')}</div> */}
          <div className="account-info-wrapper">
            <div className="account-info">
              <div className="account-info-icon">
                <svg
                  style={{ height: '100%', width: 'auto' }}
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="36" height="36" rx="18" fill="#222428" fill-opacity="0.4" />
                  <path
                    d="M22.8809 10.3975C23.3557 10.3975 23.7774 10.6954 23.9887 11.1206C24.0598 11.2637 24.1366 11.41 24.2176 11.5581C24.329 11.7616 24.1843 12.0139 23.9523 12.0139H11.8951C11.6605 12.0139 11.5167 11.7569 11.6394 11.557L12.0197 10.9373C12.2256 10.6019 12.5909 10.3975 12.9845 10.3975H22.8809Z"
                    fill="white"
                  />
                  <path
                    d="M11.3047 13.0139C10.957 13.0139 10.6343 13.1945 10.4524 13.4908L9.85548 14.4633C9.63677 14.8197 9.49902 15.235 9.59244 15.6425C9.88075 16.9002 11.0079 17.8383 12.3511 17.8383C13.912 17.8383 15.1811 16.5714 15.1811 15.0083C15.1811 16.5714 16.4502 17.8383 18.0112 17.8383C18.6435 17.8383 19.2272 17.6294 19.7004 17.2778C20.3902 16.7616 20.8412 15.9369 20.8412 15.0083C20.8412 16.5714 22.1103 17.8383 23.6713 17.8383C24.9705 17.8383 26.0675 16.9607 26.3989 15.7651C26.5316 15.2864 26.3379 14.7956 26.0475 14.3926C25.8639 14.1379 25.6387 13.8189 25.3989 13.4646C25.2097 13.1849 24.8956 13.0139 24.5579 13.0139H11.3047Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20.381 18.1849L20.3778 18.1873C19.7184 18.6772 18.8999 18.9711 18.0135 18.9711C16.9057 18.9711 15.903 18.5155 15.1834 17.7812C14.4639 18.5155 13.4612 18.9711 12.3534 18.9711C11.9367 18.9711 11.5351 18.9067 11.1578 18.7874V24.4711C11.1578 25.0963 11.6646 25.6031 12.2898 25.6031H15.5422V22.1283C15.5422 21.5031 16.049 20.9962 16.6742 20.9962H19.1947C19.8199 20.9962 20.3267 21.5031 20.3267 22.1283V25.6031H23.5764C24.2016 25.6031 24.7084 25.0963 24.7084 24.4711V18.8345C24.3786 18.9236 24.0316 18.9711 23.6736 18.9711C22.5654 18.9711 21.5623 18.5152 20.8427 17.7803C20.6993 17.9269 20.5449 18.0622 20.381 18.1849ZM24.7084 15.3154V17.6436C24.3878 17.7698 24.0387 17.8391 23.6736 17.8391C22.8134 17.8391 22.0418 17.4543 21.5224 16.8472C21.1617 16.4257 20.9227 15.8969 20.86 15.3154H24.7084ZM20.1631 16.8471C20.5238 16.4255 20.764 15.8967 20.827 15.3154H15.1999C15.2626 15.8975 15.502 16.4266 15.8632 16.8484C16.3826 17.4548 17.1538 17.8391 18.0135 17.8391C18.6458 17.8391 19.2295 17.6301 19.7027 17.2786C19.8715 17.1522 20.026 17.0074 20.1631 16.8471ZM11.1578 15.3154H15.167C15.1043 15.8975 14.8649 16.4266 14.5037 16.8484C13.9843 17.4548 13.2131 17.8391 12.3534 17.8391C11.9263 17.8391 11.5211 17.7443 11.1578 17.5745V15.3154Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="account-info-text">
                <div className="account-name" placeholder="SHINHANFOODCOURT">
                  {params?.mcht_eng_nm}
                </div>
                <div className="account-number">
                  Linked to {params?.mcht_acno_display} ({params?.mcht_ac_ccy_c})
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-wrapper">
          <div style={{ height: '1vh' }}></div>
          <FilterDate
            handleSetIsFetching={handleSetIsFetching}
            filterDate={filterDate}
            handleSetFilterDate={handleSetFilterDate}
            handleGetTransactionFromServ={handleGetTransactionFromServ}
          />

          {isLoading && isEmpty(transactions) ? (
            <Spinner />
          ) : transactions?.elHeader?.resSuc ? (
            <>
              <div className="trx_wrapper">
                <div style={{ height: '1vh' }}></div>
                <div className="container-total">
                  <div className="total-value">{translate('lbl_BIQ3100000_0002')}</div>
                  <div className="total-trx">
                    <div className="total-value-stt">
                      <span className="bold_number">
                        {params?.mcht_ac_ccy_c === 'USD' ? formattedTotalValueTrx : formattedTotalValueTrxKHR}
                      </span>
                      <span className="total-trx-stt"> {params?.mcht_ac_ccy_c}</span>
                    </div>
                    <div className="total-stt">
                      <span className="bold_number">{formattedTotalTrx} </span>
                      <span className="total-trx-stt">TRX</span>
                    </div>
                  </div>
                </div>
                <div style={{ height: '1vh' }}></div>
                <div className="container-average">
                  <div className="daily-value">
                    <div className="upper-text">{translate('lbl_KHMM1140000_0023')}</div>
                    <div className="lower-text">
                      {filterDate === 'weekly' || filterDate === 'monthly'
                        ? `${translate('lbl_KHMM1140000_0056')}`
                        : `${translate('lbl_KHMM1140000_0057')}`}
                    </div>
                  </div>

                  <div className="daily-trx">
                    <div className="daily-total-value-stt">
                      <span className="bold_number">
                        {params?.mcht_ac_ccy_c === 'USD' ? formattedAverageValue : formattedAverageValueKHR}
                      </span>
                      <span className="total-trx-stt"> {params?.mcht_ac_ccy_c}</span>
                    </div>
                    <div className="daily-total-stt">
                      <span className="bold_number">{formattedAverageTrx} </span>
                      <span className="total-trx-stt">TRX</span>
                    </div>
                  </div>
                </div>
                <div style={{ height: '1vh' }}></div>
              </div>
              <div className="sales-graph">
                <LineChart transactions={transactions} filterDate={filterDate} nativeParams={params} />
              </div>
            </>
          ) : (
            <Alert
              isCloseButton={false}
              isShowAlert={true}
              subtitle={transactions?.elHeader?.resMsg}
              alertType={transactions?.elHeader?.resMsgVo?.msgType}
              firstButton={{
                onClick: () => {
                  alertMove(transactions?.elHeader?.resMsgVo?.msgId);
                },
                label: translate('lbl_cta_3006')
              }}
            />
          )}
          {isLoading && <Spinner />}
        </div>
      </div>
    </>
  );
};

export default withHTMLParseI18n(SalesAnalysis);
