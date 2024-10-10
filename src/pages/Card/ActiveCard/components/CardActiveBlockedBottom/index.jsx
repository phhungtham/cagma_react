import { FillChatIcon, FillPhoneIcon } from '@assets/icons';
import BranchInfoIcon from '@assets/images/icon-fill-atm-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import BottomSheet from '@common/components/templates/BottomSheet';
import { externalUrls } from '@common/constants/url';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { callPhone, moveHome } from '@utilities/index';

const CardActiveBlockedBottom = ({ onClose }) => {
  const handleNavigateBranchInfo = () => {
    openURLInBrowser(externalUrls.branchInfo);
  };

  const onClickCallPhone = () => {
    callPhone('14162503500');
  };

  const handleNavigateContactUs = () => {
    openURLInBrowser(externalUrls.contactUs);
  };

  return (
    <BottomSheet
      open
      onClose={onClose}
      type="fit-content"
    >
      <div className="active-blocked-bottom__content">
        <div className="blocked-title">Online Activation is blocked</div>
        <div className="blocked-description">
          You have entered the card information incorrectly 5 times, and online activation is now blocked. Please
          contact your branch for assistance.
        </div>
        <div className="divider__item__solid w-full mt-5" />
        <div className="blocked-icon-buttons">
          <div className="active-blocked__button">
            <IconButton
              size="lg"
              type="circle"
              label="Call"
              className="call__icon"
              icon={<FillPhoneIcon />}
              onClick={onClickCallPhone}
            />
          </div>
          <div className="active-blocked__button">
            <IconButton
              size="lg"
              type="circle"
              label="Branch Info"
              icon={<img src={BranchInfoIcon} />}
              onClick={handleNavigateBranchInfo}
            />
          </div>
          <div className="active-blocked__button">
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
        <div className="pt-8 w-full">
          <Button
            variant="filled__primary"
            label="Home"
            className="w-full"
            onClick={moveHome}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default CardActiveBlockedBottom;
