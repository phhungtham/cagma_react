import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Span from '@common/components/atoms/Span';
import Spinner from '@common/components/atoms/Spinner';
import useFocus from '@hooks/useFocus';
import useHttpStatus from '@hooks/useHttpStatus';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { routePaths } from '@routes/paths';
import { setAuthenticated } from 'shared/features/auth/action';
import { Http } from 'shared/features/http';

import { submitLoginRequest } from './redux/action';
import { loginReducer } from './redux/reducer';
import { loginSaga } from './redux/saga';
import { loginStatusMsg, loginStatusSelector } from './redux/selector';
import { ActionType, FeatureLoginName } from './redux/type';
import './styles.scss';

const listAccount = [
  'WTLEE815',
  'MYGODFIVE5',
  'PERS114',
  'CATEST24',
  'CATEST25',
  'CATEST26',
  'CATEST27',
  'CATEST28',
  'CATEST29',
  'CATEST30',
  'CATEST31',
  'CATEST32',
  'CATEST33',
  'CATEST34',
];

const Login = () => {
  useReducers([{ key: FeatureLoginName, reducer: loginReducer }]);
  useSagas([{ key: FeatureLoginName, saga: loginSaga }]);
  useFocus('userName');

  const { status } = useHttpStatus(ActionType.LOGIN_REQUEST);
  const navigate = useNavigate();
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      userName: 'WTLEE815',
      password: 'qwer1234',
    },
  });
  const isLoginSuccess = useSelector(loginStatusSelector);
  const loginMessage = useSelector(loginStatusMsg);
  const [currentAccount, setCurrentAccount] = useState('WTLEE815');

  const renderNotify = () => {
    if (isLoginSuccess) {
      return (
        <InfoBox
          label={'Login Successfully !!'}
          variant={'informative'}
        />
      );
    } else {
      return (
        <InfoBox
          label={loginMessage}
          variant={'negative'}
        />
      );
    }
  };

  useEffect(() => {
    if (isLoginSuccess) {
      setAuthenticated();
      navigate(routePaths.notification);
    }
  }, [isLoginSuccess]);

  const onSubmitLogin = data => {
    // username : DOOLY94
    // username : qwer1234
    const userInfo = {
      uicc_id: 'x6BcpPoe9rVti6Jy2i/6iNwIe83Qjv4vVixo8MgZ1ds=',
      login_type: '1',
      user_id: data?.userName,
      USER_PWD: data?.password,
      auth_key: '',
      token_id: '512088810006623',
      cusno: '',
    };
    submitLoginRequest(userInfo);
  };
  useEffect(() => {
    setValue('userName', currentAccount);
  }, [currentAccount]);

  return (
    <div className="login-wrapper">
      {status === Http.REQUESTING && <Spinner />}
      {status && <div className="notify">{renderNotify()}</div>}
      <div className="login-content">
        <div className="login-header">
          <div className="login-header-title">
            <Span
              clazz={'login-header-title-span'}
              text="Sign in To Continue"
            />
          </div>
        </div>
        <div className="login-form">
          <form onSubmit={handleSubmit(onSubmitLogin)}>
            <div className="input__group">
              <Controller
                render={({ field }) => (
                  <Input
                    label={'User Name'}
                    type={'text'}
                    placeholder={'User Name'}
                    {...field}
                  />
                )}
                control={control}
                name="userName"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    value="qwer1234"
                    label="Password"
                    type="password"
                    placeholder="Password"
                    {...field}
                  />
                )}
                control={control}
                name="password"
              />
            </div>
            <div className="select__list">
              <select
                className="select__item"
                onChange={e => setCurrentAccount(e.target.value)}
              >
                {listAccount.map((acc, idx) => (
                  <option
                    key={idx}
                    value={acc}
                  >
                    {acc}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="filled__primary"
              type="submit"
              label={'Login'}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
