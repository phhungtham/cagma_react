import completeImg from '@assets/images/complete.png';
import BranchInfoIcon from '@assets/images/icon-fill-atm-24.png';
import ReserveIcon from '@assets/images/icon-fill-calendar-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import InfoBox from '@common/components/atoms/InfoBox';
import { MENU_CODE } from '@common/constants/common';
import { reportLostCardLabels as labels } from '@common/constants/labels';
import { externalUrls } from '@common/constants/url';
import { routePaths } from '@routes/paths';
import openInternalWebview from '@utilities/gmCommon/openInternalWebview';
import { moveHome, moveNext } from '@utilities/index';

import { reportLostCardSuccessFields } from '../../constants';
import './styles.scss';

const ReportLostCardSuccess = ({ cardInfo, isLogin, translate: t }) => {
  const handleNavigateCardMain = () => {
    moveNext(MENU_CODE.CARD_MAIN, {}, routePaths.cards);
  };

  const handleNavigateHome = () => {
    moveHome();
  };

  const handleNavigateBranchInfo = () => {
    openInternalWebview({
      url: externalUrls.branchInfo,
      title: 'Search Branch',
    });
  };

  const handleNavigateAppointment = () => {
    moveNext(MENU_CODE.APPOINTMENT_MAIN, {}, routePaths.appointment);
  };

  return (
    <>
      <div className="report-lost-card-successful__wrapper">
        <div className="report-lost-card__header">
          <div className="report-lost-card__img">
            <img
              src={completeImg}
              alt="Complete"
            />
          </div>
          <div className="report-lost-card__title">
            <div className="text-primary">Register the accident report</div>
            <div className="complete-message">{isLogin ? 'has been completed' : 'is now complete'}</div>
          </div>
        </div>
        {isLogin && (
          <>
            <div className="divider__item__black" />
            <div className="report-lost-card__info">
              {reportLostCardSuccessFields.map(({ label, value }) => (
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
            <div className="mt-6">
              <InfoBox
                variant="informative"
                label={t(labels.afterRegisterAccident)}
              />
            </div>
            <div className="active-success__ctas">
              <div className="active-success__button">
                <IconButton
                  size="lg"
                  type="circle"
                  label={t(labels.searchBranch)}
                  icon={<img src={BranchInfoIcon} />}
                  onClick={handleNavigateBranchInfo}
                />
              </div>
              <div className="active-success__button">
                <IconButton
                  size="lg"
                  type="circle"
                  label={t(labels.reserveConsultation)}
                  className="call__icon"
                  icon={<img src={ReserveIcon} />}
                  onClick={handleNavigateAppointment}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="footer__fixed">
        {isLogin && (
          <Button
            variant="filled__secondary-blue"
            label={t(labels.viewCards)}
            className="btn__cta"
            onClick={handleNavigateCardMain}
          />
        )}

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

export default ReportLostCardSuccess;
