import SearchBranchIcon from '@assets/images/icon-fill-atm-24.png';
import ReserveIcon from '@assets/images/icon-fill-calendar-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import BottomSheet from '@common/components/templates/BottomSheet';
import { MENU_CODE } from '@common/constants/common';
import { openAccountLabels as labels } from '@common/constants/labels';
import { externalUrls } from '@common/constants/url';
import useMove from '@hooks/useMove';
import { routePaths } from '@routes/paths';
import openInternalWebview from '@utilities/gmCommon/openInternalWebview';
import { moveNext } from '@utilities/index';

import './styles.scss';

const OPBranchVisitNoticeBottom = ({ onClose, open, translate: t }) => {
  const { moveHomeNative } = useMove();

  const handleNavigateBranchInfo = () => {
    openInternalWebview({
      url: externalUrls.branchInfo,
      title: '',
    });
  };

  const handleNavigateAppointmentMain = () => {
    moveNext(MENU_CODE.APPOINTMENT_MAIN, {}, routePaths.appointment);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t(labels.branchVisitNotice)}
      type="fit-content"
    >
      <div className="op-branch-visit-notice__content">
        <div className="instruction">{t(labels.sinNumberRequired)}</div>
        <div className="divider__item__solid" />
        <div className="flex-center gap-14 pt-8 pb-4">
          <IconButton
            size="lg"
            type="circle"
            label={t(labels.searchBranch)}
            icon={<img src={SearchBranchIcon} />}
            onClick={handleNavigateBranchInfo}
          />
          <IconButton
            size="lg"
            type="circle"
            label={t(labels.bookAnAppointment)}
            icon={<img src={ReserveIcon} />}
            onClick={handleNavigateAppointmentMain}
          />
        </div>
        <div className="btn__ctas">
          <Button
            variant="filled__primary"
            label={t(labels.home)}
            className="flex-7"
            onClick={moveHomeNative}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default OPBranchVisitNoticeBottom;
