import successImg from '@assets/images/complete.png';
import errorImg from '@assets/images/failure.png';
import SearchBranchIcon from '@assets/images/icon-fill-atm-24.png';
import ReserveIcon from '@assets/images/icon-fill-calendar-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import InfoBox from '@common/components/atoms/InfoBox';
import { externalUrls } from '@common/constants/url';
import { VerifyMembershipResultStatus } from '@pages/SignUp/constants';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { moveHome } from '@utilities/index';

import { ButtonResultLabel, VerifyMembershipResultMessages } from './constants';

const VerifyMembershipResult = ({ type, onNavigateVerifyMembership }) => {
  const handleNavigateHome = () => {
    moveHome();
  };

  const handleNavigateBranchInfo = () => {
    openURLInBrowser(externalUrls.branchInfo);
  };

  const handleConfirm = () => {
    if (type === VerifyMembershipResultStatus.INDIVIDUAL_SUCCESS) {
      //TODO: Navigate login
    }
    if (type === VerifyMembershipResultStatus.CORPORATE_SUCCESS) {
      openURLInBrowser(externalUrls.bankHome);
    }
    if (type === VerifyMembershipResultStatus.FAILED) {
      onNavigateVerifyMembership();
    }
  };

  return (
    <>
      <div className="page-success">
        <div className="success__header">
          <div className="success__img">
            <img
              src={type === VerifyMembershipResultStatus.FAILED ? errorImg : successImg}
              alt="Complete"
            />
          </div>
          <div className="success__title">
            <div dangerouslySetInnerHTML={{ __html: VerifyMembershipResultMessages[type]?.title }} />
          </div>
          <div className="note">{VerifyMembershipResultMessages[type]?.description}</div>
          <div className="mt-4">
            <InfoBox
              variant="informative"
              label="For more information, please visit a branch or contact a service center"
            />
          </div>
        </div>
        <div className="success-icon-buttons gap-14">
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
            onClick={handleNavigateBranchInfo}
          />
        </div>
      </div>

      <div className="footer__fixed">
        <Button
          variant="filled__secondary-blue"
          label="Home"
          className="btn__cta"
          onClick={handleNavigateHome}
        />
        <Button
          variant="filled__primary"
          label={ButtonResultLabel[type]}
          className="btn__cta"
          onClick={handleConfirm}
        />
      </div>
    </>
  );
};

export default VerifyMembershipResult;
