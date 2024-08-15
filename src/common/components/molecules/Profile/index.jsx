import React from 'react';
import { PropTypes } from 'prop-types';
import { AVATAR_SIZES } from 'configs/global/constants';
import { SOLAvatar } from 'assets/icons';

const Profile = props => {
  const { clazz, size, avatarURL, badgeURL } = props;
  const badgeSize = AVATAR_SIZES[size] / 2;
  const avatarSize = {
    height: AVATAR_SIZES[size] / 3,
    width: AVATAR_SIZES[size] / 2
  };

  return (
    <div
      className="profile__wrapper"
      style={{ height: `${+AVATAR_SIZES[size] + badgeSize / 4}px`, width: `${+AVATAR_SIZES[size] + badgeSize / 4}px` }}
    >
      <div className="profile">
        <div
          className="profile__avatar"
          style={{
            width: `${AVATAR_SIZES[size]}px`,
            height: `${AVATAR_SIZES[size]}px`,
            fontSize: `${AVATAR_SIZES[size] / 4}px`,
            backgroundColor: `${!avatarURL && '#0e45b3'}`
          }}
        >
          {avatarURL ? (
            <img src={avatarURL} alt="profile" />
          ) : (
            <SOLAvatar width={avatarSize.width} height={avatarSize.height} />
          )}
          {badgeURL && (
            <div
              className="profile__badge"
              style={{
                width: `${badgeSize}px`,
                height: `${badgeSize}px`,
                right: `-${badgeSize / 4}px`,
                bottom: `-${badgeSize / 4}px`
              }}
            >
              <img src={badgeURL} alt="badge" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  size: PropTypes.oneOf(['w-32', 'w-40', 'w-52', 'w-56', 'w-80']),
  avatarURL: PropTypes.any
};

Profile.defaultProps = {
  size: 'w-40'
};

export default Profile;
