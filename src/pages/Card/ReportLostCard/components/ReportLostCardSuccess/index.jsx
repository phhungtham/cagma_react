import { FillPhoneIcon } from '@assets/icons';
import completeImg from '@assets/images/complete.png';
import BranchInfoIcon from '@assets/images/icon-fill-atm-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import InfoBox from '@common/components/atoms/InfoBox';
import { MENU_CODE, SupportContactPhoneNumber } from '@common/constants/common';
import { externalUrls } from '@common/constants/url';
import { routePaths } from '@routes/paths';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { callPhone, moveHome, moveNext } from '@utilities/index';

import { reportLostCardSuccessFields } from '../../constants';
import './styles.scss';

const ReportLostCardSuccess = ({ cardInfo, isLogin }) => {
  const handleNavigateCardMain = () => {
    moveNext(MENU_CODE.CARD_MAIN, {}, routePaths.cards);
  };

  const handleNavigateHome = () => {
    moveHome();
  };

  const handleNavigateFindATM = () => {
    openURLInBrowser(externalUrls.findATM);
  };

  const handleNavigateBranchInfo = () => {
    openURLInBrowser(externalUrls.branchInfo);
  };

  const handleNavigateContactUs = () => {
    openURLInBrowser(externalUrls.contactUs);
  };

  const onClickCallPhone = () => {
    callPhone(SupportContactPhoneNumber);
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
            <div className="complete-message">has been completed</div>
          </div>
        </div>
        <div className="divider__item__black" />
        <div className="report-lost-card__info">
          {reportLostCardSuccessFields.map(({ label, value }) => (
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
        <div className="mt-6">
          <InfoBox
            variant="informative"
            label="After the accident report, cannot use the card. To release the card, you may need to visit the branch nearby or use the manage accident report page."
          />
        </div>
        <div className="active-success__ctas">
          <div className="active-success__button">
            <IconButton
              size="lg"
              type="circle"
              label="Search Branch"
              icon={<img src={BranchInfoIcon} />}
              onClick={handleNavigateBranchInfo}
            />
          </div>
          <div className="active-success__button">
            <IconButton
              size="lg"
              type="circle"
              label="Reserve Consultation"
              className="call__icon"
              icon={<FillPhoneIcon />}
              onClick={onClickCallPhone}
            />
          </div>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          variant="filled__secondary-blue"
          label="View Cards"
          className="btn__cta"
          onClick={handleNavigateCardMain}
        />
        <Button
          variant="filled__primary"
          label="Home"
          className="btn__cta"
          onClick={handleNavigateHome}
        />
      </div>
    </>
  );
};

export default ReportLostCardSuccess;
