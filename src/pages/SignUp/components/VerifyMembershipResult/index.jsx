import { useContext } from 'react';

import successImg from '@assets/images/complete.png';
import errorImg from '@assets/images/failure.png';
import SearchBranchIcon from '@assets/images/icon-fill-atm-24.png';
import ReserveIcon from '@assets/images/icon-fill-calendar-24.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import InfoBox from '@common/components/atoms/InfoBox';
import { MENU_CODE } from '@common/constants/common';
import { signUpVerifyUserLabels as labels } from '@common/constants/labels';
import { externalUrls } from '@common/constants/url';
import useMove from '@hooks/useMove';
import { SignUpContext } from '@pages/SignUp';
import { VerifyMembershipResultStatus } from '@pages/SignUp/constants';
import { routePaths } from '@routes/paths';
import openInternalWebview from '@utilities/gmCommon/openInternalWebview';
import { moveNext } from '@utilities/index';

import { ButtonResultLabel, VerifyMembershipResultMessages } from './constants';

const VerifyMembershipResult = ({ type, onNavigateVerifyMembership }) => {
  const { moveHomeNative, moveHomeAndLoginNative } = useMove();

  const { translate: t } = useContext(SignUpContext);
  const handleNavigateHome = () => {
    moveHomeNative();
  };

  const handleNavigateBranchInfo = () => {
    openInternalWebview({
      url: externalUrls.branchInfo,
      title: '',
    });
  };

  const handleNavigateAppointmentMain = () => {
    moveNext(MENU_CODE.APPOINTMENT_MAIN, {}, routePaths.appointment);
  };

  const handleConfirm = () => {
    if (type === VerifyMembershipResultStatus.ALREADY_INDIVIDUAL) {
      return moveHomeAndLoginNative();
    } else if (type === VerifyMembershipResultStatus.ALREADY_CORPORATE) {
      return openInternalWebview({
        url: externalUrls.sbank,
        title: '',
      });
    } else if (type === VerifyMembershipResultStatus.FAILED) {
      return onNavigateVerifyMembership();
    }
  };

  return (
    <>
      <div className="page-success page-gradient">
        <div className="success__header">
          <div className="success__img">
            <img
              src={type === VerifyMembershipResultStatus.FAILED ? errorImg : successImg}
              alt="Complete"
            />
          </div>
          <div className="success__title">
            <div>{t(VerifyMembershipResultMessages[type]?.title)}</div>
          </div>
          <div className="note">{t(VerifyMembershipResultMessages[type]?.description)}</div>
          <div className="mt-4">
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
            label={t(labels.reservation)}
            icon={<img src={ReserveIcon} />}
            onClick={handleNavigateAppointmentMain}
          />
        </div>
      </div>

      <div className="footer__fixed">
        <Button
          variant="filled__secondary-blue"
          label={t(labels.home)}
          className="btn__cta"
          onClick={handleNavigateHome}
        />
        <Button
          variant="filled__primary"
          label={t(ButtonResultLabel[type])}
          className="btn__cta"
          onClick={handleConfirm}
        />
      </div>
    </>
  );
};

export default VerifyMembershipResult;
