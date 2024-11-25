import successImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { openAccountDTRLabels as labels } from '@common/constants/labels';

const RegisterDTRSuccess = ({ onConfirm, translate: t }) => {
  return (
    <>
      <div className="page-success page-gradient">
        <div className="success__header">
          <div className="success__img">
            <img
              src={successImg}
              alt="Complete"
            />
          </div>
          <div className="success__title">
            <span>
              {t(labels.youHaveSuccessfully)} <span className="text-primary">{t(labels.dtr)}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          variant="filled__primary"
          label={t(labels.done)}
          className="btn__cta"
          onClick={onConfirm}
        />
      </div>
    </>
  );
};

export default RegisterDTRSuccess;
