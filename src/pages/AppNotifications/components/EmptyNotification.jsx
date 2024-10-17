import emptyNotificationImg from '@assets/images/bell-no-result.png';
import { appNotiLabels } from '@common/constants/labels';

const EmptyNotification = ({ translate: t }) => {
  return (
    <div className="empty-notification__wrapper pt-8">
      <div className="empty-notification__img">
        <img
          src={emptyNotificationImg}
          alt="No notifications"
        />
      </div>
      <div className="empty-notification__note">{t(appNotiLabels.noNotification)}</div>
    </div>
  );
};

export default EmptyNotification;
