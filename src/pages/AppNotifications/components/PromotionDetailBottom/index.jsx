import BottomSheet from '@common/components/templates/BottomSheet';
import './styles.scss';
import { ShareLineIcon } from '@assets/icons';
import Label from '@common/components/atoms/Label';
import testImg from '@assets/images/promotion-detail-test.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';

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
        <div className='promotion__main'>
          <div className='promotion__main__img'>
            <img src={testImg} alt="Promotion Main" />
          </div>
          <div className='promotion__main__caption'>
            <div>Flip through the diary to find a lovely character!</div>
            <div>200 random people are chosen every day!</div>
          </div>
          <div className='promotion__main__desc'>
          Get a jelly crew 10,000 won coupon by recommending it to your friend, ! (Limited to 100 USD worth purchases)   Friends and I got coupons!
          </div>
          <div className='promotion__main__sub'>
          * First come, first served for 10,000 candidates
          </div>
        </div>
        <div className='bottom__footer btn__ctas'>
          <Button label="Try it now!" className="w-full" variant="filled__primary" />
        </div>
      </div>
    </BottomSheet>
  );
};

export default PromotionDetailBottom;