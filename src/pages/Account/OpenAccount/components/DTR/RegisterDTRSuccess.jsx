import successImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';

const RegisterDTRSuccess = ({ onConfirm }) => {
  return (
    <>
      <div className="page-success">
        <div className="success__header">
          <div className="success__img">
            <img
              src={successImg}
              alt="Complete"
            />
          </div>
          {/* //TODO: Missing label */}
          <div className="success__title">
            <span>
              You’ve successfully registered <span className="text-primary">DTR</span>
            </span>
          </div>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          variant="filled__primary"
          label="Done" //TODO: Missing label
          className="btn__cta"
          onClick={onConfirm}
        />
      </div>
    </>
  );
};

export default RegisterDTRSuccess;
