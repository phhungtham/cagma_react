import SearchBranchIcon from '@assets/images/icon-fill-atm-24.png';
import ReserveIcon from '@assets/images/icon-fill-calendar-24.png';
import reviewingImg from '@assets/images/sign-up-review-details.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import InfoBox from '@common/components/atoms/InfoBox';
import { MENU_CODE } from '@common/constants/common';
import { externalUrls } from '@common/constants/url';
import { routePaths } from '@routes/paths';
import openInternalWebview from '@utilities/gmCommon/openInternalWebview';
import { moveHome, moveNext } from '@utilities/index';

import './styles.scss';

const EKYCResult = () => {
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
    <>
      <div className="page-success sign-up-personal-detail-review">
        <div className="success__header">
          <div className="review__img">
            <img
              src={reviewingImg}
              alt="Complete"
            />
          </div>
          <div className="success__title">
            <span>Your details are being reviewed</span>
          </div>
          <div className="note">Please allow 1 business day for us to review your information</div>
          <div className="mt-6">
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
            label="Book an Appointment"
            icon={<img src={ReserveIcon} />}
            onClick={handleNavigateAppointmentMain}
          />
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          variant="filled__primary"
          label="Home"
          className="btn__cta"
          onClick={moveHome}
        />
      </div>
    </>
  );
};

export default EKYCResult;
