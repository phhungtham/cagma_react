import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';
import Span from '@common/components/atoms/Span';
import Spinner from '@common/components/atoms/Spinner';
import { isDevelopmentEnv } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import useHttpStatus from '@hooks/useHttpStatus';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { routePaths } from '@routes/paths';
import { moveNext } from '@utilities/index';
import { setCurrentLanguage } from 'app/redux/action';
import { appLanguage } from 'app/redux/selector';
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
  'TIPTOP93',
  'MYGODFIVE5',
  'PERS114',
  'SOLTEST01',
  'SOLTEST02',
  'SOLTEST04',
  'ANNASE0',
  'GMLRUD3174',
  'SHINHAN24',
  'HANNADIK1',
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

const languages = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Korean',
    value: 'ko',
  },
];
const Login = () => {
  useReducers([{ key: FeatureLoginName, reducer: loginReducer }]);
  useSagas([{ key: FeatureLoginName, saga: loginSaga }]);
  const { requestApi } = useApi();

  const { status } = useHttpStatus(ActionType.LOGIN_REQUEST);
  const currentLanguage = useSelector(appLanguage);
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
      if (isDevelopmentEnv) {
        localStorage.setItem('isLogin', true);
      }
      moveNext('', { param: JSON.stringify({ isFromLogin: true }) }, routePaths.signUp);
    }
  }, [isLoginSuccess]);

  const handleLogout = async e => {
    if (isDevelopmentEnv) {
      localStorage.removeItem('isLogin');
    }
    e.preventDefault();
    await requestApi(endpoints.logout);
  };

  const handleSubmitLogin = data => {
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
          <form>
            <div className="input__group">
              <Controller
                render={({ field }) => (
                  <Input
                    label={'User Name'}
                    type={'text'}
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
            <div className="mt-4 flex-center gap-2">
              <Button
                variant="filled__secondary-blue"
                type="submit"
                label="Logout"
                className="w-full"
                onClick={handleLogout}
              />
              <Button
                variant="filled__primary"
                type="button"
                label="Login"
                className="w-full"
                onClick={handleSubmit(handleSubmitLogin)}
              />
            </div>
          </form>
          <div className="mt-6">
            <BoxRadio
              options={languages}
              value={currentLanguage?.language}
              onChange={value => setCurrentLanguage({ language: value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
