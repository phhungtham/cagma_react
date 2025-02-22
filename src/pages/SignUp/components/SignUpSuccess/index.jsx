import { useContext, useEffect, useState } from 'react';

import completeImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { signUpCompleteLabels as labels } from '@common/constants/labels';
import useMove from '@hooks/useMove';
import { SignUpContext } from '@pages/SignUp';
import motpSuccessHandle from '@utilities/gmCommon/motpSuccessHandle';

import { signUpSuccessFields } from './constants';

const SignUpSuccess = () => {
  const { ekycCached, translate: t, userId, isNavigateFromLogin } = useContext(SignUpContext);
  const [signUpSuccessInfo, setSignUpSuccessInfo] = useState();
  const { moveHomeNative, moveHomeAndLoginNative } = useMove();

  const handleClickDone = () => {
    if (isNavigateFromLogin) {
      motpSuccessHandle();
    } else {
      moveHomeAndLoginNative();
    }
    moveHomeNative();
  };

  useEffect(() => {
    setSignUpSuccessInfo({
      email: ekycCached?.email || '',
      userId,
      password: 'Registered',
      secretPasscode: 'Registered',
    });
  }, [ekycCached]);

  return (
    <>
      <div className="page-success page-gradient">
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
        <div className="success__info flex-gap-y-16">
          {signUpSuccessFields.map(({ label, value }) => (
            <div
              className="success-info__item flex-gap-x-16"
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
          onClick={handleClickDone}
        />
      </div>
    </>
  );
};

export default SignUpSuccess;
