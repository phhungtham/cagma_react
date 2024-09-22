import completeImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { moveHome } from '@utilities/index';

import { addNewCardSuccessFields } from '../../constants';
import './styles.scss';

const AddNewCardSuccess = ({ cardInfo }) => {
  const { accountNo } = cardInfo || {};

  const onClickNavigateHome = () => {
    moveHome();
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
            <div className="text-primary">Your card request</div>
            <div className="complete-message">has been completed</div>
            <div className="note">Your card will be delivered to your address.</div>
          </div>
        </div>
        <div className="add-new-card__info add-new-card__linked-to">
          <div className="form__section__title mb-0">Linked to</div>
          <div className="divider__item__black" />
          <div className="card-item">
            <span className="card-label">Account No.</span>
            <span className="card-value">
              <span>{accountNo}</span>
            </span>
          </div>
        </div>
        <div className="add-new-card__info mt-4">
          <div className="form__section__title">Way to receive</div>
          <div className="divider__item__black" />
          {addNewCardSuccessFields.map(({ label, value }) => (
            <div
              className="card-item"
              key={value}
            >
              <span className="card-label">{label}</span>
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
          label="Home"
          className="btn__cta"
          onClick={onClickNavigateHome}
        />
      </div>
    </>
  );
};

export default AddNewCardSuccess;
