import Currency from '@common/components/atoms/Currency';
import Span from '@common/components/atoms/Span';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { PropTypes } from 'prop-types';

const TransactionHistory = props => {
  const {
    translate,
    clazz,
    title,
    subTitle,
    transactionTime,
    // transactionType,
    currency,
    transactionBalance,
    transactionLoan,
    thumbnail,
    memo,
    status,
    orderNumber,
    onCancel,
    cancelButton,
    // ...otherProps
  } = props;

  const TRANSACTION_IS_PENDING = status === 'pending';

  const renderBarDivider = () => {
    return <div className="bar" />;
  };

  return (
    <div className={`${clazz} transaction__wrapper`}>
      <div className="transaction__left">
        {thumbnail && (
          <div className="transaction__thumbnail">
            <img
              src={thumbnail}
              alt={title}
            />
          </div>
        )}
        <div className="transaction__info">
          <div className="transaction__info__main">
            {orderNumber && (
              <Span
                clazz="transaction__info__order"
                text={orderNumber}
              />
            )}
            {title && orderNumber && renderBarDivider()}
            <Span
              clazz="transaction__info__title"
              text={title}
            />
          </div>
          {(subTitle || TRANSACTION_IS_PENDING) && (
            <div className="transaction__info__sub">
              <Span
                clazz={`transaction__info__subtitle ${status}`}
                text={subTitle || 'Processing'}
              />
              {memo && renderBarDivider()}
              {memo && (
                <Span
                  clazz="transaction__info__memo"
                  text={memo}
                />
              )}
            </div>
          )}

          <Span
            clazz="transaction__info__time"
            text={transactionTime}
          />
        </div>
      </div>
      <div className="transaction__right">
        <div className="transaction__amount">
          <Currency
            type={currency?.type}
            amount={currency?.amount}
            unit={currency?.unit}
          />
        </div>
        {transactionBalance && (
          <div className="transaction__balance">
            <Currency
              type="graySmall"
              amount={transactionBalance?.amount}
              unit={transactionBalance?.unit}
            />
          </div>
        )}
        {transactionLoan && (
          <div className="transaction__loan">
            <div className="loan_outstanding">
              <Currency
                label="Outstanding balance"
                type="graySmall"
                amount={transactionLoan?.outstandingBalance}
                unit={transactionLoan?.unit}
              />
            </div>
            {transactionLoan?.interestAmount && (
              <div className="loan__interest">
                <Currency
                  label="Interest amount"
                  type="graySmall"
                  amount={transactionLoan?.interestAmount}
                  unit={transactionLoan?.unit}
                />
              </div>
            )}
          </div>
        )}
        {cancelButton && (
          <Span
            clazz="transaction__cancel__button"
            text={translate('lbl_com_3032')}
            onClick={onCancel}
          />
        )}
      </div>
    </div>
  );
};

TransactionHistory.propTypes = {
  clazz: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  transactionTime: PropTypes.string,
  currency: PropTypes.object,
  transactionBalance: PropTypes.object,
  transactionLoan: PropTypes.object,
  thumbnail: PropTypes.string,
  memo: PropTypes.string,
  status: PropTypes.string,
  orderNumber: PropTypes.number,
  cancelButton: PropTypes.bool,
};

TransactionHistory.defaultProps = {
  clazz: '',
  title: '',
  subTitle: '',
  transactionTime: '',
  currency: null,
  transactionBalance: null,
  transactionLoan: null,
  thumbnail: '',
  memo: '',
  status: '',
  orderNumber: null,
  cancelButton: false,
};
export default withHTMLParseI18n(TransactionHistory);
