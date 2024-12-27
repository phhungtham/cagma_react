import { FillChatIcon } from '@assets/icons';
import completeImg from '@assets/images/complete.png';
import BranchInfoIcon from '@assets/images/icon-fill-atm-24.png';
import FindATMIcon from '@assets/images/icon-fill-m-cash-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import InfoBox from '@common/components/atoms/InfoBox';
import { MENU_CODE } from '@common/constants/common';
import { activeCardLabels as labels } from '@common/constants/labels';
import { externalUrls } from '@common/constants/url';
import useMove from '@hooks/useMove';
import { routePaths } from '@routes/paths';
import openInternalWebview from '@utilities/gmCommon/openInternalWebview';
import { moveNext } from '@utilities/index';

import { activeCardSuccessFields } from '../../constants';
import './styles.scss';

const ActiveCardSuccess = ({ cardInfo, isLogin, translate: t }) => {
  const { moveHomeNative } = useMove();

  const handleNavigateCardMain = () => {
    moveNext(MENU_CODE.CARD_MAIN, {}, routePaths.cards); //TODO: Handle clearHistory
  };

  const handleNavigateHome = () => {
    moveHomeNative();
  };

  const handleNavigateFindATM = () => {
    openInternalWebview({
      url: externalUrls.findATM,
      title: t(labels.findATM),
    });
  };

  const handleNavigateBranchInfo = () => {
    openInternalWebview({
      url: externalUrls.branchInfo,
      title: t(labels.branchInfo),
    });
  };

  const handleNavigateContactUs = () => {
    openInternalWebview({
      url: externalUrls.contactUs,
      title: t(labels.contactUs),
    });
  };

  return (
    <>
      <div className="active-card-successful__wrapper page-gradient">
        <div className="active-card__header">
          <div className="active-card__img">
            <img
              src={completeImg}
              alt="Complete"
            />
          </div>
          <div className="active-card__title">
            <div className="text-primary">{t(labels.accessCard)}</div>
            <div className="complete-message">{t(labels.hasBeenActivated)}</div>
            {isLogin && <div className="note">{t(labels.pleaseRegisterYouPin)}</div>}
          </div>
        </div>
        <div className="active-card__info">
          {activeCardSuccessFields.map(({ label, value }) => (
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
            label={t(labels.forMoreInfo)}
          />
        </div>
        <div className="active-success__ctas">
          <div className="active-success__button">
            <IconButton
              size="lg"
              type="circle"
              label={t(labels.findATM)}
              className="active-success__icon"
              icon={<img src={FindATMIcon} />}
              onClick={handleNavigateFindATM}
            />
          </div>
          <div className="active-success__button">
            <IconButton
              size="lg"
              type="circle"
              label={t(labels.branchInfo)}
              icon={<img src={BranchInfoIcon} />}
              onClick={handleNavigateBranchInfo}
            />
          </div>
          <div className="active-success__button">
            <IconButton
              size="lg"
              type="circle"
              label={t(labels.contactUs)}
              className="chat__icon"
              icon={<FillChatIcon />}
              onClick={handleNavigateContactUs}
            />
          </div>
        </div>
      </div>
      <div className="footer__fixed flex-gap-x-8">
        <Button
          variant="filled__secondary-blue"
          label={t(labels.viewCardBtn)}
          className="btn__cta"
          onClick={handleNavigateCardMain}
        />
        <Button
          variant="filled__primary"
          label={t(labels.homeBtn)}
          className="btn__cta"
          onClick={handleNavigateHome}
        />
      </div>
    </>
  );
};

export default ActiveCardSuccess;
