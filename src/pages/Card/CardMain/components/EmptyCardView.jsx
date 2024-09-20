import { ArrowRight, PlusIcon } from '@assets/icons';
import cardEmptyImg from '@assets/images/card-empty.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';

const EmptyCardView = () => {
  return (
    <div className="empty-card-view__wrapper page__container">
      <div className="empty-card__content">
        <div className="empty-card__img">
          <img
            src={cardEmptyImg}
            alt="card empty"
          />
        </div>
        <div className="empty-card__title">Access Card Service</div>
        <div className="empty-card__desc">
          <p>Enhance your life with</p>
          <p>Shinhan Access Card!</p>
        </div>
        <div className="empty-card__btn">
          <Button
            label="Get your New Card"
            variant="filled__secondary-blue"
            size="lg"
            startIcon={<PlusIcon />}
            onClick={() => {}}
          />
        </div>
        <div className="empty-card__note">
          <span>Already got your access card?</span>
          <Button
            label="Activate"
            variant="text__primary"
            size="sm"
            endIcon={<ArrowRight />}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyCardView;
