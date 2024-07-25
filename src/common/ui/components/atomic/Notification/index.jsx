import { ICON_NOTIFY_TYPE } from '@common/ui/constants';
import { DepositNotifyIcon, OtherIcon, QRIcon, WithdrawNotifyIcon } from 'assets/icons';
import { PropTypes } from 'prop-types';
import EventBanner from '../BannerGroup/EventsBanner';
import HomeBanner from '../BannerGroup/HomeBanner';
import List from '../ListGroup/List';
import TransactionHistory from '../TransactionHistory';

const Notification = props => {
  const {
    clazz,
    notifyType,
    label,
    title,
    time,
    notifyContent,
    isRead,
    currency,
    thumbnail,
    thumbnailType,
    onNotifyClick
  } = props;
  return (
    <div
      className={`notification ${clazz} ${isRead ? `${notifyType}__read` : `${notifyType}__unread`}`}
      onClick={onNotifyClick}
    >
      {notifyType === 'default' && (
        <List
          clazz="notification__custom"
          label={label}
          title={notifyContent}
          captionSegments={{
            caption1: time
          }}
          thumbnail={
            (thumbnailType === ICON_NOTIFY_TYPE.CREDIT_NOTICE && <DepositNotifyIcon />) ||
            (thumbnailType === ICON_NOTIFY_TYPE.DEBIT_NOTICE && <WithdrawNotifyIcon />) ||
            (thumbnailType === ICON_NOTIFY_TYPE.SHINHAN_KHQR && <QRIcon />) ||
            (thumbnailType === ICON_NOTIFY_TYPE.DEFAULT && <OtherIcon />) ||
            thumbnail
          }
        />
      )}
      {notifyType === 'transaction' && (
        <TransactionHistory
          clazz="notification__custom"
          title={title}
          transactionTime={time}
          currency={{ amount: currency?.amount, unit: currency?.unit, type: currency?.type }}
          thumbnail={thumbnail}
        />
      )}
      {notifyType === 'event-banner' && (
        <EventBanner
          description={notifyContent}
          date={{
            timeStart: time,
            position: 'bottom'
          }}
          thumbnail={thumbnail}
        ></EventBanner>
      )}
      {notifyType === 'home-banner' && (
        <HomeBanner description={notifyContent} heading={title} size="small" thumbnail={thumbnail}></HomeBanner>
      )}

      <div className="notifi__divider"></div>
    </div>
  );
};

Notification.propTypes = {
  clazz: PropTypes.string,
  notifyType: PropTypes.oneOf(['default', 'transaction', 'event-banner', 'home-banner', 'withdraw', 'deposit']),
  label: PropTypes.string,
  title: PropTypes.string,
  time: PropTypes.string,
  notifyContent: PropTypes.string,
  thumbnail: PropTypes.string,
  thumbnailType: PropTypes.oneOf(['Default', 'Debit Notice', 'Credit Notice', 'Shinhan KHQR Pay Notice']),
  isRead: PropTypes.bool,
  currency: PropTypes.object
};
Notification.defaultProps = {
  clazz: '',
  notifyType: 'default',
  label: '',
  title: '',
  time: '',
  notifyContent: '',
  thumbnail: null,
  thumbnailType: 'Default',
  isRead: true,
  currency: null
};
export default Notification;
