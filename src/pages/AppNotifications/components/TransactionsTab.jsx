import { detectNotifyStatus } from '@common/utils/detect';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import EmptyNotification from './EmptyNotification';
import './styles.scss';

const TransactionsTab = props => {
  const { transactionList, translate, notificationListRef } = props;

  return (
    <div
      ref={notificationListRef}
      className="notification__list"
    >
      {transactionList?.length > 0 ? (
        transactionList.map((item, index) => (
          <div
            className={`transaction__item__wrapper notification  ${
              detectNotifyStatus(item.push_confm_yn) ? 'read' : 'unread'
            }`}
            key={index}
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
        <EmptyNotification />
      )}
    </div>
  );
};

export default withHTMLParseI18n(TransactionsTab);
