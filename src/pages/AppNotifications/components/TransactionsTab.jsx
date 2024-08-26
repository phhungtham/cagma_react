import { forwardRef } from 'react';

import no_notification from '@assets/images/bell-no-result.png';
import Span from '@common/components/atoms/Span';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

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
        <div className="notification__empty">
          <img
            src={no_notification}
            alt={'no_notification'}
          />
          <Span
            clazz="notification__empty__text"
            text={translate('No notifications')}
          />
        </div>
      )}
    </div>
  );
});

export default withHTMLParseI18n(TransactionsTab);
