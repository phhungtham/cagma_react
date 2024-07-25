import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import InfoBox from '@common/ui/components/atomic/InfoBox';
import Input from '@common/ui/components/atomic/Input/Input';
import Spinner from '@common/ui/components/atomic/Spinner';
import useFocus from '@hooks/useFocus';
import useHttpStatus from '@hooks/useHttpStatus';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import Span from 'common/ui/components/atomic/Span';
import { setAuthenticated } from 'shared/features/auth/action';
import { Http } from 'shared/features/http';
import { submitLoginRequest } from './redux/action';
import { loginReducer } from './redux/reducer';
import { loginSaga } from './redux/saga';
import { loginSelector, loginStatusMsg, loginStatusSelector } from './redux/selector';
import { ActionType, FeatureLoginName } from './redux/type';
import './styles.scss';

const listAccount = ['DOOLY94', 'DOOLY942', 'PERS13', 'PERS12', 'USER12', 'USER14', 'SING21', 'ENTRY41', 'ENTRY42'];

const Login = () => {
  useReducers([{ key: FeatureLoginName, reducer: loginReducer }]);
  useSagas([{ key: FeatureLoginName, saga: loginSaga }]);
  useFocus('userName');

  const { status, errors = [] } = useHttpStatus(ActionType.LOGIN_REQUEST);
  const navigate = useNavigate();
  const { handleSubmit, control, setValue } = useForm();
  const loginInfo = useSelector(loginSelector);
  const isLoginSuccess = useSelector(loginStatusSelector);
  const loginMessage = useSelector(loginStatusMsg);
  const [currentAccount, setCurrentAccount] = useState('DOOLY94');

  const renderNotify = () => {
    if (isLoginSuccess) {
      return <InfoBox label={'Login Successfully !!'} variant={'informative'} />;
    } else {
      return <InfoBox label={loginMessage} variant={'negative'} />;
    }
  };

  useEffect(() => {
    if (isLoginSuccess) {
      setAuthenticated();
      navigate('/cards');
    }
  }, [isLoginSuccess]);

  const onSubmitLogin = data => {
    // username : DOOLY94
    // username : qwer1234
    const userInfo = {
      uicc_id: 'LI5D+DstmWVPI6/WtlGr5grpywLN68+swhQMf33CC+o=',
      login_type: '1',
      user_id: data?.userName,
      USER_PWD: data?.password,
      auth_key: '',
      token_id: 'dfewtsfsfssf',
      cusno: ''
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
            <Span clazz={'login-header-title-span'} text="Sign in To Continue" />
          </div>
        </div>
        <div className="login-form">
          <form onSubmit={handleSubmit(onSubmitLogin)}>
            <div className="input__group">
              <Controller
                render={({ field }) => <Input label={'User Name'} type={'text'} placeholder={'User Name'} {...field} />}
                control={control}
                name="userName"
              />
              <Controller
                render={({ field }) => (
                  <Input value="qwer1234" label="Password" type="password" placeholder="Password" {...field} />
                )}
                control={control}
                name="password"
              />
            </div>
            <div className="select__list">
              <select className="select__item" onChange={e => setCurrentAccount(e.target.value)}>
                {listAccount.map((acc, idx) => (
                  <option key={idx} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="solid" iconPosition="right" type="submit" className={'login-form-btn'} label={'Login'} />
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
