import completeImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';

import { signUpSuccessFields } from './constants';

const test = {
  email: '12345@mail.com',
  id: 'FullIDName',
  password: 'Registered',
  secretPasscode: 'Registered',
};

const SignUpSuccess = ({ signUpInfo = test, onConfirm }) => {
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
            <div className="complete-message">Welcome to</div>
            <div className="text-primary">Shinhan Bank Canada</div>
          </div>
        </div>
        <div className="divider__item__black" />
        <div className="success__info">
          {signUpSuccessFields.map(({ label, value }) => (
            <div
              className="success-info__item"
              key={value}
            >
              <span className="success-info__label">{label}</span>
              <span className="success-info__value">
                <span>{signUpInfo?.[value]}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          variant="filled__primary"
          label="Done"
          className="btn__cta"
          onClick={onConfirm}
        />
      </div>
    </>
  );
};

export default SignUpSuccess;
