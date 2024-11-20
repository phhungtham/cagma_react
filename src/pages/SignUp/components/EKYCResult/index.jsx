import { useContext } from 'react';

import errorImg from '@assets/images/failure.png';
import SearchBranchIcon from '@assets/images/icon-fill-atm-24.png';
import ReserveIcon from '@assets/images/icon-fill-calendar-24.png';
import reviewingImg from '@assets/images/sign-up-review-details.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import InfoBox from '@common/components/atoms/InfoBox';
import { MENU_CODE } from '@common/constants/common';
import { signUpEkycResultLabels as labels, signUpVerifyUserLabels } from '@common/constants/labels';
import { externalUrls } from '@common/constants/url';
import useMove from '@hooks/useMove';
import { SignUpContext } from '@pages/SignUp';
import { routePaths } from '@routes/paths';
import openInternalWebview from '@utilities/gmCommon/openInternalWebview';
import { moveNext } from '@utilities/index';

import './styles.scss';

const EKYCResult = ({ isSuccess, onNavigateWelcome }) => {
  const { translate: t } = useContext(SignUpContext);
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
            <span>{isSuccess ? t(labels.yourDetailReview) : t(signUpVerifyUserLabels.weSorry)}</span>
          </div>
          <div className="note">
            {isSuccess ? t(labels.pleaseAllowFewDays) : t(signUpVerifyUserLabels.youCannotProceed)}
          </div>
          <div className="mt-6">
            <InfoBox
              variant="informative"
              label={t(labels.forMoreInfo)}
            />
          </div>
        </div>
        <div className="success-icon-buttons gap-14">
          <IconButton
            size="lg"
            type="circle"
            label={t(signUpVerifyUserLabels.searchBranch)}
            icon={<img src={SearchBranchIcon} />}
            onClick={handleNavigateBranchInfo}
          />
          <IconButton
            size="lg"
            type="circle"
            label={t(signUpVerifyUserLabels.reservation)}
            icon={<img src={ReserveIcon} />}
            onClick={handleNavigateAppointmentMain}
          />
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          variant={isSuccess ? 'filled__primary' : 'filled__secondary-blue'}
          label={t(labels.home)}
          className="btn__cta"
          onClick={moveHomeNative}
        />
        {!isSuccess && (
          <Button
            variant="filled__primary"
            label={t(signUpVerifyUserLabels.startOver)}
            className="btn__cta"
            onClick={onNavigateWelcome}
          />
        )}
      </div>
    </>
  );
};

export default EKYCResult;
