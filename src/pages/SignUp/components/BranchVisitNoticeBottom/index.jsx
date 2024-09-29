import SearchBranchIcon from '@assets/images/icon-fill-atm-24.png';
import ReserveIcon from '@assets/images/icon-fill-calendar-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import BottomSheet from '@common/components/templates/BottomSheet';
import { MENU_CODE } from '@common/constants/common';
import { externalUrls } from '@common/constants/url';
import { routePaths } from '@routes/paths';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { moveHome, moveNext } from '@utilities/index';

import './styles.scss';

const BranchVisitNoticeBottom = ({ onClose, open }) => {
  const handleNavigateBranchInfo = () => {
    openURLInBrowser(externalUrls.branchInfo);
  };

  const handleNavigateAppointmentMain = () => {
    moveNext(MENU_CODE.APPOINTMENT_MAIN, {}, routePaths.appointment);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Branch Visit Notice"
      type="fit-content"
    >
      <div className="branch-visit-notice__content">
        <div className="instruction">
          If you are not available to enter your ID information, please contact your branch.
        </div>
        <div className="divider__item__solid" />
        <div className="flex-center gap-14 pt-8 pb-4">
          <IconButton
            size="lg"
            type="circle"
            label="Search Branch"
            icon={<img src={SearchBranchIcon} />}
            onClick={handleNavigateBranchInfo}
          />
          <IconButton
            size="lg"
            type="circle"
            label="Reserve Consultation"
            icon={<img src={ReserveIcon} />}
            onClick={handleNavigateAppointmentMain}
          />
        </div>
        <div className="btn__ctas">
          <Button
            variant="filled__primary"
            label="Home"
            className="flex-7"
            onClick={moveHome}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default BranchVisitNoticeBottom;
