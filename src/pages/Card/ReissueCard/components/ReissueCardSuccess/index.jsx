import { FillPhoneIcon } from '@assets/icons';
import completeImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import { callPhone, moveHome } from '@utilities/index';

import { reissueCardSuccessFields } from '../../constants';
import './styles.scss';

const ReissueCardSuccess = ({ cardInfo }) => {
  const onClickNavigateHome = () => {
    moveHome();
  };

  const onClickCallPhone = () => {
    callPhone('0239550001');
  };

  return (
    <>
      <div className="reissue-card-successful__wrapper">
        <div className="reissue-card__header">
          <div className="reissue-card__img">
            <img
              src={completeImg}
              alt="Complete"
            />
          </div>
          <div className="reissue-card__title">
            <div className="text-primary">Your card reissue request</div>
            <div className="complete-message">has been completed</div>
          </div>
        </div>
        <div className="reissue-card__info">
          <div className="form__section__title">Way to receive</div>
          <div className="divider__item__black" />
          {reissueCardSuccessFields.map(({ label, value }) => (
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
        <div className="reissue-card__info mt-4">
          <div className="form__section__title mb-0">Reissue Information</div>
          <div className="divider__item__black" />
          <div className="card-item">
            <span className="card-label">Issue Date</span>
            <span className="card-value">
              <span>{cardInfo?.issueDate}</span>
            </span>
          </div>
        </div>
        <div className="reissue-card__ctas">
          <div className="reissue-card__button">
            <IconButton
              size="lg"
              type="circle"
              label="Call"
              className="call__icon"
              icon={<FillPhoneIcon />}
              onClick={onClickCallPhone}
            />
          </div>
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

export default ReissueCardSuccess;
