import BranchInfoIcon from '@assets/images/icon-fill-atm-24.png';
import ExclamationMarkIcon from '@assets/images/icon_fill_informative_24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import BottomSheet from '@common/components/templates/BottomSheet';
import { MENU_CODE } from '@common/constants/common';
import { productLabels as labels } from '@common/constants/labels';
import { externalUrls } from '@common/constants/url';
import { routePaths } from '@routes/paths';
import openInternalWebview from '@utilities/gmCommon/openInternalWebview';
import { moveNext } from '@utilities/index';

const BorrowingInstructionBottom = ({ onClose, translate: t }) => {
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
        <div className="borrowing-title">{t(labels.wantToFindOutMore)}</div>
        <div className="borrowing-description">{t(labels.visitOurWebsiteFor)}</div>
        <div className="divider__item__solid w-full mt-5" />
        <div className="borrowing-icon-buttons">
          <IconButton
            size="lg"
            type="circle"
            label={t(labels.moreInformation)}
            className="call__icon"
            icon={<img src={ExclamationMarkIcon} />}
            onClick={handleNavigateMoreInformation}
          />
          <IconButton
            size="lg"
            type="circle"
            label={t(labels.branchInfo)}
            icon={<img src={BranchInfoIcon} />}
            onClick={handleNavigateBranchInfo}
          />
        </div>
        <div className="pt-8 w-full">
          <Button
            variant="filled__primary"
            label={t(labels.bookAnAppointment)}
            className="w-full"
            onClick={handleBookAppointment}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default BorrowingInstructionBottom;
