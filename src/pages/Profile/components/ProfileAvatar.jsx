import { useEffect, useState } from 'react';

import { SettingIcon } from '@assets/icons';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import callCamera from '@utilities/gmCommon/callCamera';
import callSelectImage from '@utilities/gmCommon/callSelectImage';
import initProfileImg from '@utilities/gmCommon/initProfileImg';
import loadProfileImgInfo from '@utilities/gmCommon/loadProfileImgInfo';
import saveProfileImg from '@utilities/gmCommon/saveProfileImg';

import ChangePhotoBottom from './ChangePhotoBottom';

const ProfileAvatar = ({ userName, setShowToast }) => {
  const [avatarUrl, setAvatarUrl] = useState();
  const [showDefaultAvatar, setShowDefaultAvatar] = useState(false);
  const [showChangeProfilePhotoBottom, setShowChangeProfilePhotoBottom] = useState(false);
  const [showAlertDeletePhoto, setShowAlertDeletePhoto] = useState(false);

  const firstCharacterOfName = userName?.[0];

  const handleProfileImg = result => {
    console.log('handleProfileImg:', result);
    const { statusCode, imageInfo, imageExt } = result || {};
    const isLoadSuccess = Number(statusCode) === 1000;

    if (isLoadSuccess && imageInfo) {
      setAvatarUrl(`data:image/${imageExt};base64,${imageInfo}`);
      setShowDefaultAvatar(false);
    } else {
      setShowDefaultAvatar(true);
    }
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

  const handleDeleteProfileCallback = result => {
    console.log('handleDeleteProfileCallback:', result);
    const { statusCode } = result || {};
    const isDeleteSuccess = Number(statusCode) === 1000;
    if (isDeleteSuccess) {
      setAvatarUrl(null);
      setShowDefaultAvatar(true);
      setShowToast({
        isShow: true,
        message: 'Your profile photo has been deleted.',
        type: 'success',
      });
    }
  };

  const handleConfirmDeletePhoto = () => {
    initProfileImg(handleDeleteProfileCallback);
    setShowAlertDeletePhoto(false);
  };

  const handleUpdateAvatarCallback = result => {
    console.log('handleUpdateAvatarCallback:', result);
    const { statusCode } = result || {};
    const isUpdateSuccess = Number(statusCode) === 1000;
    if (isUpdateSuccess) {
      setShowToast({
        isShow: true,
        message: 'Your profile photo has been updated.',
        type: 'success',
      });
      loadProfileImgInfo(handleProfileImg);
    }
  };

  const handleCallCameraCallback = fileInfo => {
    console.log('handleCallCameraCallback:', fileInfo);
    if (fileInfo) {
      // const { imageInfo } = fileInfo;
      // setAvatarUrl(imageInfo);
      saveProfileImg(handleUpdateAvatarCallback);
    }
  };

  const handleCallSelectImageCallback = fileInfo => {
    console.log('handleCallSelectImageCallback:', fileInfo);
    if (fileInfo) {
      // const { imageInfo } = fileInfo;
      // setAvatarUrl(imageInfo);
      saveProfileImg(handleUpdateAvatarCallback);
    }
  };

  const handleCallPluginOpenCamera = () => {
    callCamera(handleCallCameraCallback);
  };

  const handleCallPluginSelectImage = () => {
    callSelectImage(handleCallSelectImageCallback);
  };

  useEffect(() => {
    loadProfileImgInfo(handleProfileImg);
  }, [avatarUrl]);

  return (
    <>
      <div className="profile__avatar__wrapper">
        <div className="profile__avatar">
          <div className="avatar__img">
            {avatarUrl && !showDefaultAvatar ? (
              <img
                src={avatarUrl}
                alt="profile"
              />
            ) : (
              <div className="avatar__default">
                <span className="avatar__first-name">{firstCharacterOfName}</span>
              </div>
            )}
          </div>
          <div
            className="btn__setting"
            onClick={onOpenChangePhotoBottom}
          >
            <SettingIcon />
          </div>
        </div>
        {!!avatarUrl && (
          <div>
            <Button
              label="Delete"
              variant="outlined__gray"
              className="btn__delete btn__sm"
              onClick={handleClickDeleteAvatar}
            />
          </div>
        )}
      </div>
      <ChangePhotoBottom
        open={showChangeProfilePhotoBottom}
        onClose={onCloseChangePhotoBottom}
        onClickOpenCamera={handleCallPluginOpenCamera}
        onClickOpenGallery={handleCallPluginSelectImage}
      />
      <Alert
        isCloseButton={false}
        isShowAlert={showAlertDeletePhoto}
        onClose={() => setShowAlertDeletePhoto(false)}
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
