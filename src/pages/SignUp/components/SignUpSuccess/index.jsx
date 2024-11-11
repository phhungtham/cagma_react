import { useContext, useEffect, useState } from 'react';

import completeImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { signUpCompleteLabels as labels } from '@common/constants/labels';
import { SignUpContext } from '@pages/SignUp';
import { moveHome } from '@utilities/index';

import { signUpSuccessFields } from './constants';

const SignUpSuccess = () => {
  const { ekycCached, translate: t } = useContext(SignUpContext);
  const [signUpSuccessInfo, setSignUpSuccessInfo] = useState();

  useEffect(() => {
    setSignUpSuccessInfo({
      ...ekycCached,
      password: 'Registered',
      secretPasscode: 'Registered',
    });
  }, [ekycCached]);

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
            <div className="complete-message">{t(labels.welcomeTo)}</div>
            <div className="text-primary">{t(labels.shinhanBankCanada)}</div>
          </div>
        </div>
        <div className="divider__item__black" />
        <div className="success__info">
          {signUpSuccessFields.map(({ label, value }) => (
            <div
              className="success-info__item"
              key={value}
            >
              <span className="success-info__label">{t(label)}</span>
              <span className="success-info__value">
                <span>{signUpSuccessInfo?.[value]}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          variant="filled__primary"
          label={t(labels.done)}
          className="btn__cta"
          onClick={moveHome}
        />
      </div>
    </>
  );
};

export default SignUpSuccess;
