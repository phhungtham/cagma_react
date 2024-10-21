import ExclamationMarkIcon from '@assets/images/exclamation-mark.png';
import BranchInfoIcon from '@assets/images/icon-fill-atm-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import BottomSheet from '@common/components/templates/BottomSheet';
import { MENU_CODE } from '@common/constants/common';
import { externalUrls } from '@common/constants/url';
import { routePaths } from '@routes/paths';
import openInternalWebview from '@utilities/gmCommon/openInternalWebview';
import { moveNext } from '@utilities/index';

const BorrowingInstructionBottom = ({ onClose }) => {
  const handleNavigateMoreInformation = () => {
    openInternalWebview({
      url: externalUrls.loan,
      title: '',
    });
  };

  const handleNavigateBranchInfo = () => {
    openInternalWebview({
      url: externalUrls.branchInfo,
      title: '',
    });
  };

  const handleBookAppointment = () => {
    moveNext(MENU_CODE.APPOINTMENT_MAIN, {}, routePaths.appointment);
  };

  return (
    <BottomSheet
      open
      onClose={onClose}
      clazz="product-borrowing-instruction__bottom"
      type="fit-content"
    >
      <div className="borrowing-instruction-bottom__content">
        <div className="borrowing-title">Want to Find out more?</div>
        <div className="borrowing-description">
          Visit our website for more details or talk to one of our advisors. We are more than happy to discuss and plan
          your financials together.
        </div>
        <div className="divider__item__solid w-full mt-5" />
        <div className="borrowing-icon-buttons">
          <IconButton
            size="lg"
            type="circle"
            label="More Information"
            className="call__icon"
            icon={<img src={ExclamationMarkIcon} />}
            onClick={handleNavigateMoreInformation}
          />
          <IconButton
            size="lg"
            type="circle"
            label="Branch Info"
            icon={<img src={BranchInfoIcon} />}
            onClick={handleNavigateBranchInfo}
          />
        </div>
        <div className="pt-8 w-full">
          <Button
            variant="filled__primary"
            label="Book an Appointment"
            className="w-full"
            onClick={handleBookAppointment}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default BorrowingInstructionBottom;
