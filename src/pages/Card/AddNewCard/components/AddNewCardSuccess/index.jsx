import completeImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { cardLabels, ctaLabels } from '@common/constants/labels';
import useMove from '@hooks/useMove';

import { addNewCardSuccessFields } from '../../constants';
import './styles.scss';

const AddNewCardSuccess = ({ cardInfo, translate: t }) => {
  const { moveHomeNative } = useMove();

  const { accountNo } = cardInfo || {};

  const onClickNavigateHome = () => {
    moveHomeNative();
  };

  return (
    <>
      <div className="add-new-card-successful__wrapper">
        <div className="add-new-card__header">
          <div className="add-new-card__img">
            <img
              src={completeImg}
              alt="Complete"
            />
          </div>
          <div className="add-new-card__title">
            <div className="text-primary">{t(cardLabels.yourCardRequest)}</div>
            <div className="complete-message">{t(cardLabels.hasBeenCompleted)}</div>
            <div className="note">{t(cardLabels.cardDelivered)}</div>
          </div>
        </div>
        <div className="add-new-card__info add-new-card__linked-to">
          <div className="form__section__title mb-0">{t(cardLabels.linkedTo)}</div>
          <div className="divider__item__black" />
          <div className="card-item">
            <span className="card-label">{t(cardLabels.accountNo)}</span>
            <span className="card-value">
              <span>{accountNo}</span>
            </span>
          </div>
        </div>
        <div className="add-new-card__info mt-4">
          <div className="form__section__title mb-0">{t(cardLabels.mailingAddress2)}</div>
          <div className="divider__item__black" />
          {addNewCardSuccessFields.map(({ label, value }) => (
            <div
              className="card-item"
              key={value}
            >
              <span className="card-label">{t(label)}</span>
              <span className="card-value">
                <span>{cardInfo?.[value]}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          variant="filled__primary"
          label={t(ctaLabels.home)}
          className="btn__cta"
          onClick={onClickNavigateHome}
        />
      </div>
    </>
  );
};

export default AddNewCardSuccess;
