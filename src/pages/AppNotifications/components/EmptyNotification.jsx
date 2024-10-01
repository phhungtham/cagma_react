import emptyNotificationImg from '@assets/images/bell-no-result.png';

const EmptyNotification = () => {
  return (
    <div className="empty-notification__wrapper pt-8">
      <div className="empty-notification__img">
        <img
          src={emptyNotificationImg}
          alt="No notifications"
        />
      </div>
      <div className="empty-notification__note">No notifications</div>
    </div>
  );
};

export default EmptyNotification;
