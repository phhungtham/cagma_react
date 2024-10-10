import cardAccidentImg from '@assets/images/accident-card.png';
import cardActiveImg from '@assets/images/debit-card.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Label from '@common/components/atoms/Label';
import { MENU_CODE } from '@common/constants/common';
import { routePaths } from '@routes/paths';
import { moveNext } from '@utilities/index';

import { CardAccidentType, cardSummaryFields } from '../constants';

const ActiveCardView = ({ card }) => {
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
          <div className="page__title">Access Card Service</div>
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
          {isReportedLostCard && (
            <div className="report-lost-note pb-2">This card has been reported as lost or stolen</div>
          )}
          <div className="card__number">{card?.cardNumber}</div>
          <div className="card__desc">{card?.cardAccountNumber}</div>
          <div className="card__ctas">
            <Button
              label="Reissue"
              size="xl"
              variant="filled__secondary-gray"
              onClick={handleNavigateReissueCard}
            />
            <Button
              label={isReportedLostCard ? 'Release Lost' : 'Report Loss'}
              size="xl"
              variant="filled__secondary-blue"
              onClick={isReportedLostCard ? handleNavigateReleaseLostCard : handleNavigateReportLostCard}
            />
          </div>
        </div>
      </div>
      <div className="divider__group" />
      <div className="card__summary page__container">
        <div className="summary__title">Card Summary</div>
        <div className="summary__wrapper">
          {cardSummaryFields.map(({ label, value }) => (
            <div className="summary__item">
              <span className="item__label">{label}</span>
              <span className="item__value">{card[value]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveCardView;
