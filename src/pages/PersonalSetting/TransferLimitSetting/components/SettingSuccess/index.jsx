import completeImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { ctaLabels } from '@common/constants/labels';
import { moveHome } from '@utilities/index';

import { transferLimitMessages } from '../../constants';
import './styles.scss';

const TransferLimitSettingSuccess = ({ type, translate: t }) => {
  const handleNavigateHome = () => {
    moveHome();
  };

  return (
    <>
      <div className="page-success">
        <div className="success__header">
          <div className="success__img">
            <img
              src={completeImg}
              alt="Complete"
            />
          </div>
          <div className="success__title">
            <div className="complete-message">
              <div dangerouslySetInnerHTML={{ __html: transferLimitMessages[type]?.successMessage }} />
            </div>
          </div>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          variant="filled__primary"
          label={t(ctaLabels.confirm3)}
          className="btn__cta"
          onClick={handleNavigateHome}
        />
      </div>
    </>
  );
};

export default TransferLimitSettingSuccess;
