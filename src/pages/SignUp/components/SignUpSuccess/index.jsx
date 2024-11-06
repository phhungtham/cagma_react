import { useEffect, useState } from 'react';

import completeImg from '@assets/images/complete.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import getEkycInfo from '@utilities/gmCommon/getEkycInfo';
import { moveHome } from '@utilities/index';

import { signUpSuccessFields } from './constants';

const SignUpSuccess = () => {
  const [ekycPluginInfo, setEkycPluginInfo] = useState();

  const getEkycInfoCallback = result => {
    setEkycPluginInfo({
      ...result,
      password: 'Registered',
      secretPasscode: 'Registered',
    });
  };

  useEffect(() => {
    getEkycInfo(getEkycInfoCallback);
  }, []);

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
                <span>{ekycPluginInfo?.[value]}</span>
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
          onClick={moveHome}
        />
      </div>
    </>
  );
};

export default SignUpSuccess;
