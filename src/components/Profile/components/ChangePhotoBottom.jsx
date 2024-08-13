import { ArrowRight } from '@assets/icons';
import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import { PropTypes } from 'prop-types';
import '../styles.scss';
import { useState } from 'react';
import Alert from '@common/ui/components/atomic/Alert/Alert';

const ChangePhotoBottom = ({open, onClose}) => {

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
        clazz="change-profile-image-bottom"
        type="fit-content"
      >
        <div className="bottom-content">
          <div className="option-item" onClick={onClickAccessCamera}>
            <span className="option-label">Take Photo</span>
            <ArrowRight />
          </div>
          <div className="divider-item-solid"></div>
          <div className="option-item" onClick={onClickAccessPhotos}>
            <span className="option-label">Upload from Gallery</span>
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
          label: 'Allow'
        }}
        secondButton={{
          onClick: onCloseAccessCamera,
          label: 'Cancel'
        }}
      />
      <Alert
        isCloseButton={false}
        isShowAlert={showAccessPhotosAlert}
        title="Access to Photos"
        textAlign="center"
        firstButton={{
          onClick: handleAccessPhotos,
          label: 'Allow'
        }}
        secondButton={{
          onClick: onCloseAccessPhotos,
          label: 'Cancel'
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