import { useContext } from 'react';

import reviewingImg from '@assets/images/sign-up-review-details.png';
import { updateEmailLabels as labels } from '@common/constants/labels';
import { UpdateEmailContext } from '@pages/UpdateEmail';

const IdentityVerifySubmitSuccess = () => {
  const { translate: t } = useContext(UpdateEmailContext);

  return (
    <>
      <div className="success__header pt-0">
        <div className="review__img">
          <img
            src={reviewingImg}
            alt="Complete"
          />
        </div>
        <div className="success__title">
          <span>{t(labels.yourRequestHasBeenSuccess)}</span>
        </div>
        <div className="note">{t(labels.afterReviewingYourSubmitted)}</div>
      </div>
    </>
  );
};

export default IdentityVerifySubmitSuccess;
