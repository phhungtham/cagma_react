import { ArrowRight, PlusIcon } from '@assets/icons';
import cardEmptyImg from '@assets/images/card-empty.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { MENU_CODE } from '@common/constants/common';
import { cardLabels } from '@common/constants/labels';
import { routePaths } from '@routes/paths';
import { moveNext } from '@utilities/index';

const EmptyCardView = ({ translate: t }) => {
  const handleNavigateAddNewCard = () => {
    moveNext(MENU_CODE.ADD_NEW_CARD, {}, routePaths.addNewCard);
  };

  const handleNavigateActiveCard = () => {
    moveNext(MENU_CODE.ACTIVE_CARD, {}, routePaths.activeCard);
  };

  return (
    <div className="empty-card-view__wrapper page__container">
      <div className="empty-card__content">
        <div className="empty-card__img">
          <img
            src={cardEmptyImg}
            alt="card empty"
          />
        </div>
        <div className="empty-card__title">{t(cardLabels.accessCardService)}</div>
        <div className="empty-card__desc">
          <p>{t(cardLabels.emptyCardGuide)}</p>
        </div>
        <div className="empty-card__btn">
          <Button
            label={t(cardLabels.getNewAccessCard)}
            variant="filled__secondary-blue"
            size="lg"
            startIcon={<PlusIcon />}
            onClick={handleNavigateAddNewCard}
          />
        </div>
        <div className="empty-card__note">
          <span>{t(cardLabels.alreadyGotCard)}</span>
          <Button
            label={t(cardLabels.activate)}
            variant="text__primary"
            size="sm"
            endIcon={<ArrowRight />}
            onClick={handleNavigateActiveCard}
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyCardView;
