import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import InfoBox from '@common/components/atoms/InfoBox';
import EnterAmountBottom from '@common/components/organisms/bottomSheets/EnterAmountBottom';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import SelectDateBottom from '@common/components/organisms/bottomSheets/SelectDateBottom';
import SelectTermsBottom from '@common/components/organisms/bottomSheets/SelectTermsBottom';
import SelectTimeBottom from '@common/components/organisms/bottomSheets/SelectTimeBottom';
import ViewMapBottom from '@common/components/organisms/bottomSheets/ViewMapBottom';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import Header from '@common/components/organisms/Header';
import { MENU_CODE } from '@common/constants/common';
import { CurrencyCode } from '@common/constants/currency';
import { SelectTermDurationTypes } from '@common/constants/terms';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import callCamera from '@utilities/gmCommon/callCamera';
import callSelectImage from '@utilities/gmCommon/callSelectImage';
import initProfileImg from '@utilities/gmCommon/initProfileImg';
import loadProfileImgInfo from '@utilities/gmCommon/loadProfileImgInfo';
import saveProfileImg from '@utilities/gmCommon/saveProfileImg';
import authSecurityMedia from '@utilities/gmSecure/authSecurityMedia';
import createSecurityPasscode from '@utilities/gmSecure/createSecurityPasscode';
import hideSecureKeyboardChar from '@utilities/gmSecure/hideSecureKeyboardChar';
import hideSecureKeyboardNumber from '@utilities/gmSecure/hideSecureKeyboardNumber';
import showCertificationChar from '@utilities/gmSecure/showCertificationChar';
import showSecureKeyboardNumber from '@utilities/gmSecure/showSecureKeyboardNumber';
import { callPhone, clearHistory, decryptCVC, getLoginInfo, moveBack, moveHome, moveNext } from '@utilities/index';
import homeAndLogin from '@utilities/navigateScreen/homeAndLogin';
import { setAuthenticated } from 'shared/features/auth/action';

import { submitLoginRequest } from '../Login/redux/action';
import { loginReducer } from '../Login/redux/reducer';
import { loginSaga } from '../Login/redux/saga';
import { loginStatusMsg, loginStatusSelector } from '../Login/redux/selector';
import { FeatureLoginName } from '../Login/redux/type';

