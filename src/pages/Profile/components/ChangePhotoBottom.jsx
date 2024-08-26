import { useState } from 'react';

import { ArrowRight } from '@assets/icons';
import Alert from '@common/components/molecules/Alert';
import BottomSheet from '@common/components/templates/BottomSheet';
import { PropTypes } from 'prop-types';

import '../styles.scss';

const ChangePhotoBottom = ({ open, onClose }) => {
  const [showAccessCameraAlert, setShowAccessCameraAlert] = useState(false);
  const [showAccessPhotosAlert, setShowAccessPhotosAlert] = useState(false);

  const onClickAccessCamera = () => {
    //TODO: Check permission access camera
    setShowAccessCameraAlert(true);
  };

  const onCloseAccessCamera = () => {
    setShowAccessCameraAlert(false);
  };

  const onClickAccessPhotos = () => {
    //TODO: Check permission access camera
    setShowAccessPhotosAlert(true);
  };

  const onCloseAccessPhotos = () => {
    setShowAccessPhotosAlert(false);
  };

  const handleAccessCamera = () => {
    console.log('access');
  };

  const handleAccessPhotos = () => {
    console.log('access');
  };

  return (
    <>
      <BottomSheet
        open={open}
        onClose={onClose}
        title="Change profile image"
        clazz="bottom__dropdown__wrapper"
        type="fit-content"
      >
        <div className="bottom__dropdown__list">
          <div
            className="dropdown__option"
            onClick={onClickAccessCamera}
          >
            <span className="option__label">Take Photo</span>
            <ArrowRight />
          </div>
          <div
            className="dropdown__option"
            onClick={onClickAccessPhotos}
          >
            <span className="option__label">Upload from Gallery</span>
            <ArrowRight />
          </div>
        </div>
      </BottomSheet>
      <Alert
        isCloseButton={false}
        isShowAlert={showAccessCameraAlert}
        title="Access to Camera"
        textAlign="center"
        firstButton={{
          onClick: handleAccessCamera,
          label: 'Allow',
        }}
        secondButton={{
          onClick: onCloseAccessCamera,
          label: 'Cancel',
        }}
      />
      <Alert
        isCloseButton={false}
        isShowAlert={showAccessPhotosAlert}
        title="Access to Photos"
        textAlign="center"
        firstButton={{
          onClick: handleAccessPhotos,
          label: 'Allow',
        }}
        secondButton={{
          onClick: onCloseAccessPhotos,
          label: 'Cancel',
        }}
      />
    </>
  );
};

ChangePhotoBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

ChangePhotoBottom.defaultProps = {
  open: false,
  onClose: undefined,
};

export default ChangePhotoBottom;
