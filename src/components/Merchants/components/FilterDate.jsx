import Chips from '@common/ui/components/atomic/Chips';
import { convertDateTime } from '@common/utils/formater';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { getDateToYYYYMMDD } from '@utilities/dateTimeUtils';
import { nativeParamsSelector } from 'app/redux/selector';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getSalesAnalysis } from '../redux/action';
import { merchantSelectedSelector, transactionSelector } from '../redux/selector';
import CalendarInput from './CalendarInput';

const FilterDate = ({ filterDate, handleSetFilterDate, handleGetTransactionFromServ, translate }) => {
  const merchantSelected = useSelector(merchantSelectedSelector) || {};
  const transactions = useSelector(transactionSelector) || {};
  const nativeParams = useSelector(nativeParamsSelector);

  const defaultDateRange = {
    startDateString: convertDateTime(new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000)),
    startDate: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000),
    endDateString: convertDateTime(new Date()),
    endDate: new Date()
  };
  const [dateRange, setDateRange] = useState(defaultDateRange);

  useEffect(() => {
    if (filterDate === 'yearly')
      handleGetTransactionFromServ({
        mcht_id: nativeParams?.mcht_id || '000012',
        trx_d: 2,
        inq_st_dt: getDateToYYYYMMDD(dateRange.startDate),
        inq_close_dt: getDateToYYYYMMDD(dateRange.endDate)
      });
    else if (filterDate === 'weekly' || filterDate === 'monthly')
      handleGetTransactionFromServ({
        mcht_id: nativeParams?.mcht_id || '000012',
        trx_d: 1,
        inq_st_dt: getDateToYYYYMMDD(dateRange.startDate),
        inq_close_dt: getDateToYYYYMMDD(dateRange.endDate)
      });
  }, [dateRange]);
  return (
    <>
      <div className="chip-wrapper">
        <Chips
          type="default"
          segments={[
            {
              label: translate('lbl_com_3265'),
              value: 'week',
              handleClick: () => {
                if (filterDate === 'weekly') return;
                else handleSetFilterDate('weekly');
              }
            },
            {
              label: translate('lbl_com_3266'),
              value: 'month',
              handleClick: () => {
                if (filterDate === 'monthly') return;
                else handleSetFilterDate('monthly');
              }
            },
            {
              label: translate('lbl_com_3267'),
              value: 'year',
              handleClick: () => {
                if (filterDate === 'yearly') return;
                else handleSetFilterDate('yearly');
              }
            }
          ]}
          defaultActive={'week'}
        />
      </div>
      <div style={{ height: '1vh' }}></div>
      <div className="calendar-wrapper">
        <section className="calendar__input__wrapper show">
          <CalendarInput
            clazz="calendar_bottom"
            inputType="calendar"
            filterDate={filterDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </section>
      </div>
    </>
  );
};

export default withHTMLParseI18n(FilterDate);
