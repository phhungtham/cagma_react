import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import EmptyNotification from './EmptyNotification';
import './styles.scss';

const TransactionsTab = props => {
  const { transactionList, translate, notificationListRef, onClick, showLoading } = props;

  return (
    <div
      ref={notificationListRef}
      className="notification__list"
    >
      {!showLoading && (
        <>
          {transactionList?.length > 0 ? (
            transactionList.map((item, index) => (
              <div
                className={`transaction__item__wrapper notification  ${item.push_confm_yn === 1 ? 'read' : 'unread'}`}
                key={index}
                onClick={() => onClick(item)}
              >
                <div className="transaction__item">
                  <div className="transaction__title">{item.push_msg_ctt}</div>
                  <div className="transaction__time">
                    {`${item.gms_stt_date_display} ${item.gms_stt_time_display.slice(0, 5)}`}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyNotification translate={translate} />
          )}
        </>
      )}
    </div>
  );
};

export default withHTMLParseI18n(TransactionsTab);
