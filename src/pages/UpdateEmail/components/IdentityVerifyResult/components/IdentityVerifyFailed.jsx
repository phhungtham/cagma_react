import { useContext } from 'react';

import errorImg from '@assets/images/failure.png';
import SearchBranchIcon from '@assets/images/icon-fill-atm-24.png';
import ReserveIcon from '@assets/images/icon-fill-calendar-24.png';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import InfoBox from '@common/components/atoms/InfoBox';
import { MENU_CODE } from '@common/constants/common';
import { updateEmailLabels as labels } from '@common/constants/labels';
import { externalUrls } from '@common/constants/url';
import { UpdateEmailContext } from '@pages/UpdateEmail';
import { routePaths } from '@routes/paths';
import openInternalWebview from '@utilities/gmCommon/openInternalWebview';
import { moveNext } from '@utilities/index';

const IdentityVerifyFailed = () => {
  const { translate: t } = useContext(UpdateEmailContext);

  const handleNavigateBranchInfo = () => {
    openInternalWebview({
      url: externalUrls.branchInfo,
      title: '',
    });
  };

  const handleNavigateAppointmentMain = () => {
    moveNext(MENU_CODE.APPOINTMENT_MAIN, {}, routePaths.appointment); //TODO: Handle clear history
  };

  return (
    <>
      <div className="success__header">
        <div className="success__img">
          <img
            src={errorImg}
            alt="Complete"
          />
        </div>
        <div className="success__title">
          <span>{t(labels.weSorry)}</span>
        </div>
        <div className="note">{t(labels.youCannotProceed)}</div>
        <div className="mt-6">
          <InfoBox
            variant="informative"
            label={t(labels.forMoreInformation)}
          />
        </div>
      </div>
      <div className="success-icon-buttons">
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
    </>
  );
};

export default IdentityVerifyFailed;
