import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import EmptyNotification from './EmptyNotification';

const YourOffersTab = props => {
  const { offerList, translate, notificationListRef } = props;

  return (
    <div
      ref={notificationListRef}
      className="notification__list"
    >
      {offerList?.length > 0 ? (
        offerList.map((item, index) => (
          <div
            className={`transaction__item__wrapper notification ${item.push_confm_yn === 1 ? 'read' : 'unread'}`}
            key={index}
          >
            <div className="offer__item">
              <div className="offer__label">{item.push_msg_ttl}</div>
              <div className="offer__title mt-1">{item.push_msg_ctt}</div>
              <div className="offer__time">
                {`${item.gms_stt_date_display} ${item.gms_stt_time_display.slice(0, 5)}`}
              </div>
            </div>
          </div>
        ))
      ) : (
        <EmptyNotification translate={translate} />
      )}
    </div>
  );
};

export default withHTMLParseI18n(YourOffersTab);
