import { FillPhoneIcon } from '@assets/icons';
import completeImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import { reissueCardLabels as labels } from '@common/constants/labels';
import useMove from '@hooks/useMove';
import { callPhone } from '@utilities/index';

import { reissueCardSuccessFields } from '../../constants';
import './styles.scss';

const ReissueCardSuccess = ({ cardInfo, translate: t }) => {
  const { moveHomeNative } = useMove();

  const onClickNavigateHome = () => {
    moveHomeNative();
  };

  const onClickCallPhone = () => {
    callPhone('0239550001');
  };

  return (
    <>
      <div className="reissue-card-successful__wrapper page-gradient">
        <div className="reissue-card__header">
          <div className="reissue-card__img">
            <img
              src={completeImg}
              alt="Complete"
            />
          </div>
          <div className="reissue-card__title">
            <div className="text-primary">{t(labels.yourCardReissue)}</div>
            <div className="complete-message">{t(labels.hasBeenCompleted)}</div>
          </div>
        </div>
        <div className="reissue-card__info flex-gap-y-16">
          <div className="form__section__title">{t(labels.mailingAddress2)}</div>
          <div className="divider__item__black" />
          {reissueCardSuccessFields.map(({ label, value }) => (
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
        <div className="reissue-card__ctas">
          <div className="reissue-card__button">
            <IconButton
              size="lg"
              type="circle"
              label={t(labels.callBtn)}
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
          label={t(labels.homeBtn)}
          className="btn__cta"
          onClick={onClickNavigateHome}
        />
      </div>
    </>
  );
};

export default ReissueCardSuccess;
