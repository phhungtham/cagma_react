import { forwardRef } from 'react';

import no_notification from '@assets/images/bell-no-result.png';
import Span from '@common/components/atoms/Span';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

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

export default withHTMLParseI18n(YourOffersTab);