const CommonTestPage = () => {
  const [showBottomSheet, setShowBottomSheet] = useState({
    bottomAccount: false,
    reportLost: false,
    cardBlock: false,
    releaseBlockCard: false,
    unlockCard: false,
    manageLimit: false,
    decryptCVC: false,
    MyAccountsBottom: false,
    ViewTermBottom: false,
    ViewMapBottom: false,
    SelectDateBottom: false,
    SelectTimeBottom: false,
    SelectTermsBottom: false,
  });

  const defaultAccount = {
    user_id: 'DOOLY94',
    password: 'qwer1234',
  };
  const [accountInfo, setaccountInfo] = useState(defaultAccount);
  const [loginInfo, setLoginInfo] = useState(null);
  const [showCompletedPage, setShowCompletedPage] = useState(false);

  const [cvcText, setCVCText] = useState('aJAQjrapJCfRhy/+k13how==');
  const loginMessage = useSelector(loginStatusMsg);
  const [selectAccount, setSelectedAccount] = useState();
  const [selectAmount, setSelectedAmount] = useState();
  const [selectTerm, setSelectTerm] = useState();

  // select date , time
  const [selectDate, setSelectDate] = useState({
    date: `${new Date().getMonth() + 1}.${new Date().getFullYear()}`,
  });
  const [selectTime, setSelectTime] = useState({
    time: `${new Date().getHours() % 12} ${new Date().getHours() > 12 ? 'PM' : 'AM'}`,
  });

  // Login
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
      uicc_id: 'x6BcpPoe9rVti6Jy2i/6iNwIe83Qjv4vVixo8MgZ1ds=',
      login_type: '1',
      user_id: accountInfo?.user_id,
      USER_PWD: accountInfo?.password,
      auth_key: '',
      token_id: '512088810006623',
      cusno: '',
    };
    submitLoginRequest(userInfo);
  };

  const handleViewHistory = () => {};

  const handleCallCameraCallback = data => {
    console.log('camera data :>> ', data);
  };

  const handleCallSelectImageCallback = data => {
    console.log('select image data :>> ', data);
  };

  const handleLoadProfileImgInfoCallback = data => {
    console.log('load profile image data :>> ', data);
  };

  const handleSaveProfileImgCallback = data => {
    console.log('save profile image data :>> ', data);
  };

  const handleInitProfileImgCallback = data => {
    console.log('init profile image data :>> ', data);
  };

  const handleShowKeyboardCharCallback = data => {
    console.log('show secure keyboard char data :>> ', data);
  };

  const handleHideKeyboardCharCallback = data => {
    console.log('hide secure keyboard char data :>> ', data);
  };

  const handleShowKeyboardNumberCallback = data => {
    console.log('show secure keyboard number data :>> ', data);
  };

  const handleHideKeyboardNumberCallback = data => {
    console.log('hide secure keyboard number data :>> ', data);
  };

  const handleAuthSecurityMedia = () => {
    console.log('auth security media success');
  };

  const handleCreateSecurityPasscodeCallback = result => {
    console.log('create security passcode result', result);
  };

  const handleShowCertificationCharCallback = result => {
    console.log('Show Certification Char Callback data:>>', result);
  };

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
        { title: 'Sign up test API page', label: 'move', action: () => moveNext(MENU_CODE.SIGN_UP) },
        { title: 'Home and Login', label: 'homeAndLogin', action: () => homeAndLogin() },
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
        {
          title: 'Call Camera',
          label: 'callCamera',
          action: () => callCamera(handleCallCameraCallback),
        },
        {
          title: 'Call Select Image',
          label: 'callSelectImage',
          action: () => callSelectImage(handleCallSelectImageCallback),
        },
        {
          title: 'Load Profile Image Info',
          label: 'loadProfileImgInfo',
          action: () => loadProfileImgInfo(handleLoadProfileImgInfoCallback),
        },
        {
          title: 'Save Profile Image',
          label: 'saveProfileImg',
          action: () => saveProfileImg(handleSaveProfileImgCallback),
        },
        {
          title: 'Init Profile Image',
          label: 'initProfileImg',
          action: () => initProfileImg(handleInitProfileImgCallback),
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
        {
          title: 'Auth Security Media',
          label: 'authSecurityMedia',
          action: () => authSecurityMedia(handleAuthSecurityMedia),
        },
        {
          title: 'Create Security Passcode',
          label: 'createSecurityPasscode',
          action: () => createSecurityPasscode(handleCreateSecurityPasscodeCallback),
        },
        {
          title: 'Show Certification Keyboard Char',
          label: 'showCertificationChar',
          action: () => showCertificationChar(handleShowCertificationCharCallback),
        },
        {
          title: 'Hide Secure Keyboard Char',
          label: 'hideSecureKeyboardChar',
          action: () => hideSecureKeyboardChar(handleHideKeyboardCharCallback),
        },
        {
          title: 'Show Secure Keyboard Number',
          label: 'showSecureKeyboardNumber',
          action: () =>
            showSecureKeyboardNumber({
              title: 'TEST SECURE KEYBOARD NUMBER',
              description: 'Please enter passcode!',
              maxLength: 6,
              errMsg: '',
            }),
        },
        {
          title: 'Hide Secure Keyboard Number',
          label: 'hideSecureKeyboardNumber',
          action: () => hideSecureKeyboardNumber(handleHideKeyboardNumberCallback),
        },
      ],
    },
    {
      label: '• Test BS',
      items: [
        {
          title: 'Get Account list',
          label: 'Account List',
          action: () => setShowBottomSheet({ ...showBottomSheet, MyAccountsBottom: true }),
        },
        {
          title: 'Enter Amount',
          label: 'Enter Amount',
          action: () => setShowBottomSheet({ ...showBottomSheet, EnterAmountBottom: true }),
        },

        {
          title: 'View Term',
          label: 'View Term',
          action: () => setShowBottomSheet({ ...showBottomSheet, ViewTermBottom: true }),
        },
        {
          title: 'View Map',
          label: 'View Map',
          action: () => setShowBottomSheet({ ...showBottomSheet, ViewMapBottom: true }),
        },
        {
          title: 'Select Date',
          label: 'Select Date',
          action: () => setShowBottomSheet({ ...showBottomSheet, SelectDateBottom: true }),
        },
        {
          title: 'Select Time',
          label: 'Select Time',
          action: () => setShowBottomSheet({ ...showBottomSheet, SelectTimeBottom: true }),
        },
        {
          title: 'Select Term',
          label: 'Select Term',
          action: () => setShowBottomSheet({ ...showBottomSheet, SelectTermsBottom: true }),
        },
      ],
    },
  ];

  return (
    <>
      <div className="common__test__wrapper">
        {renderNotify()}
        <Header title={'Common Test Page'} />
        <section className="login__field">
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
              <option value="WTLEE815">WTLEE815</option>
              <option value="HANNADIK1">HANNADIK1</option>
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
        </section>

        <MyAccountsBottom
          open={showBottomSheet.MyAccountsBottom}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, MyAccountsBottom: false })}
          onSelect={account => {
            setSelectedAccount();
            setSelectedAccount(account);
            setShowBottomSheet({ ...showBottomSheet, MyAccountsBottom: false });
          }}
        />
        {showBottomSheet.EnterAmountBottom && (
          <EnterAmountBottom
            onClose={() => setShowBottomSheet({ ...showBottomSheet, EnterAmountBottom: false })}
            account={selectAccount}
            currency={CurrencyCode.CAD}
            amount={selectAmount}
            min={100}
            max={99999}
            onChangeAmount={result => {
              setSelectedAmount(result.amount);
              console.log(selectAmount);
            }}
          />
        )}

        <ViewTermBottom
          open={showBottomSheet.ViewTermBottom}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, ViewTermBottom: false })}
          onSelect={() => alert('Selected account')}
        />

        {/* {showBottomSheet.ViewMapBottom && ( */}
        <ViewMapBottom
          open={showBottomSheet.ViewMapBottom}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, ViewMapBottom: false })}
          branchData={{
            title: '72 Centec',
            caption: '72 Nguyen Thi Minh Khai, Vo Thi Sau',
            phone: '039-596-5416',
            fax: '416-250-3460',
            branchNo: '08048',
          }}
        />
        {/* )} */}

        <SelectDateBottom
          open={showBottomSheet.SelectDateBottom}
          maxYear="2040"
          minYear="1980"
          onClose={() => setShowBottomSheet({ ...showBottomSheet, SelectDateBottom: false })}
          onDateChange={date => {
            setSelectDate({ date });
            setShowBottomSheet({ ...showBottomSheet, SelectDateBottom: false });
          }}
          defaultDate={selectDate.date}
          type="MM/YYYY"
        />

        <SelectTimeBottom
          open={showBottomSheet.SelectTimeBottom}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, SelectTimeBottom: false })}
          onTimeChange={time => {
            setSelectTime({ time });
            setShowBottomSheet({ ...showBottomSheet, SelectTimeBottom: false });
          }}
          defaultTime={selectTime.time}
        />

        {showBottomSheet.SelectTermsBottom && (
          <SelectTermsBottom
            onClose={() => setShowBottomSheet({ ...showBottomSheet, SelectTermsBottom: false })}
            type={SelectTermDurationTypes.MONTH}
            onChange={term => {
              setSelectTerm(term);
              console.log(term);
            }}
            value={selectTerm}
            max={60}
            min={1}
          />
        )}

        {testRowData.map(data => renderNavigationEl(data.label, data.items))}
      </div>
    </>
  );
};

export default CommonTestPage;
