import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import Currency from '@common/ui/components/atomic/Currency';
import useReducers from '@hooks/useReducers';
import { appGlobalReducer } from 'app/redux/reducer';
import { backEventSelector } from 'app/redux/selector';
import { APP_GLOBAL } from 'app/redux/type';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useSelector } from 'react-redux';
import CardHistoryIcon from '../../assets/images/icon_fill_card_history_40.svg';

const TransactionDetailBottomSheet = ({ open, onClose, transactionItem, acno, cardHolder, translate }) => {
  useReducers([{ key: APP_GLOBAL, reducer: appGlobalReducer }]);
  const isNativeBack = useSelector(backEventSelector || false);

  const renderInfoRow = () => {
    if (!transactionItem) return;
    let infoRows = [];
    const { info } = transactionItem;
    const rowsData = {
      lbl_BCD8000000_0017: info?.card_trx_no,
      lbl_BCD8000000_0018: `${info?.card_trx_dt_display} ${info?.card_trx_time_display}`,
      lbl_BCD8000000_0019: acno,
      lbl_BCD8000000_0020: info?.card_trx_nation_nm,
      lbl_BCD8000000_0021: info?.card_no_display,
      lbl_BCD8000000_0022: cardHolder,
      lbl_BCD8000000_0023: `${transactionItem?.info.card_trx_amt_display} ${transactionItem?.info.card_ccyc_c}`
    };
    Object.keys(rowsData).map((data, index) =>
      infoRows.push(
        <section key={data + index} className="transaction__row">
          <div className="title">{translate(data)}</div>
          <div className="content">{rowsData[data]}</div>
        </section>
      )
    );
    return infoRows;
  };

  return (
    <BottomSheet clazz={'transaction__detail__bottom'} title="" open={open} onClose={onClose} type="fit-content">
      <section className="transaction__detail__header">
        <div className="transaction__icon">
          <img src={CardHistoryIcon} />
        </div>
        <div className="transaction__info">
          <div className="title">{transactionItem?.info.card_trx_mcht_nm || 'Cash Withdrawal'}</div>
          <div className="subtitle">
            <Currency
              label=""
              type="graySmall"
              amount={transactionItem?.info.card_trx_amt_display}
              unit={transactionItem?.info.card_ccyc_c}
            />
          </div>
        </div>
      </section>
      <section className="transaction__detail__body">{renderInfoRow()}</section>
    </BottomSheet>
  );
};

export default withHTMLParseI18n(TransactionDetailBottomSheet);
