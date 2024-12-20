import cardAccidentImg from '@assets/images/accident-card.png';
import cardActiveImg from '@assets/images/debit-card.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Label from '@common/components/atoms/Label';
import { MENU_CODE } from '@common/constants/common';
import { cardLabels } from '@common/constants/labels';
import { routePaths } from '@routes/paths';
import { moveNext } from '@utilities/index';

import { CardAccidentType, cardSummaryFields } from '../constants';

const ActiveCardView = ({ card, translate: t }) => {
  const isReportedLostCard = card?.type === CardAccidentType.REPORTED;

  const handleNavigateReissueCard = () => {
    moveNext(MENU_CODE.REISSUE_CARD, {}, routePaths.reissueCard);
  };

  const handleNavigateReportLostCard = () => {
    moveNext(MENU_CODE.REPORT_LOST_CARD, {}, routePaths.reportLostCard);
  };

  const handleNavigateReleaseLostCard = () => {
    moveNext(MENU_CODE.RELEASE_CARD, {}, routePaths.releaseCard);
  };

  return (
    <div className="active-card-view__wrapper">
      <div className="active-card__content page__container">
        <div className="active-card__header">
          <div className="page__title">{t(cardLabels.accessCardService)}</div>
        </div>
        <div className="active-card__main">
          <div className="active-card__img">
            <img
              src={isReportedLostCard ? cardAccidentImg : cardActiveImg}
              alt="Access card service"
            />
            {isReportedLostCard && (
              <Label
                variant="rose"
                label="Accident"
                type="filled"
                clazz="accident-label"
              />
            )}
          </div>
          {isReportedLostCard && <div className="report-lost-note pb-2">{t(cardLabels.thisCardHasBeen)}</div>}
          <div className="card__number">{card?.cardNumber}</div>
          <div className="card__desc">{card?.cardAccountNumber}</div>
          <div className="card__ctas flex-gap-x-8">
            <Button
              label={t(cardLabels.reissue)}
              size="xl"
              variant="filled__secondary-gray"
              onClick={handleNavigateReissueCard}
            />
            <Button
              label={isReportedLostCard ? t(cardLabels.releaseLost) : t(cardLabels.reportLost)}
              size="xl"
              variant="filled__secondary-blue"
              onClick={isReportedLostCard ? handleNavigateReleaseLostCard : handleNavigateReportLostCard}
            />
          </div>
        </div>
      </div>
      <div className="divider__group" />
      <div className="card__summary page__container">
        <div className="summary__title">{t(cardLabels.cardSummary)}</div>
        <div className="summary__wrapper">
          {cardSummaryFields.map(({ label, value }) => (
            <div className="summary__item">
              <span className="item__label">{t(label)}</span>
              <span className="item__value">{card?.[value]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveCardView;
