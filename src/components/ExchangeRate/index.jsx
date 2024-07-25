import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import Span from '@common/ui/components/atomic/Span';
import Spinner from '@common/ui/components/atomic/Spinner';
import Header from '@common/ui/components/Header';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NoDataImage from '../../assets/images/bear-sad.png';
import { getExchangeRateInfo } from './redux/action';
import { exchangeRateReducer } from './redux/reducer';
import { exchangeRateSaga } from './redux/saga';
import { exchangeRateInfo, exchangeRateLoadState } from './redux/selector';
import { FeatureExchangeRateName } from './redux/type';
import { replaceString } from '@utilities/debitCardUtils';
import './styles.scss';

const ExchangeRate = ({ translate }) => {
  useReducers([{ key: FeatureExchangeRateName, reducer: exchangeRateReducer }]);
  useSagas([{ key: FeatureExchangeRateName, saga: exchangeRateSaga }]);
  const listExchangeRateInfo = useSelector(exchangeRateInfo);
  const isLoading = useSelector(exchangeRateLoadState);
  const [dateValue, setDateValue] = useState('');
  const navigate = useNavigate();

  const handleDateChange = e => {
    let date = e.target.value;
    setDateValue(date);
  };

  const handleGetExchangeRate = () => {
    const payload = {
      trx_func_d: 3,
      exrt_ing_d: 9,
      ntfct_dt: replaceString(dateValue,'-', '' ),
      ccy_c: '',
      ntfct_odr: 999
    };
    getExchangeRateInfo(payload);
  };

  return (
    <>
      <Header title={translate('lbl_BTR4000000_0017')} />
      <div className="exchange__wrapper">
        {isLoading && <Spinner />}
        <div className="exchange__body">
          <div className="exchange__input__date">
            <input className="input__date" type="date" onChange={handleDateChange} />
          </div>
          <Button variant={'solid'} label="Inquiry" onClick={handleGetExchangeRate} />
        </div>
        <div className="exchange__content">
          {dateValue && (
            <div className="date__wrap">
              <Span clazz="date__title" text="Standard Date" />
              <Span clazz="date__value" text={`${dateValue}`} />
            </div>
          )}
          {listExchangeRateInfo?.length ? (
            listExchangeRateInfo?.map((data, idx) => (
              <div className="exchange__info" key={idx}>
                <Span clazz="exchange__info__label" text={data.ccy_c} />
                <Span clazz="exchange__info__value" text={data.cash_buy_rt_display} />
              </div>
            ))
          ) : (
            <div className="nodata__image">
              <img src={NoDataImage} alt="" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withHTMLParseI18n(ExchangeRate);
