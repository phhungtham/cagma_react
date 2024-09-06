import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import InfoBox from '@common/components/atoms/InfoBox';
import Header from '@common/components/organisms/Header';
import { MENU_CODE } from '@configs/global/constants';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import {
  callPhone,
  clearHistory,
  decryptCVC,
  getLoginInfo,
  hideCertificationNumber,
  moveBack,
  moveHome,
  moveNext,
  showCertificationNumber,
} from '@utilities/index';
import { setAuthenticated } from 'shared/features/auth/action';

import { submitLoginRequest } from '../Login/redux/action';
import { loginReducer } from '../Login/redux/reducer';
import { loginSaga } from '../Login/redux/saga';
import { loginStatusMsg, loginStatusSelector } from '../Login/redux/selector';
import { FeatureLoginName } from '../Login/redux/type';

const CommonTestPage = () => {
  const defaultAccount = {
    user_id: 'DOOLY94',
    password: 'qwer1234',
  };
  const [accountInfo, setaccountInfo] = useState(defaultAccount);
  const [loginInfo, setLoginInfo] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState({
    bottomAccount: false,
    reportLost: false,
    cardBlock: false,
    releaseBlockCard: false,
    unlockCard: false,
    manageLimit: false,
    decryptCVC: false,
  });
  const [showCompletedPage, setShowCompletedPage] = useState(false);
  const [cvcText, setCVCText] = useState('aJAQjrapJCfRhy/+k13how==');
  const loginMessage = useSelector(loginStatusMsg);

  useReducers([{ key: FeatureLoginName, reducer: loginReducer }]);
  useSagas([{ key: FeatureLoginName, saga: loginSaga }]);
  const handleChangeAccountInfo = value => {
    setaccountInfo({ ...accountInfo, ...value });
  };
  const isLoginSuccess = useSelector(loginStatusSelector);
  const navigate = useNavigate();

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

  const onSubmitLogin = () => {
    const userInfo = {
      uicc_id: 'LI5D+DstmWVPI6/WtlGr5grpywLN68+swhQMf33CC+o=',
      login_type: '1',
      user_id: accountInfo?.user_id,
      USER_PWD: accountInfo?.password,
      auth_key: '',
      token_id: 'dfewtsfsfssf',
      cusno: '',
    };
    submitLoginRequest(userInfo);
  };

  const handleViewHistory = () => {};

  const handleBackToHome = () => {
    moveBack();
  };

  const handleLoginInfo = result => {
    alert(JSON.stringify(result));
    setLoginInfo(result);
  };

  const handleDecryptCVC = () => {
    decryptCVC(cvcText, decryptCVCCallback);
  };

  const decryptCVCCallback = result => {
    alert(JSON.stringify(result));
  };

  const renderNavigationEl = (sectionLabel, items) => {
    return (
      <section className="navigation__plugin">
        <p>{sectionLabel}</p>
        <ul className="table__cus">
          {items.map(item => {
            const { title, label, action } = item;
            return (
              <li>
                <section className="title">{title}</section>
                <section className="content">
                  <button onClick={() => action()}> {label}</button>
                </section>
              </li>
            );
          })}
        </ul>
      </section>
    );
  };

  useEffect(() => {
    if (isLoginSuccess) {
      setAuthenticated();
    }
  }, [isLoginSuccess]);

  const testRowData = [
    {
      label: '• NavigationPlugin',
      items: [
        { title: 'Move', label: 'move', action: () => moveNext(MENU_CODE.ACCOUNT) },
        { title: 'Back', label: 'back', action: () => moveBack() },
        { title: 'Clear History', label: 'clear history', action: () => clearHistory(MENU_CODE.ACCOUNT) },
        { title: 'Home', label: 'home', action: () => moveHome() },
        { title: 'Move', label: 'move', action: () => moveNext(MENU_CODE.ACCOUNT) },
      ],
    },
    {
      label: '• ShowSecureKeypad',
      items: [
        {
          title: 'Show Certification Number',
          label: 'show certification',
          action: () =>
            showCertificationNumber({ title: 'Title', description: 'Description', maxLength: 4, errMsg: '' }),
        },
        { title: 'Hide Certification Number', label: 'hide certification', action: () => hideCertificationNumber() },
      ],
    },
    {
      label: '• GMCommon',
      items: [
        {
          title: 'Get LoginInfo',
          label: 'getLoginInfo',
          action: () => getLoginInfo(handleLoginInfo),
        },
        {
          title: 'Call Phone',
          label: 'callPhone',
          action: () => callPhone('0221518419'),
        },
      ],
    },
    {
      label: '• GMSecure',
      items: [
        {
          title: 'Decrypt CVC',
          label: 'decryptCVC',
          action: () => setShowBottomSheet({ ...showBottomSheet, decryptCVC: true }),
        },
      ],
    },
  ];

  return (
    <>
      <div className="common__test__wrapper">
        {renderNotify()}
        <Header title={'Common Test Page'} />
        {/* <section className="login__field">
          <section className="language__wrapper">
            <span className="title">Language</span>
            <select
              name="language"
              id="language"
            >
              <option value="eng">English</option>
              <option value="ko">Korea</option>
            </select>
          </section>
          <section className="account__wrapper">
            <span className="title">Account</span>
            <select
              name="user__id"
              id="account"
              defaultValue={defaultAccount.user_id}
              onChange={e => handleChangeAccountInfo({ user_id: e.target.value })}
            >
              <option value="DOOLY94">DOOLY94</option>
              <option value="YOUNGDOL1">YOUNGDOL1</option>
            </select>
            <input
              onChange={e => handleChangeAccountInfo({ password: e.target.value })}
              name="password"
              defaultValue={defaultAccount.password}
            />
          </section>
          <section className="button__wrapper">
            <button onClick={onSubmitLogin}>login</button>
            <button>logout</button>
          </section>
        </section> */}
        {testRowData.map(data => renderNavigationEl(data.label, data.items))}
      </div>
    </>
  );
};

export default CommonTestPage;
