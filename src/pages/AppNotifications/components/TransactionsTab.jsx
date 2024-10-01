import { forwardRef } from 'react';

import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import EmptyNotification from './EmptyNotification';
import './styles.scss';

const TransactionsTab = forwardRef(({ transactionList, translate }, ref) => {
  return (
    <div
      ref={ref}
      className="notification__list checking"
    >
      {transactionList?.length > 0 ? (
        transactionList.map((item, index) => (
          <div
            className={`transaction__item__wrapper ${item.read ? 'read' : 'unread'}`}
            key={index}
          >
            <div className="transaction__item">
              <div className="transaction__title">{item.title}</div>
              <div className="transaction__time">{item.time}</div>
            </div>
          </div>
        ))
      ) : (
        <EmptyNotification />
      )}
    </div>
  );
});

export default withHTMLParseI18n(TransactionsTab);
