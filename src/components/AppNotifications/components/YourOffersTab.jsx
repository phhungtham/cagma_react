import { forwardRef } from 'react';
import no_notification from '@assets/images/bell-no-result.png';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import Span from '@common/ui/components/atomic/Span';

const YourOffersTab = forwardRef(({ offerList, translate }, ref) => {
  return (
    <div ref={ref} className="notification__list checking">
      {offerList?.length > 0 ? (
        offerList.map((data, index) => (
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

export default withHTMLParseI18n(YourOffersTab);
