import { useEffect, useState } from 'react';

import { SettingIcon } from '@assets/icons';
import avatarURL from '@assets/images/jack-icon.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Alert from '@common/components/molecules/Alert';
import loadProfileImgInfo from '@utilities/gmCommon/loadProfileImgInfo';

import ChangePhotoBottom from './ChangePhotoBottom';

const ProfileAvatar = () => {
  const [avatarUrl, setAvatarUrl] = useState(avatarURL);
  const [showChangeProfilePhotoBottom, setShowChangeProfilePhotoBottom] = useState(false);
  const [showAlertDeletePhoto, setShowAlertDeletePhoto] = useState(false);

  const handleProfileImg = result => {
    //TODO: Update Avatar. Pending because the plugin still not develop
  };

  const onOpenChangePhotoBottom = () => {
    setShowChangeProfilePhotoBottom(true);
  };

  const onCloseChangePhotoBottom = () => {
    setShowChangeProfilePhotoBottom(false);
  };

  const handleClickDeleteAvatar = () => {
    setShowAlertDeletePhoto(true);
  };

  const handleConfirmDeletePhoto = () => {
    //TODO: Call APi
    setShowAlertDeletePhoto(false);
  };

  useEffect(() => {
    loadProfileImgInfo(handleProfileImg);
  }, []);

  return (
    <>
      <div className="profile__avatar__wrapper">
        <div className="profile__avatar">
          <div className="avatar__img">
            <img
              src={avatarUrl}
              alt="profile"
            />
          </div>
          <div
            className="btn__setting"
            onClick={onOpenChangePhotoBottom}
          >
            <SettingIcon />
          </div>
        </div>
        <div>
          <Button
            label="Delete"
            variant="outlined__gray"
            className="btn__delete btn__sm"
            onClick={handleClickDeleteAvatar}
          />
        </div>
      </div>
      <ChangePhotoBottom
        open={showChangeProfilePhotoBottom}
        onClose={onCloseChangePhotoBottom}
      />
      <Alert
        isCloseButton={false}
        isShowAlert={showAlertDeletePhoto}
        title="Would you like to delete profile photo?"
        textAlign="center"
        firstButton={{
          onClick: handleConfirmDeletePhoto,
          label: 'Delete',
        }}
        secondButton={{
          onClick: () => setShowAlertDeletePhoto(false),
          // eslint-disable-next-line quotes
          label: "I'll do it next time",
        }}
      />
    </>
  );
};

export default ProfileAvatar;
