import { FillChatIcon, FillPhoneIcon } from '@assets/icons';
import completeImg from '@assets/images/complete.png';
import BranchInfoIcon from '@assets/images/icon-fill-atm-24.png';
import FindATMIcon from '@assets/images/icon-fill-m-cash-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import InfoBox from '@common/components/atoms/InfoBox';
import { MENU_CODE, SupportContactPhoneNumber } from '@common/constants/common';
import { externalUrls } from '@common/constants/url';
import { routePaths } from '@routes/paths';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { callPhone, moveHome, moveNext } from '@utilities/index';

import { ActiveCardSuccessFields } from '../../constants';
import './styles.scss';

const ActiveCardSuccess = ({ cardInfo, isLogin }) => {
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
      <div className="active-card-successful__wrapper">
        <div className="active-card__header">
          <div className="active-card__img">
            <img
              src={completeImg}
              alt="Complete"
            />
          </div>
          <div className="active-card__title">
            <div className="text-primary">Access Card</div>
            <div className="complete-message">has been activated</div>
            {isLogin && <div className="note">Please register your PIN at a Shinhan Bank ATM</div>}
          </div>
        </div>
        <div className="divider__item__black" />
        <div className="active-card__info">
          {ActiveCardSuccessFields.map(({ label, value }) => (
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
            label="For more information, Please contact center."
          />
        </div>
        <div className="active-success__ctas">
          <div className="active-success__button">
            {isLogin ? (
              <IconButton
                size="lg"
                type="circle"
                label="Find ATM"
                className="active-success__icon"
                icon={<img src={FindATMIcon} />}
                onClick={handleNavigateFindATM}
              />
            ) : (
              <IconButton
                size="lg"
                type="circle"
                label="Call"
                className="call__icon"
                icon={<FillPhoneIcon />}
                onClick={onClickCallPhone}
              />
            )}
          </div>
          <div className="active-success__button">
            <IconButton
              size="lg"
              type="circle"
              label="Branch Info"
              icon={<img src={BranchInfoIcon} />}
              onClick={handleNavigateBranchInfo}
            />
          </div>
          <div className="active-success__button">
            <IconButton
              size="lg"
              type="circle"
              label="Contact us"
              className="chat__icon"
              icon={<FillChatIcon />}
              onClick={handleNavigateContactUs}
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

export default ActiveCardSuccess;
