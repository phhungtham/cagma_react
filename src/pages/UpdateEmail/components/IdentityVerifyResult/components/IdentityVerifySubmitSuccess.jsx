import { useContext } from 'react';

import completeImg from '@assets/images/complete.png';
import { updateEmailLabels as labels } from '@common/constants/labels';
import { UpdateEmailContext } from '@pages/UpdateEmail';

const IdentityVerifySubmitSuccess = () => {
  const { translate: t } = useContext(UpdateEmailContext);

  return (
    <>
      <div className="success__header">
        <div className="completed__img">
          <img
            src={completeImg}
            alt="Complete"
          />
        </div>
        <div className="success__title">
          <span>{t(labels.yourRequestHasBeenSuccess)}</span>
        </div>
        {/* remove label */}
        {/* <div className="note">{t(labels.afterReviewingYourSubmitted)}</div>  */}
      </div>
    </>
  );
};

export default IdentityVerifySubmitSuccess;
