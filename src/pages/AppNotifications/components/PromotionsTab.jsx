import { forwardRef } from 'react';
import no_notification from '@assets/images/bell-no-result.png';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import Span from '@common/components/atoms/Span';

const PromotionsTab = forwardRef(({ promotionList, translate }, ref) => {
  return (
    <div ref={ref} className="notification__list checking">
      {promotionList?.length > 0 ? (
        promotionList.map((data, index) => (
          <div>Notice Item</div>
        ))
      ) : (
        <div className="notification__empty">
          <img src={no_notification} alt={'no_notification'} />
          <Span clazz="notification__empty__text" text={translate('No notifications')} />
        </div>
      )}
    </div>
  );
});

export default withHTMLParseI18n(PromotionsTab);
