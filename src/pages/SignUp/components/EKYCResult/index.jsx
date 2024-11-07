import errorImg from '@assets/images/failure.png';
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

const EKYCResult = ({ isSuccess, onNavigateWelcome }) => {
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
          <div className={isSuccess ? 'review__img' : 'success__img'}>
            <img
              src={isSuccess ? reviewingImg : errorImg}
              alt="Complete"
            />
          </div>
          <div className="success__title">
            <span>{isSuccess ? 'Your details are being reviewed' : 'We’re sorry'}</span>
          </div>
          <div className="note">
            {isSuccess
              ? 'Please allow 1 business day for us to review your information'
              : 'You cannot proceed with online registration'}
          </div>
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
          variant={isSuccess ? 'filled__primary' : 'filled__secondary-blue'}
          label="Home"
          className="btn__cta"
          onClick={moveHome}
        />
        {!isSuccess && (
          <Button
            variant="filled__primary"
            label="Start Over"
            className="btn__cta"
            onClick={onNavigateWelcome}
          />
        )}
      </div>
    </>
  );
};

export default EKYCResult;
