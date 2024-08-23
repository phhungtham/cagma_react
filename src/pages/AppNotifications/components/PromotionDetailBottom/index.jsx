import BottomSheet from '@common/components/templates/BottomSheet';
import './styles.scss';
import { ShareLineIcon } from '@assets/icons';
import Label from '@common/components/atoms/Label';

const PromotionDetailBottom = ({onClose}) => {
  return (
    <BottomSheet
      open={true}
      onClose={onClose}
      closeIcon={true}
      clazz="promotion-detail-bottom__wrapper"
      type="max-scroll"
    >
      <div className="promotion-detail-bottom__content">
        <div className='promotion__header'>
          <div className='promotion__title__wrapper'>
            <div className='promotion__title'>Spring has sprung!</div>
            <div className='promotion__share'>
              <ShareLineIcon />
            </div>
          </div>
          <div className='promotion__period'>
            <Label type="outline" variant="primary" clazz="mr-2" />
            <span>Mar 18, 2024</span>
            <span> ~ </span>
            <span>Mar 25, 2024</span>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default PromotionDetailBottom;