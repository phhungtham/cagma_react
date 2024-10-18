import { ArrowRight } from '@assets/icons';
import BottomSheet from '@common/components/templates/BottomSheet';
import { changeProfileLabels as labels } from '@common/constants/labels';
import { PropTypes } from 'prop-types';

import '../styles.scss';

const ChangePhotoBottom = ({ open, onClose, onClickOpenCamera, onClickOpenGallery, translate: t }) => {
  const onClickAccessCamera = () => {
    onClickOpenCamera();
  };

  const onClickAccessPhotos = () => {
    onClickOpenGallery();
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
            <span className="option__label">{t(labels.takePhoto)}</span>
            <ArrowRight />
          </div>
          <div
            className="dropdown__option"
            onClick={onClickAccessPhotos}
          >
            <span className="option__label">{t(labels.uploadGallery)}</span>
            <ArrowRight />
          </div>
        </div>
      </BottomSheet>
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
