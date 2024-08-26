import { forwardRef } from 'react';

import no_notification from '@assets/images/bell-no-result.png';
import testImg from '@assets/images/notification-image-test.png';
import Span from '@common/components/atoms/Span';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

const PromotionsTab = forwardRef(({ promotionList, translate, onClick }, ref) => {
  return (
    <div
      ref={ref}
      className="notification__list checking"
    >
      {promotionList?.length > 0 ? (
        promotionList.map((item, index) => (
          <div
            className={`promotion__item__wrapper ${item.read ? 'read' : 'unread'}`}
            key={index}
            onClick={onClick}
          >
            <div className="promotion__item">
              <div className="promotion__img">
                <img
                  src={testImg}
                  alt="promotion logo"
                />
              </div>
              <div className="promotion__item__main">
                <div className="promotion__title">{item.title}</div>
                <div className="promotion__content">{item.content}</div>
              </div>
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

export default withHTMLParseI18n(PromotionsTab);
