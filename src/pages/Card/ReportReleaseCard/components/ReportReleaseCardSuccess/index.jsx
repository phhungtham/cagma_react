import completeImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { MENU_CODE } from '@common/constants/common';
import { releaseCardLabels as labels } from '@common/constants/labels';
import { routePaths } from '@routes/paths';
import { moveHome, moveNext } from '@utilities/index';

import { reportReleaseCardSuccessFields } from '../../constants';
import './styles.scss';

const ReportReleaseCardSuccess = ({ cardInfo, translate: t }) => {
  const handleNavigateCardMain = () => {
    moveNext(MENU_CODE.CARD_MAIN, {}, routePaths.cards);
  };

  const handleNavigateHome = () => {
    moveHome();
  };

  return (
    <>
      <div className="report-release-card-successful__wrapper">
        <div className="report-release-card__header">
          <div className="report-release-card__img">
            <img
              src={completeImg}
              alt="Complete"
            />
          </div>
          <div className="report-release-card__title">
            <div className="text-primary">{t(labels.releaseTheAccident)}</div>
            <div className="complete-message">{t(labels.hasBeenComplete)}</div>
          </div>
        </div>
        <div className="divider__item__black" />
        <div className="report-release-card__info">
          {reportReleaseCardSuccessFields.map(({ label, value }) => (
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
          variant="filled__secondary-blue"
          label={t(labels.viewCards)}
          className="btn__cta"
          onClick={handleNavigateCardMain}
        />
        <Button
          variant="filled__primary"
          label={t(labels.home)}
          className="btn__cta"
          onClick={handleNavigateHome}
        />
      </div>
    </>
  );
};

export default ReportReleaseCardSuccess;
