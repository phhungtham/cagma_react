import { forwardRef } from 'react';

import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import EmptyNotification from './EmptyNotification';

const YourOffersTab = forwardRef(({ offerList, translate }, ref) => {
  console.log('offerList :>> ', offerList);
  return (
    <div
      ref={ref}
      className="notification__list checking"
    >
      {offerList?.length > 0 ? (
        offerList.map((item, index) => (
          <div
            className={`offer__item__wrapper ${item.read ? 'read' : 'unread'}`}
            key={index}
          >
            <div className="offer__item">
              <div className="offer__label">{item.label}</div>
              <div className="offer__title mt-1">{item.title}</div>
              <div className="offer__time">{item.time}</div>
            </div>
          </div>
        ))
      ) : (
        <EmptyNotification />
      )}
    </div>
  );
});

export default withHTMLParseI18n(YourOffersTab);
