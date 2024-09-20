import cardActiveImg from '@assets/images/debit-card.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { cardSummaryFields, cardSummaryTest } from '@pages/Card/constants';

const ActiveCardView = () => {
  return (
    <div className="active-card-view__wrapper">
      <div className="active-card__content page__container">
        <div className="active-card__header">
          <div className="page__title">Access Card Service</div>
        </div>
        <div className="active-card__main">
          <div className="active-card__img">
            <img
              src={cardActiveImg}
              alt="Access card service"
            />
          </div>
          <div className="card__number">5021-****-****-0058</div>
          <div className="card__desc">000 000 000000</div>
          <div className="card__ctas">
            <Button
              label="Reissue"
              size="xl"
              variant="filled__secondary-gray"
            />
            <Button
              label="Report Loss"
              size="xl"
              variant="filled__secondary-blue"
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
              <span className="item__value">{cardSummaryTest[value]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveCardView;
